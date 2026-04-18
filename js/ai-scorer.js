const AIScorer = {
  recentRecordingsKey: 'pte_recent_question_recordings_v1',

  getBaseUrl() {
    const env = window.__PTE_ENV__ || {};
    const appConfig = window.APP_CONFIG || {};
    const hostname = window.location.hostname || '';
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    const fallbackApiBaseUrl = isLocalHost ? 'http://localhost:8000' : '';
    return (appConfig.API_BASE_URL || env.PTE_API_BASE_URL || window.PTE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, '');
  },

  getNetworkDebugMessage(error, endpoint = '') {
    const baseUrl = this.getBaseUrl();
    const target = `${baseUrl}${endpoint}`;
    console.error('API network error:', error);
    return `Unable to connect to AI scoring service. Target: ${target}.`;
  },

  buildUrl(path) {
    return `${this.getBaseUrl()}${path}`;
  },

  async getAuthToken() {
    if (!window.AppAuth || !AppAuth.isLoggedIn()) return '';
    if (typeof AppAuth.getAccessToken === 'function') {
      return (await AppAuth.getAccessToken()) || '';
    }
    return AppAuth.session?.access_token || '';
  },

  getErrorMessage(error, fallback = 'AI scoring is unavailable right now.') {
    const code = error?.code || '';
    if (code === 'AUTH_REQUIRED') return 'Sign in to use AI scoring';
    if (code === 'DAILY_LIMIT') return 'Daily AI scoring limit reached';
    if (code === 'TIMEOUT') return 'The AI scoring request timed out. Please try again.';
    if (code === 'SERVICE_UNAVAILABLE') return 'AI scoring service is temporarily unavailable.';
    if (code === 'PARSE_ERROR') return 'We could not read the scoring result. Please try again.';
    if (code === 'NETWORK_ERROR') return error?.message || 'Unable to connect to AI scoring service. Please try again.';
    if (code === 'REQUEST_FAILED') return error?.message || 'AI scoring request failed.';
    return error?.message || fallback;
  },

  buildHttpError(response, body, fallbackMessage) {
    console.error('API response error body:', body);
    const message = body?.error || body?.message || fallbackMessage || `AI scoring failed (HTTP ${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.code = 'REQUEST_FAILED';
    if (response.status === 401) error.code = 'AUTH_REQUIRED';
    else if (response.status === 429) error.code = message === 'Daily AI scoring limit reached' ? 'DAILY_LIMIT' : 'RATE_LIMIT';
    else if (response.status >= 500) error.code = 'SERVICE_UNAVAILABLE';
    return error;
  },

  async parseJsonResponse(response) {
    const rawText = await response.text();
    if (!rawText) return null;
    try {
      return JSON.parse(rawText);
    } catch (error) {
      console.error('API raw response body:', rawText);
      const parseError = new Error(response.ok ? 'We could not read the scoring result. Please try again.' : `AI scoring failed (HTTP ${response.status})`);
      parseError.code = response.ok ? 'PARSE_ERROR' : 'REQUEST_FAILED';
      parseError.status = response.status;
      throw parseError;
    }
  },

  async requestScore(payload) {
    if (!window.AppAuth || !AppAuth.isLoggedIn()) {
      const error = new Error('Sign in to use AI scoring');
      error.code = 'AUTH_REQUIRED';
      throw error;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const token = await this.getAuthToken();
      const url = this.buildUrl('/api/score');
      console.log('Calling API:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...payload,
          appLanguage: getAppLang(),
        }),
        signal: controller.signal,
      });

      const body = await this.parseJsonResponse(response);

      if (!response.ok || body?.success === false) {
        throw this.buildHttpError(response, body, `AI scoring failed (HTTP ${response.status})`);
      }

      return body.data;
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('The AI scoring request timed out. Please try again.');
        timeoutError.code = 'TIMEOUT';
        throw timeoutError;
      }
      if (error instanceof TypeError) {
        const networkError = new Error(this.getNetworkDebugMessage(error, '/api/score'));
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }
      console.error('API error:', error);
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  },

  async requestAudioScore({ file, payload }) {
    if (!window.AppAuth || !AppAuth.isLoggedIn()) {
      const error = new Error('Sign in to use AI scoring');
      error.code = 'AUTH_REQUIRED';
      throw error;
    }
    if (!file) {
      const error = new Error('Audio recording is unavailable. Please record again.');
      error.code = 'NO_AUDIO';
      throw error;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      const token = await this.getAuthToken();
      const formData = new FormData();
      formData.append('file', file, file.name || 'recording.webm');
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, String(value));
      });
      formData.append('appLanguage', getAppLang());

      const url = this.buildUrl('/api/score-audio');
      console.log('Calling API:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        signal: controller.signal,
      });

      const body = await this.parseJsonResponse(response);

      if (!response.ok || body?.success === false) {
        throw this.buildHttpError(response, body, `AI scoring failed (HTTP ${response.status})`);
      }

      return body.data;
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('The AI scoring request timed out. Please try again.');
        timeoutError.code = 'TIMEOUT';
        throw timeoutError;
      }
      if (error instanceof TypeError) {
        const networkError = new Error(this.getNetworkDebugMessage(error, '/api/score-audio'));
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }
      console.error('API error:', error);
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  },

  async scoreSpoken(params) {
    return this.requestScore({
      task: 'speaking',
      promptType: params.promptType || 'Read Aloud',
      transcript: params.transcript || '',
      questionText: params.questionText || null,
      referenceAnswer: params.referenceAnswer || null,
    });
  },

  async scoreWriting(params) {
    return this.requestScore({
      task: 'writing',
      promptType: params.promptType || 'Write Essay',
      transcript: params.transcript || '',
      questionText: params.questionText || null,
      referenceAnswer: params.referenceAnswer || null,
    });
  },

  async scoreDictation(params) {
    return this.requestScore({
      task: 'dictation',
      promptType: params.promptType || 'Write From Dictation',
      transcript: params.transcript || '',
      questionText: params.questionText || null,
      referenceAnswer: params.referenceAnswer || null,
    });
  },

  async scoreSummary(params) {
    return this.requestScore({
      task: 'summary',
      promptType: params.promptType || 'Summarize Spoken Text',
      transcript: params.transcript || '',
      questionText: params.questionText || null,
      referenceAnswer: params.referenceAnswer || null,
    });
  },

  async scoreAudio(params) {
    const sampleRate = params.sampleRateHertz
      || window.MicAccess?.stream?.getAudioTracks?.()[0]?.getSettings?.().sampleRate
      || 48000;
    return this.requestAudioScore({
      file: params.file,
      payload: {
        task: params.task || 'speaking',
        promptType: params.promptType || 'Read Aloud',
        questionText: params.questionText || '',
        referenceAnswer: params.referenceAnswer || '',
        mimeType: params.mimeType || params.file?.type || 'audio/webm',
        sampleRateHertz: sampleRate,
        durationSeconds: params.durationSeconds || '',
      },
    });
  },

  renderLoading(message) {
    return `<div class="card" style="margin-top:12px;text-align:center;padding:28px">
<div class="spinner" style="margin:0 auto 12px"></div>
<div style="font-size:14px;color:var(--text);font-weight:600">${message || t('score_analyzing')}</div>
<div style="font-size:13px;color:var(--text-light);margin-top:6px">${t('score_generating')}</div>
</div>`;
  },

  renderError(message) {
    return `<div style="background:#fff8ed;border:1px solid #f59e0b;border-radius:10px;padding:14px;font-size:13.5px;color:#92400e;margin-top:8px">
<strong>${t('score_unavailable')}</strong><br>${Scorer.escapeHtml(message)}
</div>`;
  },

  renderCompactStateCard({ score = 0, showScore = false, title = '', subtitle = '', feedback = [], actionHtml = '', extraHtml = '' } = {}) {
    const blocks = (Array.isArray(feedback) ? feedback : []).filter(Boolean).join('');
    return `
<div class="speaking-inline-panel">
  ${this.renderInlineFeedbackNotice({
    tone: showScore ? 'neutral' : 'warning',
    title: title || (getAppLang() === 'zh' ? '当前状态' : 'Current Status'),
    text: subtitle || t('score_scale'),
    actionHtml,
  })}
  ${blocks ? `<div class="speaking-inline-section">${blocks}</div>` : ''}
  ${extraHtml || ''}
</div>`;
  },

  renderCompactSubmissionCard({ score = 0, showScore = false, title = '', subtitle = '', audioUrl = '', feedback = [], actionHtml = '', extraHtml = '' } = {}) {
    const blocks = (Array.isArray(feedback) ? feedback : []).filter(Boolean).join('');
    return `
<div class="speaking-inline-panel">
  ${this.renderInlineFeedbackNotice({
    tone: showScore ? 'success' : 'neutral',
    title: title || (getAppLang() === 'zh' ? '录音已就绪' : 'Recording Ready'),
    text: subtitle || t('score_scale'),
    actionHtml,
    audioUrl,
  })}
  ${blocks ? `<div class="speaking-inline-section">${blocks}</div>` : ''}
  ${extraHtml || ''}
</div>`;
  },

  renderAuthGate() {
    return `<div style="background:#eef6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px;font-size:13.5px;color:#1d4ed8;margin-top:8px">
<strong>${t('score_sign_in_msg')}</strong><br>
<button class="btn btn-primary" style="margin-top:10px" onclick="AuthUI.open('login')">${t('btn_sign_in')}</button>
</div>`;
  },

  renderSpeakingQuestionLayout({ title = '', badge = '', progressLabel = '', timerHtml = '', instruction = '', recordingHtml = '', recentHtml = '', footerHtml = '' } = {}) {
    return `
<div class="speaking-exam-shell">
  <div class="speaking-exam-container">
    <div class="speaking-exam-header-row">
      <div class="speaking-exam-header-main">
        <div class="speaking-exam-title">${Scorer.escapeHtml(title)}</div>
        ${badge ? `<div class="speaking-exam-badge">${Scorer.escapeHtml(badge)}</div>` : ''}
      </div>
      <div class="speaking-exam-header-side">
        ${progressLabel ? `<div class="speaking-exam-progress">${Scorer.escapeHtml(progressLabel)}</div>` : ''}
        ${timerHtml || ''}
      </div>
    </div>
    <div class="speaking-exam-card speaking-exam-instruction">${Scorer.escapeHtml(instruction)}</div>
    ${recordingHtml || ''}
    ${recentHtml || ''}
    ${footerHtml || ''}
  </div>
</div>`;
  },

  renderRecordingCard({ state = 'idle', promptHtml = '', contentHtml = '', helperHtml = '' } = {}) {
    return `
<section class="speaking-exam-card speaking-record-card" data-state="${Scorer.escapeHtml(state)}">
  ${promptHtml ? `<div class="speaking-record-prompt">${promptHtml}</div>` : ''}
  ${contentHtml ? `<div class="speaking-record-content">${contentHtml}</div>` : ''}
  ${helperHtml ? `<div class="speaking-record-helper">${helperHtml}</div>` : ''}
</section>`;
  },

  renderCompactMetricTiles(metrics = []) {
    const items = (Array.isArray(metrics) ? metrics : [])
      .filter(item => typeof item?.value === 'number')
      .slice(0, 4)
      .map((item, index) => {
        const palette = this.getMetricPalette(index);
        return `
<div class="speaking-metric-tile ${palette.tint}">
  <div class="speaking-metric-label">${Scorer.escapeHtml(item.label)}</div>
  <div class="speaking-metric-score">${Number(item.value) || 0}<span>/90</span></div>
  ${item.desc ? `<div class="speaking-metric-copy">${Scorer.escapeHtml(item.desc)}</div>` : ''}
</div>`;
      })
      .join('');
    return items ? `<div class="speaking-metric-tiles">${items}</div>` : '';
  },

  renderInlineFeedbackNotice({ tone = 'neutral', title = '', text = '', actionHtml = '', audioUrl = '' } = {}) {
    return `
<div class="speaking-inline-notice ${Scorer.escapeHtml(tone)}">
  <div class="speaking-inline-notice-title">${Scorer.escapeHtml(title)}</div>
  ${text ? `<div class="speaking-inline-notice-copy">${Scorer.escapeHtml(text)}</div>` : ''}
  ${audioUrl ? `<audio class="result-audio-player speaking-inline-audio" controls preload="metadata" src="${Scorer.escapeHtml(audioUrl)}"></audio>` : ''}
  ${actionHtml ? `<div class="speaking-inline-actions">${actionHtml}</div>` : ''}
</div>`;
  },

  renderUnifiedSpeakingResult({ title = '', score = 0, metrics = [], tip = '', feedbackHtml = '', reviewHtml = '', audioUrl = '', actionHtml = '' } = {}) {
    const tone = this.getScoreTone(score);
    return `
<div class="speaking-inline-result">
  <div class="speaking-inline-result-head">
    <div>
      ${title ? `<div class="speaking-inline-result-title">${Scorer.escapeHtml(title)}</div>` : ''}
      <div class="speaking-inline-result-tone" style="--tone-bg:${tone.chip};--tone-color:${tone.accent}">${Scorer.escapeHtml(getAppLang() === 'zh' ? tone.zh : tone.label)}</div>
    </div>
    <div class="speaking-inline-result-score">${Number(score) || 0}<span>/90</span></div>
  </div>
  ${audioUrl ? `<audio class="result-audio-player speaking-inline-audio" controls preload="metadata" src="${Scorer.escapeHtml(audioUrl)}"></audio>` : ''}
  ${this.renderCompactMetricTiles(metrics)}
  ${tip ? `<div class="speaking-tip-card">${Scorer.escapeHtml(tip)}</div>` : ''}
  ${feedbackHtml ? `<div class="speaking-inline-section">${feedbackHtml}</div>` : ''}
  ${reviewHtml ? `<div class="speaking-inline-section">${reviewHtml}</div>` : ''}
  ${actionHtml ? `<div class="speaking-inline-actions">${actionHtml}</div>` : ''}
</div>`;
  },

  renderRecentRecordingsList(questionKeyOrItems, options = {}) {
    const canDelete = typeof questionKeyOrItems === 'string';
    const items = Array.isArray(questionKeyOrItems)
      ? questionKeyOrItems
      : this.getQuestionRecordings(questionKeyOrItems);
    if (!items.length) return '';
    const isZh = getAppLang() === 'zh';
    const title = options.title || (isZh ? '最近录音' : 'Recent Recordings');
    const rows = items.slice(0, options.limit || 5).map((item, index) => `
<div class="speaking-recent-item">
  <div class="speaking-recent-top">
    <div class="speaking-recent-meta">
      <span class="speaking-recent-attempt">${index === 0 ? (isZh ? '最新一次' : 'Latest') : `${isZh ? '第' : 'Attempt '}${index + 1}${isZh ? '次' : ''}`}</span>
      ${item.createdAt ? `<span>${Scorer.escapeHtml(item.createdAt)}</span>` : ''}
    </div>
    <div class="speaking-recent-right">
      ${typeof item.score === 'number' ? `<span class="speaking-recent-score">${item.score}/90</span>` : ''}
      ${canDelete ? `<button class="speaking-recent-delete" type="button" onclick='AIScorer.handleDeleteQuestionRecording(${JSON.stringify(questionKeyOrItems)}, ${index}, this)'>${isZh ? '删除' : 'Delete'}</button>` : `<span class="speaking-recent-bookmark" aria-hidden="true">☆</span>`}
    </div>
  </div>
  <audio class="result-audio-player speaking-recent-player" controls preload="metadata" src="${Scorer.escapeHtml(item.audioUrl)}"></audio>
</div>`).join('');
    return `
<section class="speaking-exam-card speaking-recent-card">
  <div class="speaking-section-title">${Scorer.escapeHtml(title)}</div>
  <div class="speaking-recent-list">${rows}</div>
</section>`;
  },

  metricRows(metrics) {
    return metrics
      .filter(item => typeof item.value === 'number')
      .map(item => `
<div class="score-bar-row">
  <div class="score-bar-label">${item.label}</div>
  <div class="score-bar-track"><div class="score-bar-fill" style="width:${Math.max(0, Math.min(100, Math.round(item.value / 90 * 100)))}%;background:${Scorer.gradeColor(Math.round(item.value / 90 * 100))}"></div></div>
  <div class="score-bar-val">${item.value}</div>
</div>`)
      .join('');
  },

  metricLabel(key, fallback) {
    return t(key) || fallback;
  },

  getScoreTone(score) {
    const value = Number(score) || 0;
    if (value >= 79) return { label: 'Excellent', zh: '优秀', accent: '#5b8cff', chip: 'rgba(91,140,255,0.18)' };
    if (value >= 65) return { label: 'Good', zh: '良好', accent: '#34c759', chip: 'rgba(52,199,89,0.18)' };
    if (value >= 50) return { label: 'Fair', zh: '中等', accent: '#f59e0b', chip: 'rgba(245,158,11,0.18)' };
    return { label: 'Needs work', zh: '待提升', accent: '#ff6b6b', chip: 'rgba(255,107,107,0.18)' };
  },

  getMetricPalette(index = 0) {
    return [
      { tint: 'blue', icon: '◉' },
      { tint: 'green', icon: '◌' },
      { tint: 'orange', icon: '◍' },
      { tint: 'purple', icon: '◎' },
    ][index % 4];
  },

  getMetricDescription(metricKey, value) {
    const isZh = getAppLang() === 'zh';
    const level = Number(value) || 0;
    const tier = level >= 79 ? 'high' : level >= 65 ? 'mid' : 'low';
    const copy = {
      pronunciation: {
        high: isZh ? '发音清晰自然' : 'Clear and easy to follow',
        mid: isZh ? '整体清楚，尾音可更稳' : 'Mostly clear, refine word endings',
        low: isZh ? '建议放慢并加强咬字' : 'Slow down and sharpen articulation',
      },
      fluency: {
        high: isZh ? '节奏自然流畅' : 'Smooth and natural pace',
        mid: isZh ? '整体流畅，停顿略多' : 'Good flow with a few pauses',
        low: isZh ? '建议减少停顿和重复' : 'Reduce pauses and restarts',
      },
      content: {
        high: isZh ? '信息覆盖较完整' : 'Good response coverage',
        mid: isZh ? '主旨到位，可补细节' : 'Main idea is clear, add detail',
        low: isZh ? '建议补足关键信息' : 'Include more key details',
      },
      intonation: {
        high: isZh ? '重音和语调自然' : 'Natural stress and intonation',
        mid: isZh ? '语调稳定，可更有起伏' : 'Stable tone, add more variation',
        low: isZh ? '建议加强重音变化' : 'Improve stress and intonation',
      },
    };
    return copy[metricKey]?.[tier] || (isZh ? '整体表现稳定' : 'Solid overall performance');
  },

  buildSpeakingMetrics(result) {
    return [
      { key: 'pronunciation', label: this.metricLabel('metric_pronunciation', 'Pronunciation'), value: result.pronunciation },
      { key: 'fluency', label: this.metricLabel('metric_fluency', 'Fluency'), value: result.fluency },
      { key: 'content', label: this.metricLabel('metric_content', 'Content'), value: result.content },
    ].filter(item => typeof item.value === 'number');
  },

  getFeedbackBlockMeta(kind) {
    const isZh = getAppLang() === 'zh';
    const map = {
      strength: {
        title: isZh ? '亮点' : 'Strength',
        icon: '✓',
        tone: 'green',
      },
      improve: {
        title: isZh ? '提升点' : 'To Improve',
        icon: '○',
        tone: 'orange',
      },
      suggestion: {
        title: isZh ? '建议' : 'Suggestion',
        icon: '✎',
        tone: 'blue',
      },
      tip: {
        title: isZh ? '练习提示' : 'Practice Tip',
        icon: '✦',
        tone: 'lavender',
      },
    };
    return map[kind];
  },

  renderFeedbackBlock(kind, text) {
    if (!text) return '';
    const meta = this.getFeedbackBlockMeta(kind);
    return `
<div class="speaking-feedback-block ${meta.tone}">
  <div class="speaking-feedback-block-icon">${meta.icon}</div>
  <div class="speaking-feedback-block-copy">
    <div class="speaking-feedback-block-title">${meta.title}</div>
    <div class="speaking-feedback-block-text">${Scorer.escapeHtml(text)}</div>
  </div>
</div>`;
  },

  renderResultHero({ score = 0, showScore = true, title = '', subtitle = '', badge = '', excerpt = '', audioUrl = '', durationSeconds = null } = {}) {
    const tone = this.getScoreTone(score);
    const toneLabel = getAppLang() === 'zh' ? tone.zh : tone.label;
    const pct = Math.max(0, Math.min(100, Math.round((Number(score) || 0) / 90 * 100)));
    const shortExcerpt = excerpt ? Scorer.escapeHtml(excerpt.length > 150 ? `${excerpt.slice(0, 150)}...` : excerpt) : '';
    const durationLabel = typeof durationSeconds === 'number' ? `${Math.round(durationSeconds)}s` : '';
    const audioRow = audioUrl
      ? `<div class="score-shell-audio">
  <audio class="result-audio-player score-shell-audio-player" controls preload="metadata" src="${Scorer.escapeHtml(audioUrl)}"></audio>
  ${durationLabel ? `<span class="score-shell-audio-duration">${durationLabel}</span>` : ''}
</div>`
      : '';
    const kicker = badge ? `<div class="score-shell-kicker">${Scorer.escapeHtml(badge)}</div>` : '';
    const sideHtml = showScore
      ? `<div class="score-shell-ring" style="--score-pct:${pct}%;--score-accent:${tone.accent}">
      <div class="score-shell-ring-inner">
        <div class="score-shell-ring-value">${Number(score) || 0}<span>/90</span></div>
        <div class="score-shell-ring-label">${t('score_overall')}</div>
      </div>
    </div>`
      : `<div class="score-shell-side score-shell-side-neutral">
      <div class="score-shell-side-label">${getAppLang() === 'zh' ? '待作答' : 'Ready'}</div>
      <div class="score-shell-side-copy">${getAppLang() === 'zh' ? '录音后才会显示分数' : 'Score appears after recording'}</div>
    </div>`;
    return `
<section class="score-shell">
  <div class="score-shell-hero">
    <div class="score-shell-copy">
      ${kicker}
      <div class="score-shell-title">${Scorer.escapeHtml(title || t('score_overall'))}</div>
      <div class="score-shell-subtitle">${Scorer.escapeHtml(subtitle || t('score_scale'))}</div>
      ${showScore ? `<div class="score-shell-tone" style="--tone-color:${tone.accent};--tone-bg:${tone.chip}">${Scorer.escapeHtml(toneLabel)}</div>` : ''}
      ${shortExcerpt ? `<div class="score-shell-excerpt">${shortExcerpt}</div>` : ''}
      ${audioRow}
    </div>
    ${sideHtml}
  </div>
</section>`;
  },

  renderMetricCards(metrics) {
    const cards = metrics
      .filter(item => typeof item.value === 'number')
      .map((item, index) => {
        const palette = this.getMetricPalette(index);
        const description = item.desc || this.getMetricDescription(item.key, item.value);
        return `
<div class="score-metric-card ${palette.tint}">
  <div class="score-metric-icon">${palette.icon}</div>
  <div class="score-metric-name">${Scorer.escapeHtml(item.label)}</div>
  <div class="score-metric-value">${item.value}<span>/90</span></div>
  <div class="score-metric-desc">${Scorer.escapeHtml(description)}</div>
</div>`;
      })
      .join('');
    return cards ? `<div class="score-metric-grid">${cards}</div>` : '';
  },

  renderStructuredResult(result, options = {}) {
    const title = options.title || t('score_overall');
    const subtitle = options.subtitle || '';
    const metrics = options.metrics || [];
    const feedbackText = typeof result.feedback === 'object' && result.feedback
      ? (result.feedback.summary || t('score_no_feedback'))
      : (result.feedback || t('score_no_feedback'));
    const transcriptHtml = result.transcript
      ? `<div class="card speaking-result-card" style="animation-delay:.12s"><div class="card-title">${t('score_transcript_label')}</div><div class="transcript-box">${Scorer.escapeHtml(result.transcript)}</div></div>`
      : '';

    return `
${this.renderResultHero({
  score: result.overall ?? 0,
  title,
  subtitle: subtitle || t('score_scale'),
})}
<div class="card speaking-result-card speaking-breakdown-card" style="animation-delay:.03s">
  <div class="card-title">${t('score_breakdown')}</div>
  ${this.renderMetricCards(metrics)}
  ${Scorer.shouldUseCompactSpeakingUI && !Scorer.shouldUseCompactSpeakingUI() ? this.metricRows(metrics) : ''}
</div>
<div class="card speaking-result-card" style="animation-delay:.07s">
  <div class="card-title">${t('score_feedback_label')}</div>
  <div class="speaking-feedback-summary">${Scorer.escapeHtml(feedbackText)}</div>
</div>
${transcriptHtml}`;
  },

  feedbackList(items, emptyText) {
    const rows = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!rows.length) return `<div style="font-size:13px;color:var(--text-light)">${Scorer.escapeHtml(emptyText || t('score_no_feedback'))}</div>`;
    return `<div class="speaking-feedback-list">${rows.map(item => `<div class="speaking-feedback-item">${Scorer.escapeHtml(item)}</div>`).join('')}</div>`;
  },

  renderSavedAttempt(result) {
    if (!result?.attemptId && !result?.audioPath && !result?.audioUrl) return '';
    const derivedAudioUrl = result.audioPath && window.SupabaseService
      ? SupabaseService.getPublicStorageUrl(SupabaseService.speakingBucket, result.audioPath)
      : '';
    if (result.audioPath && !derivedAudioUrl) {
      console.error('[AIScorer] Saved attempt has audioPath but public URL generation failed.', {
        attemptId: result.attemptId,
        audioPath: result.audioPath,
      });
    }
    const resolvedAudioUrl = derivedAudioUrl || result.audioUrl || '';
    const audioPlayer = resolvedAudioUrl
      ? `<audio class="result-audio-player" controls preload="none" src="${Scorer.escapeHtml(resolvedAudioUrl)}"></audio>`
      : `<div class="result-audio-empty">${t('score_replay_empty')}</div>`;
    const transcriptMeta = typeof result.transcriptWordCount === 'number'
      ? `<span>${result.transcriptWordCount} words</span>`
      : '';
    const durationMeta = typeof result.durationSeconds === 'number'
      ? `<span>${Math.round(result.durationSeconds * 10) / 10}s</span>`
      : '';
    const issueMeta = result.issueSummary
      ? `<div class="speaking-saved-summary">${Scorer.escapeHtml(result.issueSummary)}</div>`
      : '';

    return `
<div class="card speaking-result-card speaking-saved-card" style="animation-delay:.1s">
  <div class="speaking-saved-head">
    <div>
      <div class="card-title">${t('score_saved_title')}</div>
      <div class="speaking-saved-copy">${t('score_saved_copy')}</div>
    </div>
    <button class="btn btn-outline" type="button" onclick="navigate('progress')">${t('btn_view_progress')}</button>
  </div>
  <div class="speaking-saved-meta">
    ${result.audioPath ? `<span>${Scorer.escapeHtml(result.audioPath)}</span>` : ''}
    ${durationMeta}
    ${transcriptMeta}
  </div>
  ${issueMeta}
  <div class="speaking-saved-player">
    ${audioPlayer}
  </div>
</div>`;
  },

  renderInlineSavedRecording(options = {}) {
    const audioUrl = options.audioUrl || '';
    if (!audioUrl) return '';
    const title = options.title || 'This question recording';
    const copy = options.copy || 'Replay the exact answer you just submitted for this question.';
    return `
<div class="card speaking-result-card speaking-inline-recording" style="animation-delay:.02s">
  <div class="card-title">${Scorer.escapeHtml(title)}</div>
  <div class="speaking-saved-copy">${Scorer.escapeHtml(copy)}</div>
  <div class="speaking-saved-player">
    <audio class="result-audio-player" controls preload="metadata" src="${Scorer.escapeHtml(audioUrl)}"></audio>
  </div>
</div>`;
  },

  getPlayableAudioUrl(result = {}, fallbackUrl = '') {
    const derivedAudioUrl = result.audioPath && window.SupabaseService
      ? SupabaseService.getPublicStorageUrl(SupabaseService.speakingBucket, result.audioPath)
      : '';
    if (result.audioPath && !derivedAudioUrl && !result.audioUrl && !fallbackUrl) {
      console.error('[AIScorer] Recording path exists but no playable URL could be generated.', {
        attemptId: result.attemptId,
        audioPath: result.audioPath,
      });
    }
    return derivedAudioUrl || result.audioUrl || fallbackUrl || '';
  },

  loadRecentQuestionRecordings() {
    try {
      return JSON.parse(window.localStorage.getItem(this.recentRecordingsKey) || '{}') || {};
    } catch (error) {
      console.error('[AIScorer] Failed to read recent question recordings.', error);
      return {};
    }
  },

  saveRecentQuestionRecordings(payload) {
    try {
      window.localStorage.setItem(this.recentRecordingsKey, JSON.stringify(payload));
    } catch (error) {
      console.error('[AIScorer] Failed to persist recent question recordings.', error);
    }
  },

  saveQuestionRecording(questionKey, entry) {
    if (!questionKey || !entry?.audioUrl) return;
    const payload = this.loadRecentQuestionRecordings();
    const existing = Array.isArray(payload[questionKey]) ? payload[questionKey] : [];
    payload[questionKey] = [entry, ...existing].filter(item => item && item.audioUrl).slice(0, 5);
    this.saveRecentQuestionRecordings(payload);
  },

  deleteQuestionRecording(questionKey, index) {
    if (!questionKey || typeof index !== 'number') return [];
    const payload = this.loadRecentQuestionRecordings();
    const existing = Array.isArray(payload[questionKey]) ? payload[questionKey] : [];
    if (!existing.length) return [];
    payload[questionKey] = existing.filter((_item, itemIndex) => itemIndex !== index);
    if (!payload[questionKey].length) {
      delete payload[questionKey];
    }
    this.saveRecentQuestionRecordings(payload);
    return Array.isArray(payload[questionKey]) ? payload[questionKey] : [];
  },

  getQuestionRecordings(questionKey) {
    if (!questionKey) return [];
    const payload = this.loadRecentQuestionRecordings();
    return Array.isArray(payload[questionKey]) ? payload[questionKey] : [];
  },

  handleDeleteQuestionRecording(questionKey, index, button) {
    const rows = this.deleteQuestionRecording(questionKey, index);
    const card = button?.closest?.('.speaking-recent-card');
    if (!card) return;
    if (!rows.length) {
      card.remove();
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.renderRecentRecordingsList(questionKey);
    const nextCard = wrapper.firstElementChild;
    if (nextCard) {
      card.replaceWith(nextCard);
    } else {
      card.remove();
    }
  },

  renderQuestionRecordingHistory(questionKey, options = {}) {
    return this.renderRecentRecordingsList(questionKey, options);
  },

  renderSpeakingActions(context = {}) {
    const saveLabel = context.isLoggedIn ? t('score_save_label') : t('score_save_signin');
    const buttons = [
      context.reRecordAction ? `<button class="btn btn-primary" onclick="${context.reRecordAction}">${t('btn_re_record')}</button>` : '',
      context.tryAgainAction ? `<button class="btn btn-secondary" onclick="${context.tryAgainAction}">${t('btn_try_again')}</button>` : '',
      context.isLoggedIn
        ? `<button class="btn btn-outline" type="button" disabled aria-disabled="true">${Scorer.escapeHtml(saveLabel)}</button>`
        : `<button class="btn btn-outline" type="button" onclick="openLoginPrompt()">${Scorer.escapeHtml(saveLabel)}</button>`,
    ].filter(Boolean).join('');
    return `<div class="speaking-result-actions">${buttons}</div>`;
  },

  renderSpeakingResult(result, context = {}) {
    const feedback = typeof result.feedback === 'object' && result.feedback ? result.feedback : null;
    const feedbackSummary = feedback?.summary || result.feedback || t('score_no_feedback');
    const diff = context.referenceText && window.TextDiff
      ? TextDiff.compareText(context.referenceText, result.transcript || '')
      : null;
    const metrics = this.buildSpeakingMetrics(result);
    const playableAudioUrl = this.getPlayableAudioUrl(result, context.audioUrl || '');

    const heroHtml = this.renderResultHero({
      score: result.overall ?? 0,
      title: context.promptType || t('score_overall'),
      subtitle: t('score_scale'),
      excerpt: context.referenceText || result.transcript || '',
      audioUrl: playableAudioUrl,
      durationSeconds: result.durationSeconds,
    });

    const breakdownHtml = `
<div class="card speaking-result-card speaking-breakdown-card" style="animation-delay:.03s">
  <div class="card-title">${t('score_subscores_title')}</div>
  ${this.renderMetricCards(metrics)}
</div>`;

    const feedbackBlocks = [
      this.renderFeedbackBlock('strength', feedbackSummary),
      this.renderFeedbackBlock('improve', Array.isArray(feedback?.issues) ? feedback.issues[0] : ''),
      this.renderFeedbackBlock('suggestion', Array.isArray(feedback?.improvements) ? feedback.improvements[0] : ''),
      this.renderFeedbackBlock('tip', feedback?.example_fix || context.referenceText || ''),
    ].filter(Boolean).join('');

    const feedbackHtml = `
<div class="card speaking-result-card" style="animation-delay:.07s">
  <div class="card-title">${t('score_detailed_feedback')}</div>
  <div class="speaking-feedback-stack">
    ${feedbackBlocks}
  </div>
</div>`;

    const reviewHtml = diff && window.WordReview
      ? WordReview.render(diff, {
        referenceText: context.referenceText,
        transcriptText: result.transcript || '',
      })
      : (result.transcript
        ? `<div class="card speaking-result-card" style="animation-delay:.12s"><div class="card-title">${t('score_recognised')}</div><div class="transcript-box">${Scorer.escapeHtml(result.transcript)}</div></div>`
        : '');

    return heroHtml + breakdownHtml + feedbackHtml + this.renderSavedAttempt(result) + reviewHtml + this.renderSpeakingActions(context);
  },

  renderWritingResult(result, context = {}) {
    return this.renderStructuredResult(result, {
      title: t('score_overall'),
      subtitle: context.promptType || 'Writing assessment',
      metrics: [
        { label: this.metricLabel('metric_content', 'Content'), value: result.content },
        { label: this.metricLabel('metric_grammar', 'Grammar'), value: result.grammar },
        { label: this.metricLabel('metric_vocabulary', 'Vocabulary'), value: result.vocabulary },
        { label: this.metricLabel('metric_spelling', 'Spelling'), value: result.spelling },
      ],
    });
  },

  renderSummaryResult(result, context = {}) {
    return this.renderStructuredResult(result, {
      title: t('score_overall'),
      subtitle: context.promptType || 'Summary assessment',
      metrics: [
        { label: this.metricLabel('metric_content', 'Content'), value: result.content },
        { label: this.metricLabel('metric_grammar', 'Grammar'), value: result.grammar },
        { label: this.metricLabel('metric_vocabulary', 'Vocabulary'), value: result.vocabulary },
        { label: this.metricLabel('metric_spelling', 'Spelling'), value: result.spelling },
      ],
    });
  },

  renderDictationResult(result) {
    return this.renderStructuredResult(result, {
      title: t('score_overall'),
      subtitle: t('wfd_title'),
      metrics: [
        { label: this.metricLabel('metric_spelling', 'Spelling'), value: result.spelling },
        { label: this.metricLabel('metric_grammar', 'Grammar'), value: result.grammar },
        { label: this.metricLabel('metric_vocabulary', 'Vocabulary'), value: result.vocabulary },
      ],
    });
  },

  // ── Task-specific feedback chips ─────────────────────────────────────────

  _chipStatusClass(pct) {
    return pct >= 70 ? 'good' : pct >= 45 ? 'fair' : 'needs-work';
  },

  _chipStatusLabel(pct) {
    return pct >= 70 ? 'Good' : pct >= 45 ? 'Fair' : 'Needs Work';
  },

  _chip(label, value, statusClass) {
    return `<span class="task-chip task-chip--${statusClass}"><span class="task-chip-label">${Scorer.escapeHtml(label)}</span> <span class="task-chip-value">${Scorer.escapeHtml(String(value))}</span></span>`;
  },

  renderTaskFeedbackChips(questionType, data) {
    const chips = this._getTaskChips(questionType, data || {});
    if (!chips || !chips.length) return '';
    return `<div class="task-feedback-chips">${chips.join('')}</div>`;
  },

  _getTaskChips(questionType, data) {
    const result = data.result || {};
    const rubric = result.rubric || [];
    const transcript = data.transcript || '';
    const reference = data.reference || '';
    const extra = data.extra || {};

    const getRubricItem = (name, fallback) =>
      rubric.find(r => r.name === name || (fallback && r.name === fallback));

    const rubricPct = (name, fallback) => {
      const item = getRubricItem(name, fallback);
      return item ? Math.round((item.raw / Math.max(item.max, 1)) * 100) : null;
    };

    const sc = (pct) => this._chipStatusClass(pct);
    const sl = (pct) => this._chipStatusLabel(pct);
    const c = (label, value, statusClass) => this._chip(label, value, statusClass);

    switch (questionType) {
      case 'readAloud': {
        const pronPct = rubricPct('Pronunciation');
        const fluencyPct = rubricPct('Oral Fluency', 'Fluency');
        const refWords = reference.toLowerCase().split(/\s+/).filter(Boolean);
        const spokenWords = new Set(transcript.toLowerCase().split(/\s+/).filter(w => /\w/.test(w)));
        const difficultCount = refWords.filter(w => !spokenWords.has(w.replace(/[^\w]/g, ''))).length;
        return [
          pronPct !== null ? c('Pronunciation', sl(pronPct), sc(pronPct)) : null,
          fluencyPct !== null ? c('Oral Fluency', sl(fluencyPct), sc(fluencyPct)) : null,
          fluencyPct !== null ? c('Pace', sl(Math.max(0, fluencyPct - 5)), sc(Math.max(0, fluencyPct - 5))) : null,
          pronPct !== null ? c('Stress & Intonation', sl(pronPct), sc(pronPct)) : null,
          difficultCount > 0 ? c('Difficult Words', `${difficultCount} missed`, 'count') : null,
        ].filter(Boolean);
      }

      case 'repeatSentence': {
        const contentItem = getRubricItem('Content');
        const fluencyPct = rubricPct('Oral Fluency', 'Fluency');
        const pronPct = rubricPct('Pronunciation');
        const contentPct = contentItem ? Math.round((contentItem.raw / Math.max(contentItem.max, 1)) * 100) : null;
        const descMatch = contentItem ? (contentItem.desc || '').match(/(\d+)\/(\d+)/) : null;
        const matched = descMatch ? +descMatch[1] : null;
        const total = descMatch ? +descMatch[2] : null;
        const missing = (matched !== null && total !== null) ? total - matched : null;
        const orderLabel = contentPct >= 80 ? 'Correct' : contentPct >= 40 ? 'Partial' : 'Disrupted';
        return [
          contentPct !== null ? c('Content Accuracy', sl(contentPct), sc(contentPct)) : null,
          (missing !== null && missing > 0) ? c('Missing Words', `${missing}`, 'count') : null,
          contentPct !== null ? c('Word Order', orderLabel, sc(contentPct)) : null,
          fluencyPct !== null ? c('Oral Fluency', sl(fluencyPct), sc(fluencyPct)) : null,
          pronPct !== null ? c('Pronunciation', sl(pronPct), sc(pronPct)) : null,
          pronPct !== null ? c('Ending Sounds', pronPct >= 70 ? 'Clear' : pronPct >= 45 ? 'Partial' : 'Unclear', sc(pronPct)) : null,
        ].filter(Boolean);
      }

      case 'describeImage': {
        const contentPct = rubricPct('Content');
        const fluencyPct = rubricPct('Oral Fluency', 'Fluency');
        const pronPct = rubricPct('Pronunciation');
        const hasTrend = /(increase|decrease|rise|fall|trend|higher|lower|compar|peak)/i.test(transcript);
        const hasStructure = /(firstly|first|then|finally|overall|in conclusion|to conclude|in summary)/i.test(transcript);
        const hasNumbers = /\b\d/.test(transcript);
        const relStatus = (hasTrend || hasNumbers) ? 'good' : (contentPct || 0) >= 60 ? 'fair' : 'needs-work';
        const relLabel = (hasTrend || hasNumbers) ? 'Good' : (contentPct || 0) >= 60 ? 'Fair' : 'Needs Work';
        return [
          contentPct !== null ? c('Content Coverage', sl(contentPct), sc(contentPct)) : null,
          contentPct !== null ? c('Relevance', relLabel, relStatus) : null,
          c('Structure', hasStructure ? 'Good' : 'Needs Work', hasStructure ? 'good' : 'needs-work'),
          fluencyPct !== null ? c('Oral Fluency', sl(fluencyPct), sc(fluencyPct)) : null,
          fluencyPct !== null ? c('Grammar Range', sl(fluencyPct), sc(fluencyPct)) : null,
          contentPct !== null ? c('Vocabulary Range', sl(contentPct), sc(contentPct)) : null,
        ].filter(Boolean);
      }

      case 'retellLecture': {
        const contentItem = getRubricItem('Content');
        const fluencyPct = rubricPct('Oral Fluency', 'Fluency');
        const pronPct = rubricPct('Pronunciation');
        const contentPct = contentItem ? Math.round((contentItem.raw / Math.max(contentItem.max, 1)) * 100) : null;
        const descMatch = contentItem ? (contentItem.desc || '').match(/(\d+)\/(\d+)/) : null;
        const kwMatched = descMatch ? +descMatch[1] : null;
        const kwTotal = descMatch ? +descMatch[2] : null;
        const kwStatus = (kwMatched !== null && kwTotal > 0)
          ? (kwMatched / kwTotal >= 0.6 ? 'good' : kwMatched / kwTotal >= 0.3 ? 'fair' : 'needs-work')
          : sc(contentPct || 0);
        const seqPct = fluencyPct !== null ? Math.max(0, fluencyPct - 10) : null;
        return [
          (kwMatched !== null && kwTotal !== null)
            ? c('Key Points', `${kwMatched}/${kwTotal} covered`, kwStatus)
            : (contentPct !== null ? c('Key Points Coverage', sl(contentPct), sc(contentPct)) : null),
          seqPct !== null ? c('Logical Sequence', sl(seqPct), sc(seqPct)) : null,
          contentPct !== null ? c('Relevance', sl(contentPct), sc(contentPct)) : null,
          fluencyPct !== null ? c('Oral Fluency', sl(fluencyPct), sc(fluencyPct)) : null,
          pronPct !== null ? c('Pronunciation', sl(pronPct), sc(pronPct)) : null,
          fluencyPct !== null ? c('Vocab / Grammar', sl(fluencyPct), sc(fluencyPct)) : null,
        ].filter(Boolean);
      }

      case 'answerShort': {
        const { isCorrect, hasResponse } = extra;
        return [
          isCorrect !== undefined ? c('Answer', isCorrect ? 'Correct' : 'Incorrect', isCorrect ? 'correct' : 'wrong') : null,
          hasResponse !== undefined ? c('Response', hasResponse ? 'Answered' : 'No speech', hasResponse ? 'good' : 'needs-work') : null,
          c('Pronunciation', hasResponse ? 'Check recording' : 'N/A', 'count'),
          isCorrect !== undefined ? c('Word Accuracy', isCorrect ? 'Exact match' : 'Mismatch', isCorrect ? 'good' : 'needs-work') : null,
        ].filter(Boolean);
      }

      case 'summarizeWritten': {
        const contentPct = rubricPct('Content');
        const grammarPct = rubricPct('Grammar');
        const vocabPct = rubricPct('Vocabulary');
        const isOneSentence = result.isOneSentence;
        const inRange = result.inRange;
        const words = result.words || 0;
        return [
          contentPct !== null ? c('Content Coverage', sl(contentPct), sc(contentPct)) : null,
          c('One-Sentence Form', isOneSentence ? 'Yes' : 'No', isOneSentence ? 'good' : 'needs-work'),
          grammarPct !== null ? c('Grammar', sl(grammarPct), sc(grammarPct)) : null,
          vocabPct !== null ? c('Vocabulary', sl(vocabPct), sc(vocabPct)) : null,
          c('Conciseness', inRange ? 'Good' : words > 50 ? 'Too long' : 'Too short', inRange ? 'good' : 'needs-work'),
          c('Spelling', 'Review manually', 'count'),
        ].filter(Boolean);
      }

      case 'writeEssay': {
        const contentPct = rubricPct('Content');
        const formPct = rubricPct('Form');
        const structPct = rubricPct('Development, structure and coherence', 'Development');
        const grammarPct = rubricPct('Grammar');
        const rangePct = rubricPct('General linguistic range', 'Range');
        const spellingPct = rubricPct('Spelling');
        return [
          contentPct !== null ? c('Content', sl(contentPct), sc(contentPct)) : null,
          formPct !== null ? c('Structure', sl(formPct), sc(formPct)) : null,
          structPct !== null ? c('Development', sl(structPct), sc(structPct)) : null,
          grammarPct !== null ? c('Grammar', sl(grammarPct), sc(grammarPct)) : null,
          rangePct !== null ? c('Vocabulary', sl(rangePct), sc(rangePct)) : null,
          spellingPct !== null ? c('Spelling', sl(spellingPct), sc(spellingPct)) : null,
          structPct !== null ? c('Coherence', sl(structPct), sc(structPct)) : null,
        ].filter(Boolean);
      }

      case 'summarizeSpoken': {
        const contentPct = rubricPct('Content');
        const grammarPct = rubricPct('Grammar');
        const vocabPct = rubricPct('Vocabulary');
        const spellingPct = rubricPct('Spelling');
        const inRange = result.inRange;
        const words = result.words || 0;
        return [
          contentPct !== null ? c('Key Points Coverage', sl(contentPct), sc(contentPct)) : null,
          contentPct !== null ? c('Summary Accuracy', sl(contentPct), sc(contentPct)) : null,
          grammarPct !== null ? c('Grammar', sl(grammarPct), sc(grammarPct)) : null,
          vocabPct !== null ? c('Vocabulary', sl(vocabPct), sc(vocabPct)) : null,
          c('Conciseness', inRange ? 'Good' : words > 70 ? 'Too long' : 'Too short', inRange ? 'good' : 'needs-work'),
          spellingPct !== null ? c('Spelling', sl(spellingPct), sc(spellingPct)) : null,
        ].filter(Boolean);
      }

      case 'writeDictation': {
        const correct = result.totalRaw || 0;
        const total = result.totalMax || 1;
        const missing = Math.max(0, total - correct);
        const pctScore = Math.round(correct / Math.max(total, 1) * 100);
        return [
          c('Content Accuracy', `${correct}/${total}`, sc(pctScore)),
          missing > 0 ? c('Missing Words', `${missing}`, 'count') : null,
          c('Word Order', sl(pctScore), sc(pctScore)),
          c('Spelling', pctScore >= 70 ? 'Review' : 'Check carefully', 'count'),
        ].filter(Boolean);
      }

      case 'rwFillBlanks': {
        const { correct = 0, total = 1 } = extra;
        const p = Math.round(correct / Math.max(total, 1) * 100);
        return [
          c('Correct Answers', `${correct}/${total}`, sc(p)),
          c('Grammar Fit', sl(p), sc(p)),
          c('Collocation', sl(Math.max(0, p - 5)), sc(Math.max(0, p - 5))),
          c('Vocabulary Choice', sl(p), sc(p)),
        ];
      }

      case 'mcSingleReading': {
        const { isCorrect } = extra;
        const s = isCorrect ? 'correct' : 'wrong';
        const v = isCorrect ? 'Correct' : 'Incorrect';
        return [
          c('Answer Correctness', v, s),
          c('Main Idea Recognition', v, s),
          c('Detail Accuracy', v, s),
        ];
      }

      case 'mcMultipleReading': {
        const { pts = 0, total = 1, missed = 0, wrong = 0 } = extra;
        const p = Math.round(pts / Math.max(total, 1) * 100);
        return [
          c('Correct Choices', `${pts}/${total}`, sc(p)),
          missed > 0 ? c('Missed Options', `${missed}`, 'count') : null,
          wrong > 0 ? c('Incorrect Choices', `${wrong}`, 'wrong') : null,
        ].filter(Boolean);
      }

      case 'reorderParagraphs': {
        const { correct = 0, maxPairs = 1, firstCorrect } = extra;
        const p = Math.round(correct / Math.max(maxPairs, 1) * 100);
        return [
          c('Correct Order', `${correct}/${maxPairs}`, sc(p)),
          firstCorrect !== undefined ? c('Opening Sentence', firstCorrect ? 'Correct' : 'Incorrect', firstCorrect ? 'good' : 'needs-work') : null,
          c('Logical Flow', sl(p), sc(p)),
          c('Linker Errors', p >= 70 ? 'Few' : p >= 40 ? 'Some' : 'Many', sc(p)),
        ].filter(Boolean);
      }

      case 'rFillBlanks': {
        const { correct = 0, total = 1 } = extra;
        const p = Math.round(correct / Math.max(total, 1) * 100);
        return [
          c('Correct Answers', `${correct}/${total}`, sc(p)),
          c('Context Fit', sl(p), sc(p)),
          c('Grammar Fit', sl(p), sc(p)),
          c('Vocabulary Precision', sl(p), sc(p)),
        ];
      }

      case 'mcSingleListening': {
        const { isCorrect } = extra;
        const s = isCorrect ? 'correct' : 'wrong';
        const v = isCorrect ? 'Correct' : 'Incorrect';
        return [
          c('Answer Correctness', v, s),
          c('Main Idea Capture', v, s),
          c('Detail Recognition', v, s),
        ];
      }

      case 'mcMultipleListening': {
        const { pts = 0, total = 1, missed = 0, wrong = 0 } = extra;
        const p = Math.round(pts / Math.max(total, 1) * 100);
        return [
          c('Correct Choices', `${pts}/${total}`, sc(p)),
          missed > 0 ? c('Missed Options', `${missed}`, 'count') : null,
          wrong > 0 ? c('Incorrect Choices', `${wrong}`, 'wrong') : null,
          c('Main Idea Capture', sl(p), sc(p)),
        ].filter(Boolean);
      }

      case 'fillBlanksListening': {
        const { correct = 0, total = 1 } = extra;
        const p = Math.round(correct / Math.max(total, 1) * 100);
        const missed = total - correct;
        return [
          c('Correct Blanks', `${correct}/${total}`, sc(p)),
          missed > 0 ? c('Missed Words', `${missed}`, 'count') : null,
          c('Spelling Accuracy', sl(p), sc(p)),
          c('Listening Detail', sl(p), sc(p)),
        ].filter(Boolean);
      }

      case 'highlightSummary': {
        const { isCorrect } = extra;
        const s = isCorrect ? 'correct' : 'wrong';
        const v = isCorrect ? 'Correct' : 'Incorrect';
        return [
          c('Summary Selection', v, s),
          c('Main Idea Match', v, s),
          c('Distractor Confusion', isCorrect ? 'None' : 'Affected', isCorrect ? 'good' : 'needs-work'),
        ];
      }

      case 'selectMissing': {
        const { isCorrect } = extra;
        const s = isCorrect ? 'correct' : 'wrong';
        const v = isCorrect ? 'Correct' : 'Incorrect';
        return [
          c('Answer Correctness', v, s),
          c('Context Prediction', v, s),
          c('Ending Cue', isCorrect ? 'Recognised' : 'Missed', isCorrect ? 'good' : 'needs-work'),
        ];
      }

      case 'highlightIncorrect': {
        const { correct = 0, total = 1, wrong = 0 } = extra;
        const missed = total - correct;
        const p = Math.round(correct / Math.max(total, 1) * 100);
        return [
          c('Correct Mismatches', `${correct}/${total}`, sc(p)),
          missed > 0 ? c('Missed Mismatches', `${missed}`, 'count') : null,
          wrong > 0 ? c('False Selections', `${wrong}`, 'wrong') : null,
        ].filter(Boolean);
      }

      default:
        return [];
    }
  },
};

window.AIScorer = AIScorer;
