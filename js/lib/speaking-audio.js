const SpeakingAudio = {
  acceptedTypes: '.webm,.wav,.mp3,.m4a,.mp4,.aac,audio/webm,audio/wav,audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/x-aac,audio/3gpp,audio/3gpp2',
  maxBytes: 10 * 1024 * 1024,
  minDurationSeconds: 1,
  maxDurationSeconds: 60,

  formatDuration(seconds) {
    const total = Math.max(0, Math.round(seconds || 0));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  getExtension(name = '') {
    const parts = name.toLowerCase().split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
  },

  isSupportedFile(file) {
    const ext = this.getExtension(file?.name || '');
    return ['.webm', '.wav', '.mp3', '.m4a', '.mp4', '.aac'].includes(ext);
  },

  async inspectFile(file) {
    if (!file) throw new Error('Please choose an audio file before submitting.');
    if (!this.isSupportedFile(file) && !(file?.type || '').startsWith('audio/')) {
      throw new Error('Please upload a supported audio file such as webm, wav, mp3, m4a, mp4, or aac.');
    }
    if (file.size > this.maxBytes) throw new Error('Please keep audio files under 10 MB.');

    const previewUrl = URL.createObjectURL(file);
    try {
      const durationSeconds = await this.readDuration(previewUrl);
      if (durationSeconds < this.minDurationSeconds) {
        throw new Error('Please record at least 1 second of audio.');
      }
      if (durationSeconds > this.maxDurationSeconds) {
        throw new Error('Please keep recordings under 60 seconds for now.');
      }
      return {
        file,
        previewUrl,
        durationSeconds,
        mimeType: file.type || 'audio/webm',
        name: file.name || 'audio-recording',
      };
    } catch (error) {
      URL.revokeObjectURL(previewUrl);
      throw error;
    }
  },

  readDuration(previewUrl) {
    return new Promise((resolve, reject) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        resolve(audio.duration || 0);
      };
      audio.onerror = () => reject(new Error('We could not read that audio file. Please try another one.'));
      audio.src = previewUrl;
    });
  },

  revokePreview(session) {
    if (session?.previewUrl) {
      try { URL.revokeObjectURL(session.previewUrl); } catch (_error) {}
    }
  },

  renderCapturePanel({ title, helperText, session, uploadAction, clearUploadAction, submitAction, supportsRecording = true }) {
    const active = session?.activeAudio;
    const preview = active ? `
<div class="speaking-audio-preview">
  <div class="speaking-audio-preview-head">
    <div>
      <div class="speaking-audio-preview-title">${active.source === 'recording' ? t('audio_recorded') : t('audio_uploaded')}</div>
      <div class="speaking-audio-preview-meta">${Scorer.escapeHtml(active.name || 'audio file')} · ${this.formatDuration(active.durationSeconds)}</div>
    </div>
    ${active.source === 'upload' ? `<button class="btn btn-outline" type="button" onclick="${clearUploadAction}">${t('btn_remove_upload')}</button>` : ''}
  </div>
  <audio class="result-audio-player" controls src="${active.previewUrl}"></audio>
</div>` : '';

    return `
<div class="speaking-audio-panel">
  <div class="speaking-audio-panel-head">
    <div class="card-title" style="margin-bottom:4px">${title}</div>
    <div class="speaking-audio-panel-copy">${helperText}</div>
  </div>
  <div class="speaking-audio-panel-actions">
    <label class="btn btn-outline speaking-upload-btn">
      ${t('btn_upload_audio')}
      <input type="file" accept="${this.acceptedTypes}" style="display:none" onchange="${uploadAction}(event)">
    </label>
    ${supportsRecording ? `<span class="speaking-audio-alt">${t('audio_or_recorder')}</span>` : `<span class="speaking-audio-alt">${t('audio_no_recorder')}</span>`}
  </div>
  ${preview}
  <div class="speaking-audio-submit-row">
    <button class="btn btn-primary" onclick="${submitAction}()" ${active ? '' : 'disabled'}>${t('btn_submit_ai')}</button>
  </div>
</div>`;
  },

  mountStageLoader(targetEl, stages) {
    const messages = stages?.length ? stages : [
      'Uploading audio...',
      'Transcribing your response...',
      'Analyzing your speaking...',
      'Generating feedback...',
    ];
    let index = 0;
    targetEl.innerHTML = AIScorer.renderLoading(messages[index]);
    const timer = window.setInterval(() => {
      index = Math.min(index + 1, messages.length - 1);
      targetEl.innerHTML = AIScorer.renderLoading(messages[index]);
    }, 900);
    return () => window.clearInterval(timer);
  },
};

window.SpeakingAudio = SpeakingAudio;
