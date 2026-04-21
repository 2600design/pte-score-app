Pages['repeat-sentence'] = function() {
  let qIndex = 0;
  let phase = 'idle';
  let timerObj = null;
  let recorder = null;
  let player = null;
  let preRecordTimer = null;
  let silenceWatcher = null;
  let preRecordSecondsLeft = 0;
  let finalText = '';
  let interimText = '';
  let recordingUrl = '';
  let recordingBlob = null;
  let recordingDurationSeconds = 0;
  let recordingStartedAt = 0;
  let speechDetected = false;
  let failedStartWindow = false;
  let stopMode = 'score';
  let submitState = 'idle';
  let latestResult = null;
  let latestInsight = null;
  let currentDraftId = '';
  let currentHistory = [];
  let currentHistoryUrls = [];
  let historyRequestId = 0;
  const PRE_RECORD_SECONDS = 3;
  const sourceQuestions = getQuestionSet(DB.repeatSentence, 'repeatSentence', item => ({
    id: item.id,
    tag: `${t('prediction_badge')} · ${item.monthTag}`,
    text: item.content,
    audio: item.audio || item.audioUrl || '',
    isPrediction: true,
  }));
  const totalQuestions = sourceQuestions.length;
  const questions = getTodayPlanQuestions('practice-repeat-sentence', getAccessibleQuestions(sourceQuestions));
  qIndex = getInitialQuestionIndex(questions);
  const isEn = () => typeof getAppLang === 'function' && getAppLang() === 'en';

  function getCurrentQuestion() {
    return questions[qIndex];
  }

  function formatDuration(seconds) {
    const total = Math.max(0, Math.round(Number(seconds || 0)));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  function formatCreatedAt(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString(isEn() ? 'en-AU' : 'zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function revokeHistoryUrls() {
    currentHistoryUrls.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    currentHistoryUrls = [];
  }

  function stopTimer() {
    if (timerObj) timerObj.stop();
    timerObj = null;
  }

  function resetTimerDisplay() {
    const el = $('#timer-el');
    if (!el) return;
    el.className = 'timer';
    el.innerHTML = '<span class="timer-dot"></span>00:00';
  }

  function clearPreRecordTimer() {
    if (preRecordTimer) {
      clearInterval(preRecordTimer);
      preRecordTimer = null;
    }
  }

  function clearSilenceWatcher() {
    if (silenceWatcher) {
      silenceWatcher.stop();
      silenceWatcher = null;
    }
  }

  function clearRecorder(mode) {
    stopMode = mode || 'score';
    clearSilenceWatcher();
    if (recorder && recorder.isRunning) recorder.stop();
    recorder = null;
  }

  function resetAttemptState() {
    finalText = '';
    interimText = '';
    latestResult = null;
    latestInsight = null;
    submitState = 'idle';
    currentDraftId = '';
    failedStartWindow = false;
    speechDetected = false;
    recordingDurationSeconds = 0;
    if (recordingUrl) {
      try { URL.revokeObjectURL(recordingUrl); } catch (_error) {}
    }
    recordingUrl = '';
    recordingBlob = null;
  }

  function getStatusCopy() {
    if (phase === 'pre-record') {
      return {
        icon: String(preRecordSecondsLeft || PRE_RECORD_SECONDS),
        title: t('rs_status_countdown'),
        sub: `${t('rs_status_countdown_sub')} ${preRecordSecondsLeft ? `(${preRecordSecondsLeft}s)` : ''}`.trim(),
        tone: 'countdown',
      };
    }
    if (phase === 'recording') {
      return {
        icon: '●',
        title: t('rs_status_recording'),
        sub: t('rs_status_recording_sub'),
        tone: 'recording',
      };
    }
    if (phase === 'complete') {
      if (failedStartWindow || !String(finalText || '').trim()) {
        return {
          icon: '!',
          title: t('rs_status_no_speech'),
          sub: t('rs_status_no_speech_sub'),
          tone: 'warning',
        };
      }
      return {
        icon: '✓',
        title: t('rs_status_complete'),
        sub: submitState === 'saved' ? t('rs_record_saved') : t('rs_status_complete_sub'),
        tone: 'success',
      };
    }
    return {
      icon: '▶',
      title: t('rs_status_wait'),
      sub: t('rs_status_wait_sub'),
      tone: 'idle',
    };
  }

  function renderStatusCard() {
    const copy = getStatusCopy();
    $('#recorder-area').innerHTML = `
<div class="rs-status-card rs-status-${copy.tone}">
  <div class="rs-status-icon">${copy.icon}</div>
  <div class="rs-status-copy">
    <div class="rs-status-title">${copy.title}</div>
    <div class="rs-status-sub">${copy.sub}</div>
  </div>
  ${phase === 'recording' ? `<button class="btn btn-primary" onclick="RS_stopRecord()">${t('btn_finish')}</button>` : ''}
</div>`;
  }

  function renderAuthGate() {
    if (Scorer.shouldUseCompactSpeakingUI() && window.AIScorer) {
      const en = isEn();
      return AIScorer.renderCompactStateCard({
        score: 30,
        title: en ? 'Repeat Sentence' : '复述句子',
        subtitle: en ? 'Sign in to save or score this attempt' : '登录后可保存并评分',
        feedback: [
          AIScorer.renderFeedbackBlock('suggestion', t('rs_signin_save')),
        ],
        actionHtml: `<button class="btn btn-primary" onclick="AuthUI.open('login')">${t('rs_signin_cta')}</button>`,
      });
    }
    return `
<div class="rs-result-panel rs-result-panel-warning">
  <div class="rs-result-heading">${t('score_save_signin')}</div>
  <div class="rs-result-copy">${t('rs_signin_save')}</div>
  <div class="rs-result-actions">
    <button class="btn btn-primary" onclick="AuthUI.open('login')">${t('rs_signin_cta')}</button>
  </div>
</div>`;
  }

  function renderPendingResult() {
    const useCompact = Scorer.shouldUseCompactSpeakingUI() && window.AIScorer;
    if (!recordingBlob || !recordingUrl) {
      if (failedStartWindow || !String(finalText || '').trim()) {
        $('#score-area').innerHTML = useCompact
          ? AIScorer.renderCompactStateCard({
            score: 10,
            title: isEn() ? 'Repeat Sentence' : '复述句子',
            subtitle: isEn() ? 'No valid recording detected' : '未检测到有效录音',
            feedback: [
              AIScorer.renderFeedbackBlock('improve', t('rs_status_no_speech_sub')),
              AIScorer.renderFeedbackBlock('suggestion', isEn() ? 'Start speaking quickly and keep the full sentence flowing in one attempt.' : '开始录音后尽快开口，并尽量一次完整复述整句。'),
            ],
            actionHtml: `<button class="btn btn-primary" onclick="RS_startRecord()">${t('btn_re_record')}</button>`,
          })
          : `<div class="rs-result-panel rs-result-panel-warning"><div class="rs-result-heading">${t('rs_status_no_speech')}</div><div class="rs-result-copy">${t('rs_status_no_speech_sub')}</div></div>`;
      } else {
        $('#score-area').innerHTML = '';
      }
      return;
    }
    if (useCompact) {
      const en = isEn();
      $('#score-area').innerHTML = AIScorer.renderCompactSubmissionCard({
        title: en ? 'Repeat Sentence' : '复述句子',
        subtitle: en ? 'Recording ready to submit' : '录音已准备提交',
        audioUrl: recordingUrl,
        feedback: [
          AIScorer.renderFeedbackBlock('strength', t('rs_submit_ready')),
          !AppAuth.isLoggedIn() ? AIScorer.renderFeedbackBlock('suggestion', t('rs_signin_save')) : '',
        ],
        actionHtml: `${!AppAuth.isLoggedIn() ? `<button class="btn btn-secondary" onclick="AuthUI.open('login')">${t('rs_signin_cta')}</button>` : ''}<button class="btn btn-primary" onclick="RS_submitAudio()">${t('btn_submit')}</button>`,
      });
      return;
    }
    const loginGate = AppAuth.isLoggedIn()
      ? ''
      : `<div class="rs-inline-note">${t('rs_signin_save')}</div>`;
    $('#score-area').innerHTML = `
<div class="rs-result-panel">
  <div class="rs-result-heading">${t('rs_result_title')}</div>
  <div class="rs-result-copy">${t('rs_submit_ready')}</div>
  <audio class="result-audio-player" controls preload="metadata" src="${recordingUrl}"></audio>
  ${loginGate}
  <div class="rs-result-actions">
    <button class="btn btn-primary" onclick="RS_submitAudio()">${t('btn_submit')}</button>
  </div>
</div>`;
  }

  function renderScoredResult() {
    if (!latestResult) {
      renderPendingResult();
      return;
    }
    const q = getCurrentQuestion();
    const isMobile = Scorer.shouldUseCompactSpeakingUI();
    if (isMobile && window.AIScorer) {
      const en = isEn();
      const metrics = (latestResult.rubric || []).map(r => ({
        key: r.name.toLowerCase().replace(/\s+/g, '_'),
        label: r.name,
        value: Math.round((r.raw / Math.max(r.max, 1)) * 90),
        desc: r.desc || '',
      }));
      const transcriptHtml = Scorer.renderTranscriptMarkup((finalText || '').trim(), q.text);
      $('#score-area').innerHTML = `
<div class="rs-result-wrap">
${AIScorer.renderResultHero({ score: latestResult.pte || 0, title: en ? 'Repeat Sentence' : '复述句子', subtitle: en ? '0–90 PTE Scale' : 'PTE 0–90 分制', audioUrl: recordingUrl })}
${AIScorer.renderMetricCards(metrics)}
<div class="card speaking-result-card" style="margin-top:12px">
  <div class="card-title">${en ? 'Feedback' : '评分反馈'}</div>
  ${AIScorer.renderTaskFeedbackChips('repeatSentence', { result: latestResult, transcript: (finalText || '').trim(), reference: q.text })}
  <div class="speaking-feedback-stack">
    ${latestInsight?.issues?.[0] ? AIScorer.renderFeedbackBlock('improve', latestInsight.issues[0]) : ''}
    ${latestInsight?.suggestion ? AIScorer.renderFeedbackBlock('suggestion', latestInsight.suggestion) : ''}
  </div>
</div>
<div class="card speaking-result-card" style="margin-top:12px">
  <div class="card-title">${en ? 'Transcript Review' : '转写回顾'}</div>
  <div class="transcript-rich">${transcriptHtml || `<span class="transcript-empty">${en ? 'No transcript.' : '暂无转写。'}</span>`}</div>
  <details style="margin-top:10px"><summary style="font-size:13px;color:var(--text-light);cursor:pointer">${en ? 'Reference sentence' : '参考原句'}</summary>
    <div class="rs-detail-text" style="margin-top:6px">${Scorer.escapeHtml(q.text)}</div>
  </details>
</div>
</div>`;
      return;
    }
    const transcript = Scorer.escapeHtml((finalText || '').trim());
    const reference = Scorer.escapeHtml(q.text);
    const metrics = (latestResult.rubric || []).map((item) => `
      <div class="rs-score-chip">
        <span>${Scorer.escapeHtml(item.name)}</span>
        <strong>${item.raw}/${item.max}</strong>
      </div>
    `).join('');
    $('#score-area').innerHTML = `
<div class="rs-result-panel rs-scored-panel">
  <div class="rs-result-head">
    <div>
      <div class="rs-result-heading">${t('practice_score_label')}</div>
      <div class="rs-result-copy">${latestInsight?.suggestion ? Scorer.escapeHtml(latestInsight.suggestion) : ''}</div>
    </div>
    <div class="rs-score-badge">
      <div class="rs-score-number">${latestResult.pte}</div>
      <div class="rs-score-caption">/ 90</div>
    </div>
  </div>
  <div class="rs-score-chip-row">${metrics}</div>
  <audio class="result-audio-player" controls preload="metadata" src="${recordingUrl}"></audio>
  <div class="rs-result-detail">
    <div class="rs-detail-label">${t('rs_transcript_label')}</div>
    <div class="rs-detail-text">${transcript || '-'}</div>
  </div>
  <details class="rs-result-detail rs-reference-detail">
    <summary>${t('rs_reference_label')}</summary>
    <div class="rs-detail-text">${reference}</div>
  </details>
</div>`;
  }

  function renderHistory(records = []) {
    currentHistory = records.filter((item) => item && item.audioUrl).slice(0, 3);
    $('#saved-audio-area').innerHTML = AIScorer.renderRecentRecordingsList(currentHistory.map(item => ({
      audioUrl: item.audioUrl,
      createdAt: formatCreatedAt(item.createdAt),
      score: typeof item.localScore === 'number' ? item.localScore : null,
    })), {
      title: t('rs_recent_title'),
      limit: 3,
    });
  }

  async function loadHistory() {
    const q = getCurrentQuestion();
    const userId = AppAuth.user?.id;
    const requestId = ++historyRequestId;
    revokeHistoryUrls();
    renderHistory([]);
    if (!userId || !window.RecordingArchive) return;

    await window.RecordingArchive.pruneInvalidLocal(userId, q.id);
    const local = await window.RecordingArchive.listLocal(userId, q.id);
    if (requestId !== historyRequestId) return;
    const localRows = await window.RecordingArchive.materializeLocal(local);
    currentHistoryUrls = localRows.map((item) => item.audioUrl).filter(Boolean);
    renderHistory(localRows);

    const cloudRows = await window.RecordingArchive.listCloud(userId, q.id);
    if (requestId !== historyRequestId) return;
    renderHistory(window.RecordingArchive.merge(localRows, cloudRows).slice(0, 3));
  }

  function updateAudioButton(button, state = 'idle') {
    if (!button) return;
    const mode = getPlaybackMode({ source: getQuestionAudioSource(getCurrentQuestion()), fallbackText: getCurrentQuestion().text });
    const available = mode !== 'none' && phase !== 'recording';
    button.disabled = !available;
    button.textContent = state === 'playing' ? '⏸' : '▶';
    button.setAttribute('aria-label', state === 'playing' ? (isEn() ? 'Pause audio' : '暂停音频') : (isEn() ? 'Play audio' : '播放音频'));
  }

  function renderBottomActions() {
    const disableNav = phase === 'recording' || phase === 'pre-record';
    const showTryAgain = phase === 'complete';
    const nextButton = qIndex === questions.length - 1
      ? renderTodayPlanAction('practice-repeat-sentence') || `<button class="btn btn-primary" onclick="RS_next()" ${disableNav ? 'disabled' : ''}>${t('btn_next')}</button>`
      : `<button class="btn btn-primary" onclick="RS_next()" ${disableNav ? 'disabled' : ''}>${t('btn_next')}</button>`;
    $('#rs-bottom-actions').innerHTML = `
<div class="rs-bottom-actions">
  <button class="btn btn-secondary" onclick="RS_prev()" ${qIndex === 0 || disableNav ? 'disabled' : ''}>${t('btn_prev')}</button>
  <div class="rs-bottom-actions-right">
    ${showTryAgain ? `<button class="btn btn-secondary" onclick="RS_tryAgain()">${t('btn_try_again')}</button>` : ''}
    ${nextButton}
  </div>
</div>`;
  }

  function armSilenceRule() {
    clearSilenceWatcher();
    const stream = MicAccess.stream;
    if (!stream) return;
    silenceWatcher = new SilenceWatcher({
      stream,
      timeoutMs: 3500,
      threshold: 15,
      onSpeech: () => {
        silenceWatcher = null;
      },
      onSilence: () => {
        silenceWatcher = null;
        if (phase !== 'recording' || speechDetected) return;
        failedStartWindow = true;
        RS_stopRecord();
      },
    });
  }

  async function saveDraftRecordingIfNeeded() {
    if (!AppAuth.isLoggedIn() || !recordingBlob || !window.RecordingArchive) return null;
    if (currentDraftId) return currentDraftId;
    const saved = await window.RecordingArchive.saveDraftForUser({
      userId: AppAuth.user?.id,
      questionId: getCurrentQuestion().id,
      blob: recordingBlob,
      duration: recordingDurationSeconds,
      localScore: latestResult?.pte ?? null,
      mimeType: recordingBlob.type || 'audio/webm',
    });
    currentDraftId = saved?.id || '';
    await loadHistory();
    return currentDraftId;
  }

  function render() {
    const q = getCurrentQuestion();
    syncSelectedQuestion(q);
    if (window.PracticeTracker) {
      PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'repeatSentence', questionText: q.text });
    }
    const promptHtml = `
<div class="audio-widget rs-audio-widget rs-wide-audio-shell">
  <button class="audio-btn rs-audio-btn" id="play-btn" onclick="RS_play()">▶</button>
  <div class="audio-progress">
    <div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div>
  </div>
</div>`;
    const recordingHtml = AIScorer.renderRecordingCard({
      state: phase,
      promptHtml,
      contentHtml: '<div id="recorder-area"></div><div id="score-area"></div>',
    });
    const footerHtml = `
<div class="speaking-exam-footer">
  <div id="rs-bottom-actions"></div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    $('#page-container').innerHTML = AIScorer.renderSpeakingQuestionLayout({
      title: t('rs_title'),
      badge: t('badge_speaking'),
      progressLabel: `${qIndex + 1} / ${questions.length}`,
      timerHtml: '<div id="timer-el" class="timer"><span class="timer-dot"></span>00:00</div>',
      instruction: t('rs_instruction'),
      recordingHtml,
      recentHtml: '<div id="saved-audio-area"></div>',
      footerHtml,
    });
    resetTimerDisplay();
    renderStatusCard();
    renderPendingResult();
    renderBottomActions();
    updateAudioButton($('#play-btn'));
    loadHistory();
  }

  async function handleRecordingFinished() {
    stopTimer();
    phase = 'complete';
    renderStatusCard();
    if (recordingBlob && recordingBlob.size > 0 && AppAuth.isLoggedIn()) {
      await saveDraftRecordingIfNeeded();
      submitState = 'saved';
      renderStatusCard();
    }
    if (latestResult) renderScoredResult();
    else renderPendingResult();
    renderBottomActions();
  }

  setPageCleanup(() => {
    stopTimer();
    clearPreRecordTimer();
    clearSilenceWatcher();
    if (recorder && recorder.isRunning) recorder.stop();
    recorder = null;
    if (player) player.stop();
    player = null;
    revokeHistoryUrls();
  });

  window.RS_play = function() {
    const btn = $('#play-btn');
    const fill = $('#ap-fill');
    const q = getCurrentQuestion();
    if (phase === 'recording') return;
    if (!player) {
      player = createAudioPlayer({
        source: getQuestionAudioSource(q),
        fallbackText: q.text,
        onProgress: (pct) => {
          if (fill) fill.style.width = `${pct * 100}%`;
        },
        onEnd: () => {
          player = null;
          if (fill) fill.style.width = '100%';
          updateAudioButton(btn);
          RS_beginCountdown();
        },
        onStateChange: (state) => {
          updateAudioButton(btn, state);
        },
      });
      if (!player.play()) return;
      return;
    }
    player.toggle();
  };

  window.RS_beginCountdown = function() {
    if (phase === 'recording') return;
    clearPreRecordTimer();
    stopTimer();
    resetTimerDisplay();
    phase = 'pre-record';
    preRecordSecondsLeft = PRE_RECORD_SECONDS;
    renderStatusCard();
    renderBottomActions();
    preRecordTimer = setInterval(() => {
      preRecordSecondsLeft -= 1;
      if (preRecordSecondsLeft <= 0) {
        clearPreRecordTimer();
        RS_startRecord();
        return;
      }
      renderStatusCard();
    }, 1000);
  };

  window.RS_startRecord = async function() {
    if (phase === 'recording') return;
    const allowed = await MicAccess.ensureOrNotify();
    if (!allowed) return;
    clearPreRecordTimer();
    stopTimer();
    resetAttemptState();
    phase = 'recording';
    stopMode = 'score';
    recordingStartedAt = Date.now();
    renderStatusCard();
    $('#score-area').innerHTML = '';
    renderBottomActions();
    timerObj = new CountdownTimer($('#timer-el'), 15, null, RS_stopRecord);
    timerObj.start();
    recorder = new SpeechRecorder({
      captureAudio: true,
      continuous: true,
      keepAlive: false,
      onCapture: ({ url, blob }) => {
        recordingUrl = url || recordingUrl;
        recordingBlob = blob || recordingBlob;
      },
      onResult: ({ final, interim }) => {
        finalText = final || finalText;
        interimText = interim || interimText;
        if ((final || interim || '').trim()) {
          speechDetected = true;
          if (silenceWatcher) silenceWatcher.markSpeechDetected();
        }
      },
      onEnd: async ({ final, audioUrl }) => {
        finalText = final || finalText;
        if (!String(finalText || '').trim()) finalText = interimText || finalText;
        recordingUrl = audioUrl || recordingUrl;
        recordingDurationSeconds = Math.max(1, Math.round((Date.now() - recordingStartedAt) / 1000));
        const mode = stopMode;
        recorder = null;
        if (mode === 'cancel' || mode === 'exit') {
          phase = 'idle';
          renderStatusCard();
          renderPendingResult();
          renderBottomActions();
          return;
        }
        await handleRecordingFinished();
      },
      onError: async () => {
        recorder = null;
        await handleRecordingFinished();
      },
    });
    recorder.start();
    armSilenceRule();
  };

  window.RS_stopRecord = function() {
    if (phase !== 'recording') return;
    stopTimer();
    clearRecorder('score');
  };

  window.RS_tryAgain = function() {
    stopTimer();
    clearPreRecordTimer();
    clearSilenceWatcher();
    clearRecorder('exit');
    if (player) {
      player.stop();
      player = null;
    }
    resetAttemptState();
    if ($('#ap-fill')) $('#ap-fill').style.width = '0%';
    phase = 'idle';
    renderStatusCard();
    renderPendingResult();
    renderBottomActions();
    updateAudioButton($('#play-btn'));
  };

  window.RS_submitAudio = async function() {
    if (!recordingBlob || !recordingUrl) {
      renderPendingResult();
      return;
    }
    if (!AppAuth.isLoggedIn()) {
      $('#score-area').innerHTML = renderAuthGate();
      return;
    }
    if (!currentDraftId) await saveDraftRecordingIfNeeded();
    const transcript = String(finalText || interimText || '').trim();
    if (failedStartWindow) {
      latestResult = null;
      latestInsight = null;
      $('#score-area').innerHTML = `
<div class="rs-result-panel rs-result-panel-warning">
  <div class="rs-result-heading">${t('rs_status_no_speech')}</div>
  <div class="rs-result-copy">${t('rs_status_no_speech_sub')}</div>
  <audio class="result-audio-player" controls preload="metadata" src="${recordingUrl}"></audio>
</div>`;
      return;
    }
    const q = getCurrentQuestion();
    latestResult = Scorer.repeatSentence(transcript, q.text);
    latestInsight = Scorer.getSpeakingInsights(latestResult, transcript, q.text);
    submitState = 'submitted';
    try {
      Stats.record('repeatSentence', latestResult.pte || 0, 90, { transcript, ai_feedback: latestInsight.suggestion });
    } catch (error) {
      console.warn('Repeat Sentence stats save failed', error);
    }
    try {
      if (currentDraftId && window.RecordingArchive) {
        await window.RecordingArchive.updateScore(currentDraftId, latestResult.pte || null);
        await loadHistory();
      }
    } catch (error) {
      console.warn('Repeat Sentence archive score update failed', error);
    }
    renderScoredResult();
    renderBottomActions();
  };

  window.RS_prev = function() {
    if (qIndex === 0) return;
    stopTimer();
    clearPreRecordTimer();
    clearSilenceWatcher();
    clearRecorder('exit');
    if (player) {
      player.stop();
      player = null;
    }
    revokeHistoryUrls();
    qIndex = Math.max(0, qIndex - 1);
    resetAttemptState();
    render();
  };

  window.RS_next = function() {
    if (qIndex >= questions.length - 1) return;
    stopTimer();
    clearPreRecordTimer();
    clearSilenceWatcher();
    clearRecorder('exit');
    if (player) {
      player.stop();
      player = null;
    }
    revokeHistoryUrls();
    qIndex = Math.min(questions.length - 1, qIndex + 1);
    resetAttemptState();
    render();
  };

  render();
};
