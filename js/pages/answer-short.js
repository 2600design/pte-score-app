Pages['answer-short'] = function() {
  let qIndex = 0;
  let recorder = null;
  let finalText = '';
  let phase = 'idle';
  let timerObj = null;
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
    $('#page-container').innerHTML = `
<div class="page-header">
  <h1>${t('asq_title')} <span class="badge badge-speaking">${t('badge_speaking')}</span></h1>
  <p>${t('asq_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav">
    <span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span>
    <div id="timer-el" class="timer"><span class="timer-dot"></span>00:00</div>
  </div>
  <div class="q-instruction">${t('asq_instruction')}</div>
  <div class="audio-widget">
    <button class="audio-btn" id="play-btn" onclick="ASQ_play()" aria-label="${t('btn_play_audio')}">▶</button>
    <div class="audio-progress">
      <div class="audio-label">${t('asq_listen_label')}</div>
      <div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div>
    </div>
  </div>
  <div id="recorder-area">
    <div class="recorder-widget">
      <button class="record-btn idle" id="rec-btn" disabled>🎤</button>
      <div class="record-status">${t('asq_play_first')}</div>
    </div>
  </div>
  <div id="result-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-secondary" onclick="ASQ_prev()" ${qIndex===0 ? 'disabled' : ''}>${t('btn_prev')}</button>
    <button class="btn btn-primary" onclick="ASQ_next()" ${qIndex===questions.length-1 ? 'disabled' : ''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
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
      continuous: true,
      keepAlive: false,
      onResult: ({ final, interim }) => {
        finalText = final || finalText;
        if ((final || interim || '').trim()) {
          speechDetected = true;
          if (silenceWatcher) silenceWatcher.markSpeechDetected();
        }
      },
      onEnd: () => {
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
    $('#recorder-area').innerHTML = `
<div class="recorder-widget">
  <button class="record-btn idle" id="rec-btn" disabled>🎤</button>
  <div class="record-status">${t('asq_play_first')}</div>
</div>`;
  };

  window.ASQ_showResult = function() {
    const q = questions[qIndex];
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
    Stats.record('answerShort', correct ? 90 : 10, 90, { transcript: finalText || '', ai_feedback: correct ? 'Correct short answer.' : `Expected answer: ${q.answer}` });
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
