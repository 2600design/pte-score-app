Pages['describe-image'] = function() {
  let qIndex = 0;
  let phase = 'prep';
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
  const predictionQuestions = getQuestionSet(DB.describeImage, 'describeImage', item => ({
    id: item.id,
    title: item.content,
    hint: item.answer || '',
    imageSvg: getPredictionDescribeImageTemplate(item.templateType || 'bar_chart', item.content),
    type: item.templateType || 'bar_chart',
    difficulty: item.difficulty || 'medium',
    isPrediction: true,
  }));
  const usingPredictionBank = getQuestionSource().source === 'prediction';
  const baseTemplates = getDiTemplates();
  const templateQuestions = baseTemplates.map(item => ({
    id: item.id,
    title: item.title,
    hint: item.description || '',
    image: item.image,
    imageSvg: item.imageSvg || '',
    type: item.type,
    difficulty: item.difficulty || 'medium',
    isPrediction: false,
  }));
  const sourceQuestions = usingPredictionBank ? predictionQuestions : templateQuestions;
  const mockQuestions = getMockQuestionSet('describeImage', sourceQuestions);
  const totalQuestions = mockQuestions.length;
  const questions = getTodayPlanQuestions('practice-describe-image', getAccessibleQuestions(mockQuestions));
  qIndex = getInitialQuestionIndex(questions);
  const getQuestionRecordingKey = (question) => `describeImage:${question?.id || qIndex}`;
  const pageStatePage = 'describe-image';

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

  function clearSilenceWatcher() {
    if (silenceWatcher) { silenceWatcher.stop(); silenceWatcher = null; }
  }

  function getActiveAudio() {
    if (audioSource === 'upload' && uploadedAudio) return { ...uploadedAudio, source: 'upload' };
    if (recordingBlob && recordingUrl) {
      return {
        file: new File([recordingBlob], 'describe-image.webm', { type: recordingBlob.type || 'audio/webm' }),
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
    if (Scorer.shouldUseCompactSpeakingUI() && window.AIScorer) {
      const activeAudio = getActiveAudio();
      const canSubmit = !!activeAudio && activeAudio.source === 'recording' && (!!String(finalText || '').trim() || !!window.Capacitor?.isNativePlatform?.());
      const actionHtml = [
        `<label class="btn btn-secondary compact-upload-btn">${uploadedAudio ? t('panel_upload_another') : t('btn_upload_audio')}<input type="file" accept="audio/*" onchange="DI_handleUpload(event)" hidden></label>`,
        uploadedAudio ? `<button class="btn btn-secondary" onclick="DI_clearUpload()">${t('btn_clear') || 'Clear'}</button>` : '',
        recordingBlob ? `<button class="btn btn-secondary" onclick="DI_startRecord()">${t('btn_re_record')}</button>` : '',
        `<button class="btn btn-primary" onclick="DI_submitAudio()" ${canSubmit ? '' : 'disabled'}>${t('btn_submit')}</button>`,
      ].filter(Boolean).join('');
      $('#score-area').innerHTML = AIScorer.renderCompactSubmissionCard({
        title: t('di_title'),
        subtitle: canSubmit ? t('panel_recording_ready') : message,
        audioUrl: activeAudio?.previewUrl || '',
        feedback: [
          AIScorer.renderFeedbackBlock(canSubmit ? 'strength' : 'suggestion', message),
          activeAudio && activeAudio.source !== 'recording' ? AIScorer.renderFeedbackBlock('suggestion', t('toast_local_record_only')) : '',
          !AppAuth.isLoggedIn() && canSubmit ? AIScorer.renderFeedbackBlock('suggestion', t('rs_signin_save')) : '',
        ],
        actionHtml,
      });
      return;
    }
    $('#score-area').innerHTML = SpeakingAudio.renderCapturePanel({
      title: 'Speaking audio',
      helperText: message,
      session: { activeAudio: getActiveAudio() },
      uploadAction: 'DI_handleUpload',
      clearUploadAction: 'DI_clearUpload',
      submitAction: 'DI_submitAudio',
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
        DI_stopRecord();
      },
    });
  }

  function startPrep(message) {
    clearSavedUi(questions[qIndex]);
    phase = 'prep';
    finalText = '';
    recordingUrl = '';
    recordingBlob = null;
    recordingDurationSeconds = 0;
    audioSource = uploadedAudio ? 'upload' : '';
    speechDetected = false;
    failedStartWindow = false;
    clearSilenceWatcher();
    stopTimer();
    $('#recorder-area').innerHTML = `
<div class="recorder-widget">
  <button class="record-btn idle" id="rec-btn" disabled aria-disabled="true">🎤</button>
  <div class="record-status" id="rec-status">${message || t('di_prep_locked')}</div>
  <div class="recorder-actions">
    <button class="btn btn-primary" id="di-start-btn" disabled aria-disabled="true">${t('btn_start_recording')}</button>
  </div>
</div>`;
    renderSubmissionPanel(t('panel_study_then_record'));
    timerObj = new CountdownTimer($('#timer-el'), 25, null, () => {
      enableRecord();
      DI_startRecord();
    });
    timerObj.start();
  }

  function enableRecord(message) {
    phase = 'ready';
    const recBtn = $('#rec-btn');
    const startBtn = $('#di-start-btn');
    const status = $('#rec-status');
    if (recBtn) {
      recBtn.disabled = false;
      recBtn.removeAttribute('aria-disabled');
      recBtn.setAttribute('onclick', 'DI_startRecord()');
    }
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.removeAttribute('aria-disabled');
      startBtn.setAttribute('onclick', 'DI_startRecord()');
    }
    if (status) status.textContent = message || t('di_prep_ready');
    renderSubmissionPanel(t('panel_record_answer'));
  }

  function renderDescribeImageFigure(q) {
    if (q.image) {
      return `<img src="${q.image}" alt="${Scorer.escapeHtml(q.title)}">`;
    }
    return String(q.imageSvg || '')
      .replace(/style="[^"]*"/i, '')
      .replace('<svg ', '<svg class="di-figure-svg" ');
  }

  function render() {
    const q = questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'describeImage', questionText: `${q.title} ${q.hint}` });
    const promptHtml = `
<div class="di-prompt-shell">
<div style="display:flex;gap:8px;flex-wrap:wrap">
  <span class="speaking-exam-badge">${Scorer.escapeHtml(usingPredictionBank ? t('prediction_high_badge') : t('di_template_bank'))}</span>
  <span class="speaking-exam-badge">${Scorer.escapeHtml(`${t('di_type_badge')}: ${q.isPrediction ? q.type.replace(/_/g, ' ') : getDiTemplateTypeLabel(q.type)}`)}</span>
  <span class="speaking-exam-badge">${Scorer.escapeHtml(`${t('di_difficulty_badge')}: ${q.difficulty || 'medium'}`)}</span>
</div>
<div class="speaking-prompt-copy" style="font-size:15px;font-weight:700">${Scorer.escapeHtml(q.title)}</div>
<div class="di-figure-wrap">
  ${renderDescribeImageFigure(q)}
</div>
${q.hint ? `<div class="speaking-prompt-caption">${Scorer.escapeHtml(q.hint)}</div>` : ''}
</div>`;
    const recordingHtml = AIScorer.renderRecordingCard({
      state: phase,
      promptHtml,
      contentHtml: '<div id="recorder-area"></div><div id="score-area"></div>',
    });
    const footerHtml = `
<div class="speaking-exam-footer">
  <div class="btn-group">
    <button class="btn btn-secondary" onclick="DI_prev()" ${qIndex===0 ? 'disabled' : ''}>${t('btn_prev')}</button>
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-describe-image') || `<button class="btn btn-primary" onclick="DI_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-primary" onclick="DI_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    $('#page-container').innerHTML = AIScorer.renderSpeakingQuestionLayout({
      title: t('di_title'),
      badge: t('badge_speaking'),
      progressLabel: `${qIndex + 1} / ${questions.length}`,
      timerHtml: '<div id="timer-el" class="timer"><span class="timer-dot"></span>00:40</div>',
      instruction: t('di_instruction'),
      recordingHtml,
      recentHtml: '<div id="saved-audio-area"></div>',
      footerHtml,
    });
    $('#saved-audio-area').innerHTML = AIScorer.renderQuestionRecordingHistory(getQuestionRecordingKey(q));
    startPrep();
    restoreSavedUi(q);
  }

  window.DI_startRecord = async function() {
    if (phase === 'prep') {
      showToast(t('di_prep_locked'));
      return;
    }
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
<div class="recorder-widget recording" id="rec-widget">
  <button class="record-btn recording" id="rec-btn" onclick="DI_stopRecord()">⏹</button>
  <div class="record-status recording">${t('status_describe_now')}</div>
  <div class="waveform">${Array(5).fill('<div class="waveform-bar"></div>').join('')}</div>
  <div class="recorder-actions">
    <button class="btn btn-danger" onclick="DI_cancelRecord()">${t('btn_cancel')}</button>
  </div>
</div>`;
    timerObj = new CountdownTimer($('#timer-el'), 40, null, DI_stopRecord);
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
          startPrep(mode === 'cancel' ? t('toast_di_cancel') : t('toast_di_exit'));
          return;
        }
        DI_showResult();
      },
      onError: (e) => {
        showToast('Mic: ' + e);
        DI_showResult();
      }
    });
    recorder.start();
    armSilenceRule();
  };

  window.DI_stopRecord = function() {
    if (phase !== 'recording') return;
    phase = 'done';
    stopTimer();
    clearRecorder('score');
  };

  window.DI_cancelRecord = function() {
    if (phase !== 'recording') return;
    phase = 'prep';
    stopTimer();
    clearRecorder('cancel');
  };

  window.DI_exitRecord = function() {
    if (phase !== 'recording') {
      startPrep();
      return;
    }
    phase = 'prep';
    stopTimer();
    clearRecorder('exit');
  };

  window.DI_restart = function() {
    startPrep();
  };

  window.DI_enableRecord = function() {
    enableRecord();
  };

  window.DI_handleUpload = async function(event) {
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

  window.DI_clearUpload = function() {
    if (uploadedAudio) SpeakingAudio.revokePreview(uploadedAudio);
    uploadedAudio = null;
    audioSource = recordingBlob ? 'recording' : '';
    renderSubmissionPanel(t('panel_upload_another'));
  };

  window.DI_submitAudio = async function() {
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
    if (!transcript && activeAudio.source === 'recording' && window.Capacitor?.isNativePlatform?.() && window.AIScorer) {
      const reference = `${q.title} ${q.hint}`;
      const stopLoader = SpeakingAudio.mountStageLoader($('#score-area'));
      try {
        const aiResult = await AIScorer.scoreAudio({
          file: activeAudio.file,
          mimeType: activeAudio.mimeType,
          durationSeconds: activeAudio.durationSeconds || 1,
          task: 'speaking',
          promptType: 'Describe Image',
          questionText: q.title || '',
          referenceAnswer: reference,
        });
        Stats.record('describeImage', aiResult.overall || 0, 90, {
          transcript: aiResult.transcript || '',
          ai_feedback: aiResult.feedback?.summary || '',
        });
        AIScorer.saveQuestionRecording(getQuestionRecordingKey(q), {
          audioUrl: activeAudio.previewUrl || '',
          score: aiResult.overall || null,
          createdAt: new Date().toLocaleString(),
        });
        $('#saved-audio-area').innerHTML = AIScorer.renderQuestionRecordingHistory(getQuestionRecordingKey(q));
        $('#score-area').innerHTML = AIScorer.renderSpeakingResult(aiResult, {
          promptType: t('di_title'),
          referenceText: reference,
          audioUrl: activeAudio.previewUrl || '',
          retryAction: 'DI_startRecord()',
          nextAction: qIndex < questions.length - 1 ? 'DI_next()' : '',
        });
        persistUi(q);
      } catch (error) {
        $('#score-area').innerHTML = AIScorer.renderError(AIScorer.getErrorMessage(error));
      } finally {
        stopLoader && stopLoader();
      }
      return;
    }
    if (!transcript) {
      showToast(t('toast_local_record_only'));
      return;
    }
    const reference = `${q.title} ${q.hint}`;
    const result = Scorer.describeImage(transcript, reference);
    const insight = Scorer.getSpeakingInsights(result, transcript, reference);
    Stats.record('describeImage', result.pte || 0, 90, { transcript, ai_feedback: insight.suggestion });
    AIScorer.saveQuestionRecording(getQuestionRecordingKey(q), {
      audioUrl: activeAudio.previewUrl || '',
      score: result.pte || null,
      createdAt: new Date().toLocaleString(),
    });
    $('#saved-audio-area').innerHTML = AIScorer.renderQuestionRecordingHistory(getQuestionRecordingKey(q));
    $('#score-area').innerHTML = Scorer.renderLocalSpeakingResult({
      questionType: 'describeImage',
      questionTitle: t('di_title'),
      result,
      transcript,
      reference,
      audioUrl: activeAudio.previewUrl || '',
      retryAction: 'DI_startRecord()',
      nextAction: qIndex < questions.length - 1 ? 'DI_next()' : '',
    });
    persistUi(q);
  };

  window.DI_showResult = async function() {
    $('#recorder-area').innerHTML = `
<div class="recorder-widget done result-state">
  <div class="recorder-result-main">
    <div class="recorder-result-icon">✓</div>
    <div class="recorder-result-copy">
      <div class="recorder-result-title">${failedStartWindow ? t('result_failed_start') : t('result_recording_complete')}</div>
      <div class="recorder-result-sub">${failedStartWindow ? t('result_failed_sub') : t('result_description_ready')}</div>
    </div>
  </div>
  <div class="result-actions compact">
    <button class="btn btn-primary" onclick="DI_startRecord()">${t('btn_re_record')}</button>
  </div>
</div>`;
    if (failedStartWindow) {
      Stats.record('describeImage', 0, 90, { transcript: finalText || '', ai_feedback: 'You must start speaking within 5 seconds after recording begins.' });
      if (Scorer.shouldUseCompactSpeakingUI() && window.AIScorer) {
        $('#score-area').innerHTML = AIScorer.renderCompactStateCard({
          score: 10,
          title: t('di_title'),
          subtitle: t('result_failed_start'),
          feedback: [
            AIScorer.renderFeedbackBlock('improve', t('score_fail_no_start')),
            AIScorer.renderFeedbackBlock('suggestion', t('result_failed_sub')),
          ],
          actionHtml: `<button class="btn btn-primary" onclick="DI_startRecord()">${t('btn_re_record')}</button>`,
        });
        return;
      }
      $('#score-area').innerHTML = `<div style="background:#fff8ed;border:1px solid #f59e0b;border-radius:8px;padding:14px;font-size:13.5px;color:#92400e"><strong>${t('score_10_label')}</strong><br>${t('score_fail_no_start')}</div>`;
      return;
    }
    if (!recordingBlob && (!finalText || !finalText.trim())) {
      if (Scorer.shouldUseCompactSpeakingUI() && window.AIScorer) {
        $('#score-area').innerHTML = AIScorer.renderCompactStateCard({
          score: 10,
          title: t('di_title'),
          subtitle: t('result_no_speech'),
          feedback: [
            AIScorer.renderFeedbackBlock('improve', t('score_no_speech')),
            AIScorer.renderFeedbackBlock('suggestion', t('result_no_speech_sub')),
          ],
          actionHtml: `<button class="btn btn-primary" onclick="DI_startRecord()">${t('btn_re_record')}</button>`,
        });
        return;
      }
      $('#score-area').innerHTML = `<div style="background:#fff8ed;border:1px solid #fcd34d;border-radius:8px;padding:14px;font-size:13.5px;color:#92400e">${t('score_no_speech')}</div>`;
      return;
    }
    audioSource = recordingBlob ? 'recording' : audioSource;
    renderSubmissionPanel(t('panel_recording_ready'));
  };

  window.DI_prev = () => { clearSavedUi(questions[qIndex]); qIndex = Math.max(0, qIndex - 1); stopTimer(); clearSilenceWatcher(); clearRecorder('exit'); render(); };
  window.DI_next = () => { clearSavedUi(questions[qIndex]); qIndex = Math.min(questions.length - 1, qIndex + 1); stopTimer(); clearSilenceWatcher(); clearRecorder('exit'); render(); };
  render();
};
