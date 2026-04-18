const RecordingArchive = {
  dbName: 'pte-recording-archive-v1',
  storeName: 'recordings',
  bucket: 'speaking-recordings',
  maxPerQuestionLocal: 3,
  maxPerUserLocal: 50,
  maxPerUserCloud: 100,
  db: null,

  async open() {
    if (this.db) return this.db;
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('userQuestionCreatedAt', ['userId', 'questionId', 'createdAt']);
        }
      };
      request.onsuccess = () => resolve(request.result);
    });
    return this.db;
  },

  async withStore(mode, fn) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, mode);
      const store = tx.objectStore(this.storeName);
      let settled = false;
      tx.oncomplete = () => {
        if (!settled) resolve(undefined);
      };
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
      Promise.resolve(fn(store, tx))
        .then((value) => {
          settled = true;
          resolve(value);
        })
        .catch(reject);
    });
  },

  normalizeLocalRecord(record = {}) {
    return {
      id: record.id,
      userId: record.userId,
      questionId: record.questionId,
      createdAt: record.createdAt,
      duration: Number(record.duration || 0),
      localScore: typeof record.localScore === 'number' ? record.localScore : null,
      blob: record.blob || null,
      mimeType: record.mimeType || record.blob?.type || 'audio/wav',
      audioPath: record.audioPath || '',
      source: 'local',
    };
  },

  async ensurePlayableBlob(blob, preferredMimeType = '') {
    if (!(blob instanceof Blob) || blob.size <= 0) return null;
    const mimeType = preferredMimeType || blob.type || '';
    if (/wav/i.test(mimeType)) {
      const validation = await this.validateBlob(blob, mimeType);
      return validation.valid ? blob : null;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      const arrayBuffer = await blob.arrayBuffer();
      const context = new AudioCtx();
      const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
      if (typeof context.close === 'function') {
        await context.close().catch(() => {});
      }
      const wavBlob = this.audioBufferToWavBlob(audioBuffer);
      const validation = await this.validateBlob(wavBlob, 'audio/wav');
      return validation.valid ? wavBlob : null;
    } catch (error) {
      console.error('[RecordingArchive] Failed to normalize audio blob.', error);
      return null;
    }
  },

  audioBufferToWavBlob(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels || 1;
    const sampleRate = audioBuffer.sampleRate || 44100;
    const samples = audioBuffer.length || 0;
    const bytesPerSample = 2;
    const blockAlign = numberOfChannels * bytesPerSample;
    const buffer = new ArrayBuffer(44 + samples * blockAlign);
    const view = new DataView(buffer);

    const writeString = (offset, text) => {
      for (let i = 0; i < text.length; i += 1) {
        view.setUint8(offset + i, text.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * blockAlign, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * blockAlign, true);

    let offset = 44;
    for (let i = 0; i < samples; i += 1) {
      for (let channel = 0; channel < numberOfChannels; channel += 1) {
        const channelData = audioBuffer.getChannelData(channel);
        const sample = Math.max(-1, Math.min(1, channelData[i] || 0));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += bytesPerSample;
      }
    }

    return new Blob([buffer], { type: 'audio/wav' });
  },

  async validateBlob(blob, mimeType = '') {
    if (!(blob instanceof Blob) || blob.size <= 0) return { valid: false, duration: 0 };
    if (!/^audio\/(wav|x-wav)$/i.test(mimeType || blob.type || '')) return { valid: false, duration: 0 };
    const url = URL.createObjectURL(blob);
    try {
      const duration = await this.getPlayableDuration(url);
      return { valid: duration > 0, duration };
    } finally {
      URL.revokeObjectURL(url);
    }
  },

  async validateRemoteAudio(url, mimeType = 'audio/wav') {
    if (!url || !/^audio\/(wav|x-wav)$/i.test(mimeType || 'audio/wav')) return { valid: false, duration: 0 };
    try {
      const duration = await this.getPlayableDuration(url);
      return { valid: duration > 0, duration };
    } catch (_error) {
      return { valid: false, duration: 0 };
    }
  },

  getPlayableDuration(url) {
    return new Promise((resolve, reject) => {
      const audio = document.createElement('audio');
      let settled = false;
      const cleanup = () => {
        audio.removeAttribute('src');
        audio.load();
      };
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        if (settled) return;
        settled = true;
        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        cleanup();
        resolve(duration > 0 ? duration : 0);
      };
      audio.onerror = () => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error('Audio metadata could not be loaded.'));
      };
      audio.src = url;
    });
  },

  async saveLocal(record) {
    const normalized = this.normalizeLocalRecord(record);
    await this.withStore('readwrite', (store) => {
      store.put(normalized);
    });
    await this.trimLocal(normalized.userId, normalized.questionId, this.maxPerQuestionLocal);
    await this.trimLocalForUser(normalized.userId, this.maxPerUserLocal);
    return normalized;
  },

  async updateLocal(id, patch = {}) {
    return this.withStore('readwrite', (store) => new Promise((resolve, reject) => {
      const getReq = store.get(id);
      getReq.onerror = () => reject(getReq.error);
      getReq.onsuccess = () => {
        const current = getReq.result;
        if (!current) {
          resolve(null);
          return;
        }
        const next = { ...current, ...patch };
        const putReq = store.put(next);
        putReq.onerror = () => reject(putReq.error);
        putReq.onsuccess = () => resolve(next);
      };
    }));
  },

  async trimLocal(userId, questionId, keep = 3) {
    const items = await this.listLocal(userId, questionId);
    const extra = items.slice(keep);
    if (!extra.length) return;
    await this.deleteLocal(extra.map((item) => item.id));
  },

  async listLocalForUser(userId) {
    return this.withStore('readonly', (store) => new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const rows = (request.result || [])
          .filter((item) => item?.userId === userId)
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        resolve(rows);
      };
    }));
  },

  async trimLocalForUser(userId, keep = 50) {
    const items = await this.listLocalForUser(userId);
    const extra = items.slice(keep);
    if (!extra.length) return;
    await this.deleteLocal(extra.map((item) => item.id));
  },

  scheduleCleanup(userId, questionId) {
    Promise.resolve()
      .then(async () => {
        if (userId) {
          await this.trimLocalForUser(userId, this.maxPerUserLocal);
          await this.trimCloudForUser(userId, this.maxPerUserCloud);
        }
        if (userId && questionId) {
          await this.trimLocal(userId, questionId, this.maxPerQuestionLocal);
        }
      })
      .catch((error) => {
        console.error('[RecordingArchive] Silent cleanup failed.', error);
      });
  },

  async deleteLocal(ids = []) {
    const validIds = ids.filter(Boolean);
    if (!validIds.length) return;
    await this.withStore('readwrite', (store) => {
      validIds.forEach((id) => store.delete(id));
    });
  },

  async listLocal(userId, questionId) {
    return this.withStore('readonly', (store) => new Promise((resolve, reject) => {
      const index = store.index('userQuestionCreatedAt');
      const range = IDBKeyRange.bound([userId, questionId, ''], [userId, questionId, '\uffff']);
      const request = index.getAll(range);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const rows = (request.result || [])
          .filter((item) => item && item.blob instanceof Blob && item.blob.size > 0 && /^audio\/(wav|x-wav)$/i.test(item.blob.type || item.mimeType || 'audio/wav'))
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        resolve(rows);
      };
    }));
  },

  async pruneInvalidLocal(userId, questionId) {
    const rows = await this.withStore('readonly', (store) => new Promise((resolve, reject) => {
      const index = store.index('userQuestionCreatedAt');
      const range = IDBKeyRange.bound([userId, questionId, ''], [userId, questionId, '\uffff']);
      const request = index.getAll(range);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    }));
    const invalidIds = [];
    for (const item of rows) {
      if (!item || !(item.blob instanceof Blob) || item.blob.size <= 0 || !/^audio\/(wav|x-wav)$/i.test(item.blob.type || item.mimeType || 'audio/wav')) {
        if (item?.id) invalidIds.push(item.id);
        continue;
      }
      const validation = await this.validateBlob(item.blob, item.mimeType || item.blob.type || 'audio/wav');
      if (!validation.valid && item?.id) invalidIds.push(item.id);
    }
    if (invalidIds.length) await this.deleteLocal(invalidIds);
  },

  async saveDraftForUser({ userId, questionId, blob, duration, localScore = null, mimeType = 'audio/webm' }) {
    if (!userId || !questionId || !(blob instanceof Blob) || blob.size <= 0) return null;
    const normalizedBlob = await this.ensurePlayableBlob(blob, mimeType);
    if (!(normalizedBlob instanceof Blob) || normalizedBlob.size <= 0) return null;
    const validation = await this.validateBlob(normalizedBlob, normalizedBlob.type || 'audio/wav');
    if (!validation.valid) return null;
    const normalizedMimeType = 'audio/wav';
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const record = await this.saveLocal({
      id,
      userId,
      questionId,
      createdAt,
      duration: Math.max(1, Math.round(validation.duration || duration || 0)),
      localScore,
      blob: normalizedBlob,
      mimeType: normalizedMimeType,
    });
    await this.uploadAndSync(record).catch((error) => {
      console.error('[RecordingArchive] Upload sync failed.', error);
    });
    this.scheduleCleanup(userId, questionId);
    return record;
  },

  async uploadAndSync(record) {
    const client = window.SupabaseService?.getClient?.();
    if (!client || !record?.userId || !record?.questionId || !(record.blob instanceof Blob)) return null;
    const timestamp = new Date(record.createdAt || Date.now()).getTime();
    const path = `${record.userId}/${timestamp}.wav`;
    const upload = await client.storage
      .from(this.bucket)
      .upload(path, record.blob, {
        contentType: 'audio/wav',
        upsert: false,
      });
    if (upload.error) throw upload.error;

    const payload = {
      id: record.id,
      user_id: record.userId,
      question_id: record.questionId,
      audio_path: path,
      created_at: record.createdAt,
      duration: record.duration,
      local_score: typeof record.localScore === 'number' ? record.localScore : null,
    };
    const insert = await client.from('recordings').insert(payload).select().single();
    if (insert.error) throw insert.error;

    await this.updateLocal(record.id, { audioPath: path });
    return { ...record, audioPath: path };
  },

  async updateScore(id, localScore) {
    const local = await this.updateLocal(id, { localScore });
    if (!local) return null;
    const client = window.SupabaseService?.getClient?.();
    if (client && local.audioPath && local.userId && local.questionId) {
      const update = await client
        .from('recordings')
        .update({ local_score: localScore })
        .eq('id', local.id)
        .eq('user_id', local.userId)
        .select()
        .single();
      if (update.error) {
        console.error('[RecordingArchive] Failed to sync local score.', update.error);
      }
    }
    this.scheduleCleanup(local.userId, local.questionId);
    return local;
  },

  async listCloudForUser(userId) {
    const client = window.SupabaseService?.getClient?.();
    if (!client || !userId) return [];
    const query = await client
      .from('recordings')
      .select('id, user_id, question_id, audio_path, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (query.error) {
      console.error('[RecordingArchive] Failed to fetch cloud recordings for cleanup.', query.error);
      return [];
    }
    return query.data || [];
  },

  async deleteCloudRecords(records = []) {
    const validRecords = records.filter((item) => item?.id);
    if (!validRecords.length) return;
    const client = window.SupabaseService?.getClient?.();
    if (!client) return;
    const paths = validRecords.map((item) => item.audio_path).filter(Boolean);
    if (paths.length) {
      const storageDelete = await client.storage.from(this.bucket).remove(paths);
      if (storageDelete.error) {
        console.error('[RecordingArchive] Failed to delete cloud storage objects.', storageDelete.error);
      }
    }
    const ids = validRecords.map((item) => item.id);
    const dbDelete = await client.from('recordings').delete().in('id', ids);
    if (dbDelete.error) {
      console.error('[RecordingArchive] Failed to delete cloud recording rows.', dbDelete.error);
    }
  },

  async trimCloudForUser(userId, keep = 100) {
    const items = await this.listCloudForUser(userId);
    const extra = items.slice(keep);
    if (!extra.length) return;
    await this.deleteCloudRecords(extra);
  },

  async listCloud(userId, questionId) {
    const client = window.SupabaseService?.getClient?.();
    if (!client || !userId || !questionId) return [];
    const query = await client
      .from('recordings')
      .select('id, user_id, question_id, audio_path, created_at, duration, local_score')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .order('created_at', { ascending: false })
      .limit(6);
    if (query.error) {
      console.error('[RecordingArchive] Failed to fetch cloud recordings.', query.error);
      return [];
    }
    const rows = query.data || [];
    const playable = await Promise.all(rows.map(async (item) => {
      if (!item?.audio_path || !/\.wav$/i.test(item.audio_path)) return null;
      const url = window.SupabaseService.getPublicStorageUrl(this.bucket, item.audio_path);
      if (!url) return null;
      const validation = await this.validateRemoteAudio(url, 'audio/wav');
      if (!validation.valid) return null;
      return {
        id: item.id,
        userId: item.user_id,
        questionId: item.question_id,
        createdAt: item.created_at,
        duration: Math.max(1, Math.round(validation.duration || Number(item.duration || 0))),
        localScore: typeof item.local_score === 'number' ? item.local_score : Number.isFinite(Number(item.local_score)) ? Number(item.local_score) : null,
        audioPath: item.audio_path,
        audioUrl: url,
        source: 'cloud',
      };
    }));
    return playable.filter(Boolean);
  },

  async materializeLocal(rows = []) {
    const items = await Promise.all(rows.map(async (item) => {
      if (!(item?.blob instanceof Blob) || item.blob.size <= 0) return null;
      const validation = await this.validateBlob(item.blob, item.mimeType || item.blob.type || 'audio/wav');
      if (!validation.valid) return null;
      return {
        ...item,
        duration: Math.max(1, Math.round(validation.duration || Number(item.duration || 0))),
        audioUrl: URL.createObjectURL(item.blob),
        source: 'local',
      };
    }));
    return items.filter(Boolean);
  },

  merge(localRows = [], cloudRows = []) {
    const byId = new Map();
    localRows.forEach((item) => {
      byId.set(item.id, { ...item });
    });
    cloudRows.forEach((item) => {
      const existing = byId.get(item.id);
      if (existing) {
        byId.set(item.id, {
          ...item,
          ...existing,
          audioUrl: existing.audioUrl || item.audioUrl,
          audioPath: existing.audioPath || item.audioPath,
          localScore: existing.localScore ?? item.localScore,
        });
      } else {
        byId.set(item.id, { ...item });
      }
    });
    return [...byId.values()]
      .filter((item) => item && item.audioUrl)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  },

  extensionForMime(mimeType = '') {
    if (/wav/i.test(mimeType)) return 'wav';
    if (/mpeg|mp3/i.test(mimeType)) return 'mp3';
    if (/mp4|m4a/i.test(mimeType)) return 'm4a';
    return 'webm';
  },
};

window.RecordingArchive = RecordingArchive;
