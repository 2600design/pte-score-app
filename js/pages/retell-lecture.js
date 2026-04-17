Pages['retell-lecture'] = function() {
  let qIndex = 0;
  let phase = 'idle';
  let timerObj = null;
  let recorder = null;
  let finalText = '';
  let recordingUrl = '';
  let recordingBlob = null;
  let recordingDurationSeconds = 0;
  let recordingStartedAt = 0;
  let uploadedAudio = null;
  let audioSource = '';
  let stopMode = 'score';
  let silenceWatcher = null;
  let speechDetected = false;
  let failedStartWindow = false;
  let player = null;
  const sourceQuestions = getQuestionSet(DB.retellLecture, 'retellLecture', item => ({
    id: item.id,
    title: item.content,
    transcript: item.transcript || item.answer || item.content,
    duration: item.duration || 35,
    audio: item.audio || item.audioUrl || '',
    isPrediction: true,
  }));
  const totalQuestions = sourceQuestions.length;
  const questions = getAccessibleQuestions(sourceQuestions);
  qIndex = getInitialQuestionIndex(questions);
  const getQuestionRecordingKey = (question) => `retellLecture:${question?.id || qIndex}`;
  const pageStatePage = 'retell-lecture';

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
    if (player) player.stop();
    player = null;
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

  function clearSilenceWatcher() {
    if (silenceWatcher) { silenceWatcher.stop(); silenceWatcher = null; }
  }

  function getActiveAudio() {
    if (audioSource === 'upload' && uploadedAudio) return { ...uploadedAudio, source: 'upload' };
    if (recordingBlob && recordingUrl) {
      return {
        file: new File([recordingBlob], 'retell-lecture.webm', { type: recordingBlob.type || 'audio/webm' }),
        previewUrl: recordingUrl,
        durationSeconds: recordingDurationSeconds || 1,
        mimeType: recordingBlob.type || 'audio/webm',
        name: 'Recorded response.webm',
        source: 'recording',
      };
    }
    if (uploadedAudio) return { ...uploadedAudio, source: 'upload' };
    return null;
  }

  function renderSubmissionPanel(message = t('panel_record_answer')) {
    $('#score-area').innerHTML = SpeakingAudio.renderCapturePanel({
      title: 'Speaking audio',
      helperText: message,
      session: { activeAudio: getActiveAudio() },
      uploadAction: 'RL_handleUpload',
      clearUploadAction: 'RL_clearUpload',
      submitAction: 'RL_submitAudio',
      supportsRecording: !!window.MediaRecorder,
    });
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
        RL_stopRecord();
      },
    });
  }

  function readyState(message, startCountdown = true) {
    clearSavedUi(questions[qIndex]);
    phase = 'ready';
    finalText = '';
    recordingUrl = '';
    recordingBlob = null;
    recordingDurationSeconds = 0;
    audioSource = uploadedAudio ? 'upload' : '';
    speechDetected = false;
    failedStartWindow = false;
    clearSilenceWatcher();
    $('#recorder-area').innerHTML = `
<div class="recorder-widget">
  <button class="record-btn idle" id="rec-btn" onclick="RL_startRecord()">🎤</button>
  <div class="record-status" id="rec-status">${message || t('rl_status_ready')}</div>
  <div class="recorder-actions">
    <button class="btn btn-primary" onclick="RL_startRecord()">${t('btn_start_recording')}</button>
  </div>
</div>`;
    renderSubmissionPanel(message || t('panel_record_answer'));
    stopTimer();
    if (startCountdown) {
      timerObj = new CountdownTimer($('#timer-el'), 10, null, () => RL_startRecord());
      timerObj.start();
    } else {
      resetTimerDisplay();
    }
  }

  function render() {
    const q = questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'retellLecture', questionText: q.transcript });
    $('#page-container').innerHTML = `
<div class="page-header">
  <h1>${t('rl_title')} <span class="badge badge-speaking">${t('badge_speaking')}</span></h1>
  <p>${t('rl_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav">
    <span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span>
    <div id="timer-el" class="timer"><span class="timer-dot"></span>00:00</div>
  </div>
  <div class="q-instruction">${t('rl_instruction')}</div>
  <div class="audio-widget">
    <button class="audio-btn" id="play-btn" onclick="RL_play()" aria-label="${t('btn_play_audio')}">▶</button>
    <div class="audio-progress">
      <div class="audio-label">${q.title}</div>
      <div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div>
      <div class="audio-time"><span>0:00</span><span id="dur-label">${formatTime(q.duration)}</span></div>
    </div>
  </div>
  <div id="notes-area" style="margin-bottom:16px">
    <div class="card-title" style="margin-bottom:8px">📝 Notes</div>
    <textarea class="textarea" id="notes" rows="3" placeholder="Take notes while listening..."></textarea>
  </div>
  <div id="saved-audio-area"></div>
  <div id="recorder-area">
    <div class="recorder-widget">
      <button class="record-btn idle" id="rec-btn" disabled>🎤</button>
      <div class="record-status" id="rec-status">${t('status_play_first')}</div>
    </div>
  </div>
  <div id="score-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-secondary" onclick="RL_prev()" ${qIndex===0 ? 'disabled' : ''}>${t('btn_prev')}</button>
    <button class="btn btn-primary" onclick="RL_next()" ${qIndex===questions.length-1 ? 'disabled' : ''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    $('#saved-audio-area').innerHTML = AIScorer.renderQuestionRecordingHistory(getQuestionRecordingKey(q));
    renderSubmissionPanel(t('panel_study_then_record'));
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });
    restoreSavedUi(q);
  }

  window.RL_play = function() {
    const btn = $('#play-btn');
    const q = questions[qIndex];
    const fill = $('#ap-fill');
    if (!player) {
      player = createAudioPlayer({
        source: getQuestionAudioSource(q),
        fallbackText: q.transcript,
        onProgress: (pct) => { fill.style.width = `${pct * 100}%`; },
        onEnd: () => { player = null; fill.style.width = '100%'; updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) }); readyState(); },
        onStateChange: (state) => {
          phase = state === 'playing' ? 'playing' : phase;
          updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }), state });
        }
      });
      if (!player.play()) return;
      return;
    }
    player.toggle();
  };

  window.RL_startRecord = async function() {
    if (phase === 'recording') return;
    const startedManually = phase === 'ready';
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
    $('#recorder-area').innerHTML = `
<div class="recorder-widget recording" id="rw">
  <button class="record-btn recording" onclick="RL_stopRecord()">⏹</button>
  <div class="record-status recording">${t('rl_status_recording')}</div>
  <div class="waveform">${Array(5).fill('<div class="waveform-bar"></div>').join('')}</div>
  <div class="recorder-actions">
    <button class="btn btn-danger" onclick="RL_cancelRecord()">${t('btn_cancel')}</button>
  </div>
</div>`;
    timerObj = new CountdownTimer($('#timer-el'), 40, null, RL_stopRecord);
    timerObj.start();
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
          readyState(mode === 'cancel' ? t('toast_cancel_msg') : t('toast_exit_msg'));
          return;
        }
        RL_showResult();
      },
      onError: (e) => {
        showToast(e);
        RL_showResult();
      }
    });
    recorder.start();
    armSilenceRule();
  };

  window.RL_stopRecord = function() {
    if (phase !== 'recording') return;
    phase = 'done';
    stopTimer();
    clearRecorder('score');
  };

  window.RL_cancelRecord = function() {
    if (phase !== 'recording') return;
    phase = 'ready';
    stopTimer();
    clearRecorder('cancel');
  };

  window.RL_exitRecord = function() {
    if (phase !== 'recording') {
      RL_reset();
      return;
    }
    phase = 'ready';
    stopTimer();
    clearRecorder('exit');
  };

  window.RL_reset = function() {
    phase = 'idle';
    stopTimer();
    clearRecorder('exit');
    if (player) { player.stop(); player = null; }
    $('#ap-fill').style.width = '0%';
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(questions[qIndex]), fallbackText: questions[qIndex].transcript }) });
    recordingUrl = '';
    recordingBlob = null;
    recordingDurationSeconds = 0;
    $('#recorder-area').innerHTML = `
<div class="recorder-widget">
  <button class="record-btn idle" id="rec-btn" disabled>🎤</button>
  <div class="record-status" id="rec-status">${t('status_play_first')}</div>
</div>`;
    renderSubmissionPanel(t('panel_record_answer'));
  };

  window.RL_handleUpload = async function(event) {
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

  window.RL_clearUpload = function() {
    if (uploadedAudio) SpeakingAudio.revokePreview(uploadedAudio);
    uploadedAudio = null;
    audioSource = recordingBlob ? 'recording' : '';
    renderSubmissionPanel(t('panel_upload_another'));
  };

  window.RL_submitAudio = async function() {
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
    const result = Scorer.retellLecture(transcript, q.transcript);
    const insight = Scorer.getSpeakingInsights(result, transcript, q.transcript);
    Stats.record('retellLecture', result.pte || 0, 90, { transcript, ai_feedback: insight.suggestion });
    AIScorer.saveQuestionRecording(getQuestionRecordingKey(q), {
      audioUrl: activeAudio.previewUrl || '',
      score: result.pte || null,
      createdAt: new Date().toLocaleString(),
    });
    $('#saved-audio-area').innerHTML = AIScorer.renderQuestionRecordingHistory(getQuestionRecordingKey(q));
    $('#score-area').innerHTML = Scorer.renderLocalSpeakingResult({
      questionType: 'retellLecture',
      questionTitle: t('rl_title'),
      result,
      transcript,
      reference: q.transcript,
      audioUrl: activeAudio.previewUrl || '',
      retryAction: 'RL_startRecord()',
      nextAction: qIndex < questions.length - 1 ? 'RL_next()' : '',
    });
    persistUi(q);
  };

  window.RL_showResult = async function() {
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
    <button class="btn btn-primary" onclick="RL_startRecord()">${t('btn_re_record')}</button>
  </div>
</div>`;
    if (failedStartWindow) {
      Stats.record('retellLecture', 0, 90, { transcript: finalText || '', ai_feedback: 'You must start speaking within 5 seconds after recording begins.' });
      $('#score-area').innerHTML = `<div style="background:#fff8ed;border:1px solid #f59e0b;border-radius:8px;padding:14px;font-size:13.5px;color:#92400e"><strong>${t('score_10_label')}</strong><br>${t('score_fail_no_start')}</div>`;
      return;
    }
    if (!recordingBlob && (!finalText || !finalText.trim())) {
      $('#score-area').innerHTML = `<div style="background:#fff8ed;border:1px solid #fcd34d;border-radius:8px;padding:14px;color:#92400e">${t('score_no_speech')}</div>`;
      return;
    }
    audioSource = recordingBlob ? 'recording' : audioSource;
    renderSubmissionPanel(t('panel_recording_ready'));
  };

  window.RL_prev = () => { clearSavedUi(questions[qIndex]); qIndex = Math.max(0, qIndex - 1); stopTimer(); clearSilenceWatcher(); clearRecorder('exit'); if (player) { player.stop(); player = null; } render(); };
  window.RL_next = () => { clearSavedUi(questions[qIndex]); qIndex = Math.min(questions.length - 1, qIndex + 1); stopTimer(); clearSilenceWatcher(); clearRecorder('exit'); if (player) { player.stop(); player = null; } render(); };
  render();
};
