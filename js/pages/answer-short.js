Pages['answer-short'] = function() {
  let qIndex = 0;
  let recorder = null;
  let finalText = '';
  let phase = 'idle';
  let timerObj = null;
  let recordingUrl = '';
  let recordingBlob = null;
  let recordingDurationSeconds = 0;
  let recordingStartedAt = 0;
  let stopMode = 'score';
  let silenceWatcher = null;
  let speechDetected = false;
  let failedStartWindow = false;
  let player = null;
  const sourceQuestions = getQuestionSet(DB.answerShort, 'answerShortQuestion', item => ({
    id: item.id,
    tag: `${t('prediction_badge')} · ${item.monthTag}`,
    question: item.content,
    answer: item.answer || '',
    audio: item.audio || item.audioUrl || '',
    isPrediction: true,
  }));
  const totalQuestions = sourceQuestions.length;
  const questions = getAccessibleQuestions(sourceQuestions);
  qIndex = getInitialQuestionIndex(questions);
  const isEn = () => typeof getAppLang === 'function' && getAppLang() === 'en';
  const getQuestionRecordingKey = (question) => `answerShort:${question?.id || qIndex}`;

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
        ASQ_stopRecord();
      },
    });
  }

  function readyState(message, startCountdown = true) {
    phase = 'ready';
    finalText = '';
    recordingUrl = '';
    recordingBlob = null;
    recordingDurationSeconds = 0;
    speechDetected = false;
    failedStartWindow = false;
    clearSilenceWatcher();
    $('#result-area').innerHTML = '';
    $('#recorder-area').innerHTML = `
<div class="recorder-widget">
  <button class="record-btn idle" id="rec-btn" onclick="ASQ_startRecord()">🎤</button>
  <div class="record-status">${message || t('asq_ready_default')}</div>
  <div class="recorder-actions">
    <button class="btn btn-primary" onclick="ASQ_startRecord()">${t('btn_start_recording')}</button>
  </div>
</div>`;
    stopTimer();
    if (startCountdown) {
      timerObj = new CountdownTimer($('#timer-el'), 10, null, () => ASQ_startRecord());
      timerObj.start();
    } else {
      resetTimerDisplay();
    }
  }

  function render() {
    const q = questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'answerShort', questionText: q.question });
    const promptHtml = `
<div class="audio-widget">
  <button class="audio-btn" id="play-btn" onclick="ASQ_play()" aria-label="${t('btn_play_audio')}">▶</button>
  <div class="audio-progress">
    <div class="audio-label">${t('asq_listen_label')}</div>
    <div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div>
  </div>
</div>`;
    const recordingHtml = AIScorer.renderRecordingCard({
      state: phase,
      promptHtml,
      contentHtml: `<div id="recorder-area">
  <div class="recorder-widget">
    <button class="record-btn idle" id="rec-btn" disabled>🎤</button>
    <div class="record-status">${t('asq_play_first')}</div>
  </div>
</div>
<div id="result-area"></div>`,
    });
    const footerHtml = `
<div class="speaking-exam-footer">
  <div class="btn-group">
    <button class="btn btn-secondary" onclick="ASQ_prev()" ${qIndex===0 ? 'disabled' : ''}>${t('btn_prev')}</button>
    <button class="btn btn-primary" onclick="ASQ_next()" ${qIndex===questions.length-1 ? 'disabled' : ''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    $('#page-container').innerHTML = AIScorer.renderSpeakingQuestionLayout({
      title: t('asq_title'),
      badge: t('badge_speaking'),
      progressLabel: `${qIndex + 1} / ${questions.length}`,
      timerHtml: '<div id="timer-el" class="timer"><span class="timer-dot"></span>00:00</div>',
      instruction: t('asq_instruction'),
      recordingHtml,
      recentHtml: '<div id="saved-audio-area"></div>',
      footerHtml,
    });
    $('#saved-audio-area').innerHTML = AIScorer.renderQuestionRecordingHistory(getQuestionRecordingKey(q));
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.question }) });
  }

  window.ASQ_play = function() {
    const btn = $('#play-btn');
    const q = questions[qIndex];
    const fill = $('#ap-fill');
    if (!player) {
      player = createAudioPlayer({
        source: getQuestionAudioSource(q),
        fallbackText: q.question,
        onProgress: (pct) => { fill.style.width = `${pct * 100}%`; },
        onEnd: () => { player = null; fill.style.width = '100%'; updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.question }) }); readyState(); },
        onStateChange: (state) => {
          phase = state === 'playing' ? 'playing' : phase;
          updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.question }), state });
        }
      });
      if (!player.play()) return;
      return;
    }
    player.toggle();
  };

  window.ASQ_startRecord = async function() {
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
    $('#result-area').innerHTML = '';
    $('#recorder-area').innerHTML = `
<div class="recorder-widget recording">
  <button class="record-btn recording" onclick="ASQ_stopRecord()">⏹</button>
  <div class="record-status recording">${t('asq_status_recording')}</div>
  <div class="waveform">${Array(5).fill('<div class="waveform-bar"></div>').join('')}</div>
  <div class="recorder-actions">
    <button class="btn btn-danger" onclick="ASQ_cancelRecord()">${t('btn_cancel')}</button>
  </div>
</div>`;
    timerObj = new CountdownTimer($('#timer-el'), 10, null, ASQ_stopRecord);
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
        if ((final || interim || '').trim()) {
          speechDetected = true;
          if (silenceWatcher) silenceWatcher.markSpeechDetected();
        }
      },
      onEnd: ({ audioUrl }) => {
        recordingUrl = audioUrl || recordingUrl;
        recordingDurationSeconds = Math.max(1, Math.round((Date.now() - recordingStartedAt) / 1000));
        const mode = stopMode;
        recorder = null;
        if (mode === 'cancel' || mode === 'exit') {
          readyState(mode === 'cancel' ? t('asq_cancel_msg') : t('asq_exit_msg'));
          return;
        }
        ASQ_showResult();
      },
      onError: (e) => {
        showToast(e);
        ASQ_showResult();
      }
    });
    recorder.start();
    armSilenceRule();
  };

  window.ASQ_stopRecord = function() {
    if (phase !== 'recording') return;
    phase = 'done';
    stopTimer();
    clearRecorder('score');
  };

  window.ASQ_cancelRecord = function() {
    if (phase !== 'recording') return;
    phase = 'ready';
    stopTimer();
    clearRecorder('cancel');
  };

  window.ASQ_exitRecord = function() {
    if (phase !== 'recording') {
      ASQ_reset();
      return;
    }
    phase = 'ready';
    stopTimer();
    clearRecorder('exit');
  };

  window.ASQ_reset = function() {
    phase = 'idle';
    stopTimer();
    clearRecorder('exit');
    if (player) { player.stop(); player = null; }
    $('#ap-fill').style.width = '0%';
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(questions[qIndex]), fallbackText: questions[qIndex].question }) });
    $('#result-area').innerHTML = '';
    recordingUrl = '';
    recordingBlob = null;
    recordingDurationSeconds = 0;
    $('#recorder-area').innerHTML = `
<div class="recorder-widget">
  <button class="record-btn idle" id="rec-btn" disabled>🎤</button>
  <div class="record-status">${t('asq_play_first')}</div>
</div>`;
  };

  window.ASQ_showResult = function() {
    const q = questions[qIndex];
    const en = isEn();
    const useCompactResult = window.AIScorer && Scorer.shouldUseCompactSpeakingUI();
    $('#recorder-area').innerHTML = `
<div class="recorder-widget done result-state">
  <div class="recorder-result-main">
    <div class="recorder-result-icon">✓</div>
    <div class="recorder-result-copy">
      <div class="recorder-result-title">${failedStartWindow ? t('result_failed_start') : t('asq_result_title_ok')}</div>
      <div class="recorder-result-sub">${failedStartWindow ? t('result_failed_sub') : t('asq_result_sub_ok')}</div>
    </div>
  </div>
  <div class="result-actions compact">
    <button class="btn btn-primary" onclick="ASQ_startRecord()">${t('btn_re_record')}</button>
  </div>
</div>`;
    if (failedStartWindow) {
      Stats.record('answerShort', 0, 90, { transcript: finalText || '', ai_feedback: 'You must start speaking within 5 seconds after recording begins.' });
      if (useCompactResult) {
        $('#result-area').innerHTML = `
<div class="rs-result-wrap">
${AIScorer.renderResultHero({
  score: 10,
  title: en ? 'Answer Short Question' : '简短回答',
  subtitle: en ? '0–90 PTE Scale' : 'PTE 0–90 分制',
  excerpt: q.question,
})}
${AIScorer.renderMetricCards([
  { key: 'accuracy', label: en ? 'Accuracy' : '准确性', value: 10 },
  { key: 'response', label: en ? 'Response' : '作答状态', value: 10 },
])}
<div class="card speaking-result-card" style="margin-top:12px">
  <div class="card-title">${en ? 'Feedback' : '评分反馈'}</div>
  ${AIScorer.renderTaskFeedbackChips('answerShort', { extra: { isCorrect: false, hasResponse: false } })}
  <div class="speaking-feedback-stack">
    ${AIScorer.renderFeedbackBlock('improve', t('score_fail_no_start'))}
    ${AIScorer.renderFeedbackBlock('suggestion', en ? 'Start speaking as soon as recording begins and answer in one short, precise phrase.' : '录音开始后尽快开口，并用一个简短准确的短语直接作答。')}
  </div>
</div>
<div class="card speaking-result-card" style="margin-top:12px">
  <div class="card-title">${en ? 'Answer Review' : '答案回顾'}</div>
  <div class="score-bar-row"><div class="score-bar-label">${t('asq_correct_answer')}</div><div class="transcript-box" style="padding:6px 12px">${q.answer}</div></div>
  <div class="score-bar-row" style="margin-top:8px"><div class="score-bar-label">${t('asq_your_answer')}</div><div class="transcript-box" style="padding:6px 12px;color:#92400e">${finalText || t('asq_no_speech')}</div></div>
</div>
</div>`;
        return;
      }
      $('#result-area').innerHTML = `
<div class="card" style="margin-top:12px">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
    <span style="font-size:24px">⚠️</span>
    <span style="font-size:16px;font-weight:700;color:var(--warning)">Fail</span>
  </div>
  <div class="score-bar-row"><div class="score-bar-label">${t('asq_score_label')}</div><div class="transcript-box" style="padding:6px 12px;color:#92400e">10 / 90</div></div>
  <div class="score-bar-row" style="margin-top:8px"><div class="score-bar-label">${t('asq_rule_label')}</div><div class="transcript-box" style="padding:6px 12px">${t('score_fail_no_start')}</div></div>
</div>`;
      return;
    }
    const answerNorm = Scorer.normalize(q.answer);
    const responseNorm = Scorer.normalize(finalText || '');
    const correct = responseNorm === answerNorm || responseNorm.split(' ').includes(answerNorm);
    const icon = correct ? '✅' : '❌';
    const color = correct ? 'var(--success)' : 'var(--danger)';
    if (recordingUrl) {
      AIScorer.saveQuestionRecording(getQuestionRecordingKey(q), {
        audioUrl: recordingUrl,
        score: correct ? 90 : 10,
        createdAt: new Date().toLocaleString(),
      });
      $('#saved-audio-area').innerHTML = AIScorer.renderQuestionRecordingHistory(getQuestionRecordingKey(q));
    }
    Stats.record('answerShort', correct ? 90 : 10, 90, { transcript: finalText || '', ai_feedback: correct ? 'Correct short answer.' : `Expected answer: ${q.answer}` });
    if (useCompactResult) {
      const score = correct ? 90 : 10;
      const responseScore = String(finalText || '').trim() ? (correct ? 90 : 48) : 10;
      const feedbackBlocks = correct
        ? `
    ${AIScorer.renderFeedbackBlock('strength', en ? 'You gave the expected short answer clearly and directly.' : '你的回答直接且准确，符合标准答案。')}
    ${AIScorer.renderFeedbackBlock('suggestion', en ? 'Keep answers concise and start speaking immediately after the prompt.' : '继续保持简洁作答，并在提示后尽快开口。')}`
        : `
    ${AIScorer.renderFeedbackBlock('improve', en ? `The expected answer is "${q.answer}".` : `标准答案是“${q.answer}”。`)}
    ${AIScorer.renderFeedbackBlock('suggestion', en ? 'Focus on the key noun or fact and respond with a short exact phrase.' : '抓住题目的关键信息，用简短且精确的短语回答。')}`;
      $('#result-area').innerHTML = `
<div class="rs-result-wrap">
${AIScorer.renderResultHero({
  score,
  title: en ? 'Answer Short Question' : '简短回答',
  subtitle: en ? '0–90 PTE Scale' : 'PTE 0–90 分制',
  excerpt: q.question,
})}
${AIScorer.renderMetricCards([
  { key: 'accuracy', label: en ? 'Accuracy' : '准确性', value: score },
  { key: 'response', label: en ? 'Response' : '作答完整度', value: responseScore },
])}
<div class="card speaking-result-card" style="margin-top:12px">
  <div class="card-title">${en ? 'Feedback' : '评分反馈'}</div>
  ${AIScorer.renderTaskFeedbackChips('answerShort', { extra: { isCorrect: correct, hasResponse: Boolean(String(finalText || '').trim()) } })}
  <div class="speaking-feedback-stack">${feedbackBlocks}
  </div>
</div>
<div class="card speaking-result-card" style="margin-top:12px">
  <div class="card-title">${en ? 'Answer Review' : '答案回顾'}</div>
  <div class="score-bar-row"><div class="score-bar-label">${t('asq_correct_answer')}</div><div class="transcript-box" style="padding:6px 12px">${q.answer}</div></div>
  <div class="score-bar-row" style="margin-top:8px"><div class="score-bar-label">${t('asq_your_answer')}</div><div class="transcript-box" style="padding:6px 12px;color:${color}">${finalText || t('asq_no_speech')}</div></div>
</div>
</div>`;
      return;
    }
    $('#result-area').innerHTML = `
<div class="card" style="margin-top:12px">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
    <span style="font-size:24px">${icon}</span>
    <span style="font-size:16px;font-weight:700;color:${color}">${correct ? t('asq_result_correct') : t('asq_result_incorrect')}</span>
  </div>
  <div class="score-bar-row"><div class="score-bar-label">${t('asq_correct_answer')}</div><div class="transcript-box" style="padding:6px 12px">${q.answer}</div></div>
  <div class="score-bar-row" style="margin-top:8px"><div class="score-bar-label">${t('asq_your_answer')}</div><div class="transcript-box" style="padding:6px 12px;color:${color}">${finalText || t('asq_no_speech')}</div></div>
</div>`;
  };

  window.ASQ_prev = () => { qIndex = Math.max(0, qIndex - 1); stopTimer(); clearSilenceWatcher(); clearRecorder('exit'); if (player) { player.stop(); player = null; } render(); };
  window.ASQ_next = () => { qIndex = Math.min(questions.length - 1, qIndex + 1); stopTimer(); clearSilenceWatcher(); clearRecorder('exit'); if (player) { player.stop(); player = null; } render(); };
  render();
};
