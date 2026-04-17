Pages['read-aloud'] = function() {
  let qIndex = 0;
  let timerObj = null;
  let recorder = null;
  let finalText = '';
  let recordingUrl = '';
  let recordingBlob = null;
  let recordingDurationSeconds = 0;
  let recordingStartedAt = 0;
  let currentDraftId = '';
  let uploadedAudio = null;
  let audioSource = '';
  let phase = 'prep';
  let stopMode = 'score';
  let silenceWatcher = null;
  let speechDetected = false;
  let failedStartWindow = false;
  const prepSeconds = 40;
  const totalQuestions = DB.readAloud.length;
  const questions = getAccessibleQuestions(DB.readAloud);
  qIndex = getInitialQuestionIndex(questions);
  const getQuestionRecordingKey = (question) => `readAloud:${question?.id || qIndex}`;
  const pageStatePage = 'read-aloud';

  function restoreSavedUi(question) {
    const saved = window.getPageUiState?.(pageStatePage, getQuestionRecordingKey(question));
    if (!saved) return false;
    if ($('#recorder-area')) $('#recorder-area').innerHTML = saved.recorderHtml || '';
    if ($('#score-area')) $('#score-area').innerHTML = saved.scoreHtml || '';
    return true;
  }

  function persistUi(question) {
    if (!question) return;
    window.savePageUiState?.(pageStatePage, getQuestionRecordingKey(question), {
      recorderHtml: $('#recorder-area')?.innerHTML || '',
      scoreHtml: $('#score-area')?.innerHTML || '',
    });
  }

  function clearSavedUi(question) {
    if (!question) return;
    window.clearPageUiState?.(pageStatePage, getQuestionRecordingKey(question));
  }

  setPageCleanup(() => {
    stopTimer();
    clearSilenceWatcher();
    if (recorder && recorder.isRunning) recorder.stop();
    recorder = null;
    if (uploadedAudio) SpeakingAudio.revokePreview(uploadedAudio);
    uploadedAudio = null;
  });

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

  function clearRecorder(mode) {
    stopMode = mode || 'score';
    clearSilenceWatcher();
    if (recorder && recorder.isRunning) recorder.stop();
    recorder = null;
  }

  function getActiveAudio() {
    if (audioSource === 'upload' && uploadedAudio) {
      return { ...uploadedAudio, source: 'upload' };
    }
    if (recordingBlob && recordingUrl) {
      return {
        file: new File([recordingBlob], 'read-aloud.webm', { type: recordingBlob.type || 'audio/webm' }),
        previewUrl: recordingUrl,
        durationSeconds: recordingDurationSeconds || 1,
        mimeType: recordingBlob.type || 'audio/webm',
        name: 'Recorded response.webm',
        source: 'recording',
      };
    }
    if (uploadedAudio) {
      return { ...uploadedAudio, source: 'upload' };
    }
    return null;
  }

  function renderSubmissionPanel(message = t('panel_record_or_upload')) {
    const activeAudio = getActiveAudio();
    $('#score-area').innerHTML = SpeakingAudio.renderCapturePanel({
      title: 'Speaking audio',
      helperText: message,
      session: { activeAudio },
      uploadAction: 'RA_handleUpload',
      clearUploadAction: 'RA_clearUpload',
      submitAction: 'RA_submitAudio',
      supportsRecording: !!(window.MediaRecorder || recordingBlob),
    });
  }

  function clearSilenceWatcher() {
    if (silenceWatcher) { silenceWatcher.stop(); silenceWatcher = null; }
  }

  function armSilenceRule() {
    clearSilenceWatcher();
    const stream = MicAccess.stream;
    if (!stream) return;
    silenceWatcher = new SilenceWatcher({
      stream, timeoutMs: 3500, threshold: 15,
      onSpeech: () => { silenceWatcher = null; },
      onSilence: () => {
        silenceWatcher = null;
        if (phase !== 'recording' || speechDetected) return;
        failedStartWindow = true;
        RA_stopRecord();
      },
    });
  }

  function prepCard(seconds) {
    return `
<div class="status-card">
  <div class="status-title">Current status: <strong>${t('status_beginning').replace('${n}', seconds)}</strong></div>
  <div class="status-progress">
    <div class="status-progress-fill" id="ra-prep-fill"></div>
  </div>
  <div class="btn-group" style="justify-content:center">
    <button class="btn status-btn" onclick="RA_startRecord()">${t('btn_skip')}</button>
  </div>
</div>`;
  }

  function recordingCard(seconds) {
    return `
<div class="status-card">
  <div class="status-title">Current Status: <strong>${t('status_recording').replace('${n}', seconds)}</strong></div>
  <div class="status-progress">
    <div class="status-progress-fill recording" id="ra-record-fill"></div>
  </div>
  <div class="btn-group" style="justify-content:center">
    <button class="btn status-btn recording" onclick="RA_stopRecord()">${t('btn_finish')}</button>
  </div>
</div>`;
  }

  function recorderMarkup(status, actions) {
    return `
<div class="recorder-widget ${phase === 'recording' ? 'recording' : ''}" id="rec-widget">
  <button class="record-btn ${phase === 'recording' ? 'recording' : 'idle'}" id="rec-btn" onclick="${phase === 'recording' ? 'RA_stopRecord()' : 'RA_startRecord()'}">${phase === 'recording' ? '⏹' : '🎤'}</button>
  <div class="record-status ${phase === 'recording' ? 'recording' : ''}" id="rec-status">${status}</div>
  ${phase === 'recording' ? `<div class="waveform">${Array(5).fill('<div class="waveform-bar"></div>').join('')}</div>` : ''}
  <div class="recorder-actions">${actions}</div>
</div>`;
  }

  function showPrepState(message) {
    const q = questions[qIndex];
    clearSavedUi(q);
    phase = 'prep';
    finalText = '';
    recordingUrl = '';
    recordingBlob = null;
    recordingDurationSeconds = 0;
    currentDraftId = '';
    audioSource = '';
    speechDetected = false;
    failedStartWindow = false;
    clearSilenceWatcher();
    stopTimer();
    $('#score-area').innerHTML = '';
    $('#recorder-area').innerHTML = prepCard(prepSeconds);
    if (message) {
      $('#score-area').innerHTML = `<div class="recorder-note" style="text-align:center;margin-top:4px">${message}</div>`;
    }
    renderSubmissionPanel(t('panel_record_new'));
    timerObj = new CountdownTimer(
      $('#timer-el'),
      prepSeconds,
      (remaining) => {
        const title = $('.status-title');
        const fill = $('#ra-prep-fill');
        if (title) title.innerHTML = `Current status: <strong>${t('status_beginning').replace('${n}', remaining)}</strong>`;
        if (fill) fill.style.width = `${((prepSeconds - remaining) / prepSeconds) * 100}%`;
      },
      () => { RA_startRecord(); }
    );
    timerObj.start();
    const fill = $('#ra-prep-fill');
    if (fill) fill.style.width = '0%';
  }

  function showRecordReadyState(message) {
    phase = 'ready';
    stopTimer();
    resetTimerDisplay();
    $('#recorder-area').innerHTML = recorderMarkup(message || t('status_ready_record'), `<button class="btn btn-primary" onclick="RA_startRecord()">${t('btn_start_recording')}</button>`);
    renderSubmissionPanel(t('panel_record_answer'));
  }

  function render() {
    const q = questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'readAloud', questionText: q.text });
    $('#page-container').innerHTML = `
<div class="page-header">
  <h1>${t('ra_title')} <span class="badge badge-speaking">${t('badge_speaking')}</span></h1>
  <p>${t('ra_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav">
    <span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length} ${q.tag ? `<span style="background:#fef3c7;color:#92400e;font-size:11px;padding:2px 8px;border-radius:10px;margin-left:6px">${q.tag}</span>` : ''}</span>
    <div id="timer-el" class="timer"><span class="timer-dot"></span>00:00</div>
  </div>
  <div class="q-instruction">${t('ra_instruction')}</div>
  <div class="q-text" id="q-text">${q.text}</div>
  <div id="recorder-area"></div>
  <div id="score-area"></div>
  <div id="saved-audio-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-secondary" onclick="RA_prev()" ${qIndex===0 ? 'disabled' : ''}>${t('btn_prev')}</button>
    <button class="btn btn-primary" onclick="RA_next()" ${qIndex===questions.length-1 ? 'disabled' : ''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    $('#saved-audio-area').innerHTML = AIScorer.renderQuestionRecordingHistory(getQuestionRecordingKey(q));
    showPrepState();
    restoreSavedUi(q);
  }

  async function saveReadAloudDraft() {
    const q = questions[qIndex];
    if (!AppAuth.isLoggedIn() || currentDraftId || !window.RecordingArchive) return null;
    if (!(recordingBlob instanceof Blob) || recordingBlob.size <= 0) return null;
    try {
      const saved = await window.RecordingArchive.saveDraftForUser({
        userId: AppAuth.user?.id,
        questionId: q.id,
        blob: recordingBlob,
        duration: recordingDurationSeconds || 1,
        localScore: null,
        mimeType: recordingBlob.type || 'audio/webm',
      });
      currentDraftId = saved?.id || '';
      return saved;
    } catch (error) {
      console.error('[ReadAloud] Failed to save draft recording.', error);
      return null;
    }
  }

  async function normalizeCurrentRecording() {
    if (!(recordingBlob instanceof Blob) || !window.RecordingArchive) return;
    const nextBlob = await window.RecordingArchive.ensurePlayableBlob(recordingBlob, recordingBlob.type || 'audio/webm');
    if (!(nextBlob instanceof Blob) || nextBlob.size <= 0) {
      recordingBlob = null;
      if (recordingUrl) {
        try { URL.revokeObjectURL(recordingUrl); } catch (_error) {}
      }
      recordingUrl = '';
      return;
    }
    if (nextBlob === recordingBlob) return;
    if (recordingUrl) {
      try { URL.revokeObjectURL(recordingUrl); } catch (_error) {}
    }
    recordingBlob = nextBlob;
    recordingUrl = URL.createObjectURL(nextBlob);
  }

  window.RA_startRecord = async function() {
    if (phase === 'recording') return;
    const startedManually = phase === 'prep';
    const allowed = await MicAccess.ensureOrNotify();
    if (!allowed) return;
    stopTimer();
    if (startedManually) resetTimerDisplay();
    phase = 'recording';
    finalText = '';
    recordingUrl = '';
    recordingBlob = null;
    recordingDurationSeconds = 0;
    recordingStartedAt = Date.now();
    speechDetected = false;
    failedStartWindow = false;
    stopMode = 'score';
    $('#score-area').innerHTML = '';
    $('#recorder-area').innerHTML = recordingCard(40);

    recorder = new SpeechRecorder({
      captureAudio: true,
      onCapture: ({ url, blob }) => { recordingUrl = url; recordingBlob = blob || null; },
      continuous: true,
      keepAlive: false,
      onResult: ({ final, interim }) => {
        finalText = final || finalText;
        if ((final || interim || '').trim()) {
          speechDetected = true;
          if (silenceWatcher) silenceWatcher.markSpeechDetected();
        }
      },
      onEnd: ({ final, audioUrl }) => {
        finalText = final || finalText;
        recordingUrl = audioUrl || recordingUrl;
        recordingDurationSeconds = Math.max(1, Math.round((Date.now() - recordingStartedAt) / 1000));
        audioSource = recordingBlob ? 'recording' : audioSource;
        const mode = stopMode;
        recorder = null;
        if (mode === 'cancel' || mode === 'exit') {
          showPrepState(mode === 'cancel' ? t('toast_cancel_msg') : t('toast_exit_msg'));
          return;
        }
        Promise.resolve(normalizeCurrentRecording())
          .then(() => saveReadAloudDraft())
          .finally(() => {
            RA_showScore();
          });
      },
      onError: (e) => {
        showToast(t('toast_mic_error') + e);
        RA_showScore();
      }
    });
    recorder.start();
    armSilenceRule();
    timerObj = new CountdownTimer(
      $('#timer-el'),
      40,
      (remaining) => {
        const title = $('.status-title');
        const fill = $('#ra-record-fill');
        if (title) title.innerHTML = `Current Status: <strong>${t('status_recording').replace('${n}', remaining)}</strong>`;
        if (fill) fill.style.width = `${((40 - remaining) / 40) * 100}%`;
      },
      () => { RA_stopRecord(); }
    );
    timerObj.start();
    const fill = $('#ra-record-fill');
    if (fill) fill.style.width = '0%';
  };

  window.RA_stopRecord = function() {
    if (phase !== 'recording') return;
    phase = 'done';
    stopTimer();
    clearRecorder('score');
  };

  window.RA_cancelRecord = function() {
    if (phase !== 'recording') return;
    phase = 'prep';
    stopTimer();
    clearRecorder('cancel');
  };

  window.RA_exitRecord = function() {
    if (phase !== 'recording') {
      showPrepState();
      return;
    }
    phase = 'prep';
    stopTimer();
    clearRecorder('exit');
  };

  window.RA_restart = function() {
    showPrepState();
  };

  window.RA_handleUpload = async function(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    try {
      if (uploadedAudio) SpeakingAudio.revokePreview(uploadedAudio);
      uploadedAudio = await SpeakingAudio.inspectFile(file);
      audioSource = 'upload';
      renderSubmissionPanel(t('panel_uploaded_ready'));
    } catch (error) {
      uploadedAudio = null;
      showToast(error.message || t('toast_audio_error'));
      renderSubmissionPanel(t('panel_upload_or_record'));
    } finally {
      if (event?.target) event.target.value = '';
    }
  };

  window.RA_clearUpload = function() {
    if (uploadedAudio) SpeakingAudio.revokePreview(uploadedAudio);
    uploadedAudio = null;
    audioSource = recordingBlob ? 'recording' : '';
    renderSubmissionPanel(t('panel_upload_another'));
  };

  window.RA_submitAudio = async function() {
    const q = questions[qIndex];
    const activeAudio = getActiveAudio();
    if (!activeAudio) {
      showToast(t('toast_no_audio'));
      return;
    }
    if (!AppAuth.isLoggedIn()) {
      AuthUI.open('login');
      $('#score-area').innerHTML = AIScorer.renderAuthGate();
      return;
    }
    const transcript = activeAudio.source === 'recording' ? (finalText || '').trim() : '';
    if (!transcript) {
      showToast(t('toast_local_record_only'));
      return;
    }
    const result = Scorer.readAloud(transcript, q.text);
    const insight = Scorer.getSpeakingInsights(result, transcript, q.text);
    Stats.record('readAloud', result.pte || 0, 90, {
      transcript,
      ai_feedback: insight.suggestion,
    });
    if (activeAudio.source === 'recording' && window.RecordingArchive && recordingBlob instanceof Blob && recordingBlob.size > 0) {
      try {
        if (!currentDraftId) {
          const saved = await window.RecordingArchive.saveDraftForUser({
            userId: AppAuth.user?.id,
            questionId: q.id,
            blob: recordingBlob,
            duration: recordingDurationSeconds || activeAudio.durationSeconds || 1,
            localScore: result.pte || null,
            mimeType: recordingBlob.type || 'audio/webm',
          });
          currentDraftId = saved?.id || '';
        } else {
          await window.RecordingArchive.updateScore(currentDraftId, result.pte || null);
        }
      } catch (error) {
        console.error('[ReadAloud] Failed to sync recording to archive.', error);
      }
    }
    AIScorer.saveQuestionRecording(getQuestionRecordingKey(q), {
      audioUrl: activeAudio.previewUrl || '',
      score: result.pte || null,
      createdAt: new Date().toLocaleString(),
    });
    $('#saved-audio-area').innerHTML = AIScorer.renderQuestionRecordingHistory(getQuestionRecordingKey(q));
    $('#score-area').innerHTML = Scorer.renderLocalSpeakingResult({
      questionType: 'readAloud',
      questionTitle: t('ra_title'),
      result,
      transcript,
      reference: q.text,
      audioUrl: activeAudio.previewUrl || '',
      retryAction: 'RA_startRecord()',
      nextAction: qIndex < questions.length - 1 ? 'RA_next()' : '',
    });
    persistUi(q);
  };

  window.RA_showScore = async function() {
    $('#recorder-area').innerHTML = `
<div class="recorder-widget done result-state">
  <div class="recorder-result-main">
    <div class="recorder-result-icon">✓</div>
    <div class="recorder-result-copy">
      <div class="recorder-result-title">${failedStartWindow ? t('result_failed_start') : finalText && finalText.trim() ? t('result_recording_complete') : t('result_no_speech')}</div>
      <div class="recorder-result-sub">${failedStartWindow ? t('result_failed_sub') : finalText && finalText.trim() ? t('result_ready_sub') : t('result_no_speech_sub')}</div>
    </div>
  </div>
  <div class="result-actions compact">
    <button class="btn btn-primary" onclick="RA_startRecord()">${t('btn_re_record')}</button>
  </div>
</div>`;
    if (failedStartWindow) {
      Stats.record('readAloud', 0, 90, { transcript: finalText || '', ai_feedback: 'You must start speaking within 5 seconds after recording begins.' });
      $('#score-area').innerHTML = `<div style="background:#fff8ed;border:1px solid #f59e0b;border-radius:8px;padding:14px;font-size:13.5px;color:#92400e;margin-top:8px"><strong>${t('score_10_label')}</strong><br>${t('score_fail_no_start')}</div>`;
      return;
    }

    if (!recordingBlob && (!finalText || finalText.trim().length < 3)) {
      $('#score-area').innerHTML = `<div style="background:#fff8ed;border:1px solid #fcd34d;border-radius:8px;padding:14px;font-size:13.5px;color:#92400e;margin-top:8px">${t('score_no_speech')}</div>`;
      return;
    }
    audioSource = recordingBlob ? 'recording' : audioSource;
    renderSubmissionPanel(t('panel_recording_ready'));
  };

  window.RA_prev = function() { clearSavedUi(questions[qIndex]); qIndex = Math.max(0, qIndex - 1); stopTimer(); clearSilenceWatcher(); clearRecorder('exit'); render(); };
  window.RA_next = function() { clearSavedUi(questions[qIndex]); qIndex = Math.min(questions.length - 1, qIndex + 1); stopTimer(); clearSilenceWatcher(); clearRecorder('exit'); render(); };

  render();
};
