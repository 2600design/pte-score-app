// ── Summarize Spoken Text ─────────────────────────────────────────────────
Pages['summarize-spoken'] = function() {
  let qIndex=0, timerObj=null;
  let player=null;
  const sourceQuestions = getMockQuestionSet('summarizeSpoken', DB.summarizeSpoken);
  const totalQuestions=sourceQuestions.length;
  const questions=getTodayPlanQuestions('practice-summarize-spoken', getAccessibleQuestions(sourceQuestions));
  qIndex = getInitialQuestionIndex(questions);

  function stopPlayback() {
    if (player) {
      player.stop();
      player = null;
    }
  }

  function render(){
    stopPlayback();
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'highlightSummary', questionText: q.transcript });
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'summarizeSpoken', questionText: q.transcript });
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>${t('sst_title')} <span class="badge badge-listening">${t('badge_listening')}</span></h1>
  <p>${t('sst_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav">
    <span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span>
    <div id="timer-el" class="timer"><span class="timer-dot"></span>10:00</div>
  </div>
  <div class="q-instruction">${t('sst_instruction').replace('${min}', q.wordRange[0]).replace('${max}', q.wordRange[1])}</div>
  <div class="audio-widget">
    <button class="audio-btn" id="play-btn" onclick="SST_play()" aria-label="${t('btn_play_audio')}">▶</button>
    <div class="audio-progress">
      <div class="audio-label">${q.title}</div>
      <div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div>
      <div class="audio-time"><span>0:00</span><span>${formatTime(q.duration)}</span></div>
    </div>
  </div>
  <textarea class="textarea" id="notes" rows="2" placeholder="${t('sst_notes_placeholder')}" style="margin-bottom:12px"></textarea>
  <textarea class="textarea" id="answer" rows="5" placeholder="${t('sst_summary_placeholder')}" oninput="SST_update()"></textarea>
  <div class="word-count" id="wc-label">0 ${t('words')}</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="SST_submit()">${t('btn_submit')}</button>
    <button class="btn btn-secondary" onclick="SST_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-summarize-spoken') || `<button class="btn btn-secondary" onclick="SST_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="SST_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-summarize-spoken', qIndex, question: q, detailPage: 'summarize-spoken' });
    bindMockDraftPersistence({ pageKey: 'practice-summarize-spoken', question: q, questionType: 'summarizeSpoken', title: t('sst_title'), section: 'listening', sectionLabel: 'Listening', promptText: q.transcript });
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });
    timerObj=new CountdownTimer($('#timer-el'),600,null,()=>SST_submit(true)); timerObj.start();
  }

  window.SST_play=function(){
    const btn=$('#play-btn');
    const q=questions[qIndex]; const fill=$('#ap-fill');
    if(!player){
      player=createAudioPlayer({
        source:getQuestionAudioSource(q),
        fallbackText:q.transcript,
        onProgress:(pct)=>{fill.style.width=`${pct*100}%`;},
        onEnd:()=>{player=null; fill.style.width='100%'; updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });},
        onStateChange:(state)=>{ updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }), state }); }
      });
      if (!player.play()) return;
      return;
    }
    player.toggle();
  };
  window.SST_update=function(){
    const q=questions[qIndex]; const wc=countWords($('#answer').value);
    const el=$('#wc-label'); el.textContent=`${wc} ${t('words')}`;
    el.className='word-count'+(wc>=q.wordRange[0]&&wc<=q.wordRange[1]?' ok':wc>q.wordRange[1]?' warn':'');
  };
  window.SST_submit=async function(auto=false){
    timerObj&&timerObj.stop();
    const q=questions[qIndex]; const text=$('#answer').value;
    if (!AppAuth.isLoggedIn()) {
      AuthUI.open('login');
      $('#feedback-area').innerHTML = AIScorer.renderAuthGate();
      return;
    }
    const result = Scorer.summarizeSpoken(text, q.transcript, q.wordRange);
    Stats.record('summarizeSpoken', result.pte || 0, 90, { transcript: text || '', ai_feedback: result.label || '' });
    $('#feedback-area').innerHTML=`
${Scorer.renderLocalStructuredResult({ questionType: 'summarizeSpoken', title: t('sst_title'), result, retryAction: 'SST_retry()', nextAction: qIndex < questions.length-1 ? 'SST_next()' : getTodayPlanNextAction('practice-summarize-spoken') })}
${auto?`<div style="color:var(--warning);font-size:13px;margin:6px 0 0 2px">${t('auto_submitted')}</div>`:''}
<div class="card" style="margin-top:12px"><div class="card-title">${t('sst_original_transcript')}</div><div class="transcript-box">${q.transcript}</div></div>
<div class="retry-row"><button class="btn btn-refresh" onclick="SST_retry()">${t('btn_retry')}</button></div>`;
  };
  window.SST_retry=()=>{timerObj&&timerObj.stop();render();};
  window.SST_prev=()=>{qIndex=Math.max(0,qIndex-1);timerObj&&timerObj.stop(); render();};
  window.SST_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1);timerObj&&timerObj.stop(); render();};
  render();
};

// ── MC Single Listening ────────────────────────────────────────────────────
Pages['mc-single-listening'] = function() {
  let qIndex=0; const sourceQuestions=getMockQuestionSet('mcSingleListening', DB.mcSingleListening); const totalQuestions=sourceQuestions.length; const questions=getTodayPlanQuestions('practice-mc-single-listening', getAccessibleQuestions(sourceQuestions));
  qIndex = getInitialQuestionIndex(questions);
  let player=null;

  function stopPlayback() {
    if (player) {
      player.stop();
      player = null;
    }
  }

  function render(){
    stopPlayback();
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'selectMissing', questionText: q.transcript });
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'mcSingleListening', questionText: `${q.transcript} ${q.question}` });
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>${t('mcsl_title')} <span class="badge badge-listening">${t('badge_listening')}</span></h1>
  <p>${t('mcsl_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span></div>
  <div class="audio-widget">
    <button class="audio-btn" id="play-btn" onclick="MCSL_play()" aria-label="${t('btn_play_audio')}">▶</button>
    <div class="audio-progress">
      <div class="audio-label">${q.title}</div>
      <div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div>
    </div>
  </div>
  <div class="q-title">${q.question}</div>
  <div class="choice-list">${q.options.map((o,i)=>`<label class="choice" id="c${i}"><input type="radio" name="mc" value="${i}" onchange="MCSL_check(${i})"> ${o}</label>`).join('')}</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-secondary" onclick="MCSL_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-mc-single-listening') || `<button class="btn btn-primary" onclick="MCSL_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-primary" onclick="MCSL_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-mc-single-listening', qIndex, question: q, detailPage: 'mc-single-listening' });
    bindMockDraftPersistence({ pageKey: 'practice-mc-single-listening', question: q, questionType: 'mcSingleListening', title: t('mcsl_title'), section: 'listening', sectionLabel: 'Listening', promptText: `${q.transcript} ${q.question}` });
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });
  }

  window.MCSL_play=function(){ const btn=$('#play-btn'); const q=questions[qIndex]; const fill=$('#ap-fill'); if(!player){ player=createAudioPlayer({ source:getQuestionAudioSource(q), fallbackText:q.transcript, onProgress:(pct)=>{fill.style.width=`${pct*100}%`;}, onEnd:()=>{player=null; fill.style.width='100%'; updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });}, onStateChange:(state)=>{ updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }), state }); } }); if(!player.play()) return; return; } player.toggle(); };
  window.MCSL_check=function(i){ const q=questions[qIndex]; $$('.choice').forEach(c=>c.classList.remove('selected','correct','incorrect')); if(i===q.answer){$('#c'+i).classList.add('correct');Stats.record('mcSingleListening',100,100);$('#feedback-area').innerHTML=`${window.AIScorer ? AIScorer.renderTaskFeedbackChips('mcSingleListening', {extra:{isCorrect:true}}) : ''}<div style="color:var(--success);font-weight:600">${t('answer_correct')}</div><div class="retry-row"><button class="btn btn-refresh" onclick="MCSL_retry()">${t('btn_retry')}</button></div>`;}else{$('#c'+i).classList.add('incorrect');$('#c'+q.answer).classList.add('correct');Stats.record('mcSingleListening',0,100);$('#feedback-area').innerHTML=`${window.AIScorer ? AIScorer.renderTaskFeedbackChips('mcSingleListening', {extra:{isCorrect:false}}) : ''}<div style="color:var(--danger);font-weight:600">${t('answer_incorrect')}</div><div class="retry-row"><button class="btn btn-refresh" onclick="MCSL_retry()">${t('btn_retry')}</button></div>`;} };
  window.MCSL_retry=()=>{ render(); };
  window.MCSL_prev=()=>{qIndex=Math.max(0,qIndex-1); render();};
  window.MCSL_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1); render();};
  render();
};

// ── MC Multiple Listening ─────────────────────────────────────────────────
Pages['mc-multiple-listening'] = function() {
  let qIndex=0; const sourceQuestions=getMockQuestionSet('mcMultipleListening', DB.mcMultipleListening); const totalQuestions=sourceQuestions.length; const questions=getTodayPlanQuestions('practice-mc-multiple-listening', getAccessibleQuestions(sourceQuestions));
  qIndex = getInitialQuestionIndex(questions);
  let player=null;

  function stopPlayback() {
    if (player) {
      player.stop();
      player = null;
    }
  }

  function render(){
    stopPlayback();
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'highlightIncorrect', questionText: q.transcript });
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'mcMultipleListening', questionText: `${q.transcript} ${q.question}` });
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>${t('mcml_title')} <span class="badge badge-listening">${t('badge_listening')}</span></h1>
  <p>${t('mcml_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span></div>
  <div class="audio-widget">
    <button class="audio-btn" id="play-btn" onclick="MCML_play()" aria-label="${t('btn_play_audio')}">▶</button>
    <div class="audio-progress"><div class="audio-label">${q.title}</div><div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div></div>
  </div>
  <div class="q-title">${q.question}</div>
  <div class="choice-list">${q.options.map((o,i)=>`<label class="choice" id="cm${i}"><input type="checkbox" value="${i}"> ${o}</label>`).join('')}</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="MCML_submit()">${t('btn_check')}</button>
    <button class="btn btn-secondary" onclick="MCML_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-mc-multiple-listening') || `<button class="btn btn-secondary" onclick="MCML_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="MCML_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-mc-multiple-listening', qIndex, question: q, detailPage: 'mc-multiple-listening' });
    bindMockDraftPersistence({ pageKey: 'practice-mc-multiple-listening', question: q, questionType: 'mcMultipleListening', title: t('mcml_title'), section: 'listening', sectionLabel: 'Listening', promptText: `${q.transcript} ${q.question}` });
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });
  }
  window.MCML_play=function(){ const btn=$('#play-btn');const q=questions[qIndex];const fill=$('#ap-fill'); if(!player){ player=createAudioPlayer({ source:getQuestionAudioSource(q), fallbackText:q.transcript, onProgress:(pct)=>{fill.style.width=`${pct*100}%`;}, onEnd:()=>{player=null; fill.style.width='100%'; updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });}, onStateChange:(state)=>{ updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }), state }); } }); if(!player.play()) return; return; } player.toggle(); };
  window.MCML_submit=function(){ const q=questions[qIndex];const sel=$$('.choice input:checked').map(e=>+e.value);const correct=q.answers;let pts=0;q.options.forEach((_,i)=>{const s=sel.includes(i),a=correct.includes(i);if(s&&a){$('#cm'+i).classList.add('correct');pts++;}else if(s&&!a){$('#cm'+i).classList.add('incorrect');pts--;}else if(!s&&a){$('#cm'+i).style.border='2px dashed var(--success)';}});pts=Math.max(0,pts);const pct=Math.round(pts/correct.length*100);Stats.record('mcMultipleListening',pct,100);const _mcml_missed=correct.filter(i=>!sel.includes(i)).length;const _mcml_wrong=sel.filter(i=>!correct.includes(i)).length;$('#feedback-area').innerHTML=`<div class="score-panel" style="margin-top:16px"><div class="score-big">${pts}/${correct.length}</div><div class="score-label">${t('score_correct')}</div></div>${window.AIScorer ? AIScorer.renderTaskFeedbackChips('mcMultipleListening', {extra:{pts,total:correct.length,missed:_mcml_missed,wrong:_mcml_wrong}}) : ''}<div class="retry-row"><button class="btn btn-refresh" onclick="MCML_retry()">${t('btn_retry')}</button></div>`; };
  window.MCML_retry=()=>{ render(); };
  window.MCML_prev=()=>{qIndex=Math.max(0,qIndex-1); render();};
  window.MCML_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1); render();};
  render();
};

// ── Fill in Blanks Listening ──────────────────────────────────────────────
Pages['fill-blanks-listening'] = function() {
  let qIndex=0; const sourceQuestions=getMockQuestionSet('fillBlanksListening', DB.fillBlanksListening); const totalQuestions=sourceQuestions.length; const questions=getTodayPlanQuestions('practice-fill-blanks-listening', getAccessibleQuestions(sourceQuestions));
  qIndex = getInitialQuestionIndex(questions);
  let player=null;

  function stopPlayback() {
    if (player) {
      player.stop();
      player = null;
    }
  }

  function render(){
    stopPlayback();
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'writeDictation', questionText: q.sentence });
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'fillBlanksListening', questionText: q.transcript });
    let blankHtml='';
    q.blanks.forEach((b,i)=>{ blankHtml+=`<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:14px"><span>${b.before}</span> <input class="blank-input" id="fb${i}" data-key="${b.key}" style="min-width:${b.key.length*10+20}px" placeholder="..."> <span>${b.after}</span></div>`; });
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>${t('fbl_title')} <span class="badge badge-listening">${t('badge_listening')}</span></h1>
  <p>${t('fbl_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span></div>
  <div class="audio-widget">
    <button class="audio-btn" id="play-btn" onclick="FBL_play()" aria-label="${t('btn_play_audio')}">▶</button>
    <div class="audio-progress"><div class="audio-label">${q.title}</div><div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div></div>
  </div>
  <div class="q-instruction">${t('fbl_instruction')}</div>
  <div style="padding:16px 0">${blankHtml}</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="FBL_submit()">${t('btn_check')}</button>
    <button class="btn btn-secondary" onclick="FBL_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-fill-blanks-listening') || `<button class="btn btn-secondary" onclick="FBL_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="FBL_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-fill-blanks-listening', qIndex, question: q, detailPage: 'fill-blanks-listening' });
    bindMockDraftPersistence({ pageKey: 'practice-fill-blanks-listening', question: q, questionType: 'fillBlanksListening', title: t('fbl_title'), section: 'listening', sectionLabel: 'Listening', promptText: q.transcript });
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });
  }
  window.FBL_play=function(){const btn=$('#play-btn');const q=questions[qIndex];const fill=$('#ap-fill'); if(!player){ player=createAudioPlayer({ source:getQuestionAudioSource(q), fallbackText:q.transcript, onProgress:(pct)=>{fill.style.width=`${pct*100}%`;}, onEnd:()=>{player=null; fill.style.width='100%'; updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });}, onStateChange:(state)=>{ updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }), state }); } }); if(!player.play()) return; return; } player.toggle();};
  window.FBL_submit=function(){const q=questions[qIndex];const inputs=$$('[id^=fb]');let c=0;inputs.forEach(inp=>{const val=inp.value.trim().toLowerCase(),ans=inp.dataset.key.toLowerCase();if(val===ans){c++;inp.style.background='#dcfce7';inp.style.color='#15803d';inp.style.borderBottomColor='#22c55e';}else{inp.style.background='#fee2e2';inp.style.color='var(--danger)';inp.style.borderBottomColor='var(--danger)';const sp=document.createElement('span');sp.style='font-size:12px;color:var(--success);margin-left:4px';sp.textContent='('+inp.dataset.key+')';inp.after(sp);}});Stats.record('fillBlanksListening',Math.round(c/q.blanks.length*100),100);$('#feedback-area').innerHTML=`<div class="score-panel" style="margin-top:16px"><div class="score-big">${c}/${q.blanks.length}</div><div class="score-label">${t('score_correct_blanks')}</div></div>${window.AIScorer ? AIScorer.renderTaskFeedbackChips('fillBlanksListening', {extra:{correct:c,total:q.blanks.length}}) : ''}<div class="retry-row"><button class="btn btn-refresh" onclick="FBL_retry()">${t('btn_retry')}</button></div>`;};
  window.FBL_retry=()=>{ render(); };
  window.FBL_prev=()=>{qIndex=Math.max(0,qIndex-1); render();};
  window.FBL_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1); render();};
  render();
};

// ── Highlight Correct Summary ─────────────────────────────────────────────
Pages['highlight-summary'] = function() {
  let qIndex=0; const sourceQuestions=getMockQuestionSet('highlightSummary', DB.highlightSummary); const totalQuestions=sourceQuestions.length; const questions=getTodayPlanQuestions('practice-highlight-summary', getAccessibleQuestions(sourceQuestions));
  qIndex = getInitialQuestionIndex(questions);
  let player=null;

  function stopPlayback() {
    if (player) {
      player.stop();
      player = null;
    }
  }

  function render(){
    stopPlayback();
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>${t('hcs_title')} <span class="badge badge-listening">${t('badge_listening')}</span></h1>
  <p>${t('hcs_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span></div>
  <div class="audio-widget">
    <button class="audio-btn" id="play-btn" onclick="HCS_play()" aria-label="${t('btn_play_audio')}">▶</button>
    <div class="audio-progress"><div class="audio-label">${q.title}</div><div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div></div>
  </div>
  <div class="q-instruction">${t('hcs_instruction')}</div>
  <div class="choice-list">${q.summaries.map((s,i)=>`<label class="choice" id="hc${i}"><input type="radio" name="hcs" value="${i}" onchange="HCS_check(${i})"> ${s}</label>`).join('')}</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-secondary" onclick="HCS_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-highlight-summary') || `<button class="btn btn-secondary" onclick="HCS_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="HCS_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-highlight-summary', qIndex, question: q, detailPage: 'highlight-summary' });
    bindMockDraftPersistence({ pageKey: 'practice-highlight-summary', question: q, questionType: 'highlightSummary', title: t('hcs_title'), section: 'listening', sectionLabel: 'Listening', promptText: q.transcript });
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });
  }
  window.HCS_play=function(){const btn=$('#play-btn');const q=questions[qIndex];const fill=$('#ap-fill'); if(!player){ player=createAudioPlayer({ source:getQuestionAudioSource(q), fallbackText:q.transcript, onProgress:(pct)=>{fill.style.width=`${pct*100}%`;}, onEnd:()=>{player=null; fill.style.width='100%'; updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });}, onStateChange:(state)=>{ updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }), state }); } }); if(!player.play()) return; return; } player.toggle();};
  window.HCS_check=function(i){const q=questions[qIndex];$$('.choice').forEach(c=>c.classList.remove('correct','incorrect'));if(i===q.answer){$('#hc'+i).classList.add('correct');Stats.record('highlightSummary',100,100);$('#feedback-area').innerHTML=`${window.AIScorer ? AIScorer.renderTaskFeedbackChips('highlightSummary', {extra:{isCorrect:true}}) : ''}<div style="color:var(--success);font-weight:600">${t('answer_correct')}</div><div class="retry-row"><button class="btn btn-refresh" onclick="HCS_retry()">${t('btn_retry')}</button></div>`;}else{$('#hc'+i).classList.add('incorrect');$('#hc'+q.answer).classList.add('correct');Stats.record('highlightSummary',0,100);$('#feedback-area').innerHTML=`${window.AIScorer ? AIScorer.renderTaskFeedbackChips('highlightSummary', {extra:{isCorrect:false}}) : ''}<div style="color:var(--danger);font-weight:600">${t('answer_incorrect_highlighted')}</div><div class="retry-row"><button class="btn btn-refresh" onclick="HCS_retry()">${t('btn_retry')}</button></div>`;}};
  window.HCS_retry=()=>{ render(); };
  window.HCS_prev=()=>{qIndex=Math.max(0,qIndex-1); render();};
  window.HCS_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1); render();};
  render();
};

// ── Select Missing Word ────────────────────────────────────────────────────
Pages['select-missing'] = function() {
  let qIndex=0; const sourceQuestions=getMockQuestionSet('selectMissing', DB.selectMissing); const totalQuestions=sourceQuestions.length; const questions=getTodayPlanQuestions('practice-select-missing', getAccessibleQuestions(sourceQuestions));
  qIndex = getInitialQuestionIndex(questions);
  let player=null;

  function stopPlayback() {
    if (player) {
      player.stop();
      player = null;
    }
  }

  function render(){
    stopPlayback();
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>${t('smw_title')} <span class="badge badge-listening">${t('badge_listening')}</span></h1>
  <p>${t('smw_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span></div>
  <div class="audio-widget">
    <button class="audio-btn" id="play-btn" onclick="SMW_play()" aria-label="${t('btn_play_audio')}">▶</button>
    <div class="audio-progress"><div class="audio-label">${q.title}</div><div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div></div>
  </div>
  <div class="q-instruction">${t('smw_instruction')}</div>
  <div class="choice-list">${q.options.map((o,i)=>`<label class="choice" id="sm${i}"><input type="radio" name="smw" value="${i}" onchange="SMW_check(${i})"> ${o}</label>`).join('')}</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-secondary" onclick="SMW_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-select-missing') || `<button class="btn btn-secondary" onclick="SMW_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="SMW_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-select-missing', qIndex, question: q, detailPage: 'select-missing' });
    bindMockDraftPersistence({ pageKey: 'practice-select-missing', question: q, questionType: 'selectMissing', title: t('smw_title'), section: 'listening', sectionLabel: 'Listening', promptText: q.transcript });
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });
  }
  window.SMW_play=function(){const btn=$('#play-btn');const q=questions[qIndex];const fill=$('#ap-fill'); if(!player){ player=createAudioPlayer({ source:getQuestionAudioSource(q), fallbackText:q.transcript, onProgress:(pct)=>{fill.style.width=`${pct*100}%`;}, onEnd:()=>{player=null; fill.style.width='100%'; updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });}, onStateChange:(state)=>{ updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }), state }); } }); if(!player.play()) return; return; } player.toggle();};
  window.SMW_check=function(i){const q=questions[qIndex];$$('.choice').forEach(c=>c.classList.remove('correct','incorrect'));if(i===q.answer){$('#sm'+i).classList.add('correct');Stats.record('selectMissing',100,100);$('#feedback-area').innerHTML=`${window.AIScorer ? AIScorer.renderTaskFeedbackChips('selectMissing', {extra:{isCorrect:true}}) : ''}<div style="color:var(--success);font-weight:600">${t('answer_correct')}</div><div class="retry-row"><button class="btn btn-refresh" onclick="SMW_retry()">${t('btn_retry')}</button></div>`;}else{$('#sm'+i).classList.add('incorrect');$('#sm'+q.answer).classList.add('correct');Stats.record('selectMissing',0,100);$('#feedback-area').innerHTML=`${window.AIScorer ? AIScorer.renderTaskFeedbackChips('selectMissing', {extra:{isCorrect:false}}) : ''}<div style="color:var(--danger);font-weight:600">${t('answer_incorrect')}</div><div class="retry-row"><button class="btn btn-refresh" onclick="SMW_retry()">${t('btn_retry')}</button></div>`;}};
  window.SMW_retry=()=>{ render(); };
  window.SMW_prev=()=>{qIndex=Math.max(0,qIndex-1); render();};
  window.SMW_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1); render();};
  render();
};

// ── Highlight Incorrect Words ─────────────────────────────────────────────
Pages['highlight-incorrect'] = function() {
  let qIndex=0; const sourceQuestions=getMockQuestionSet('highlightIncorrect', DB.highlightIncorrect); const totalQuestions=sourceQuestions.length; const questions=getTodayPlanQuestions('practice-highlight-incorrect', getAccessibleQuestions(sourceQuestions));
  qIndex = getInitialQuestionIndex(questions);
  let player=null;

  function stopPlayback() {
    if (player) {
      player.stop();
      player = null;
    }
  }

  function render(){
    stopPlayback();
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    selected.clear();
    const wordSpans=q.textWords.map((w,i)=>`<span data-idx="${i}" onclick="HI_toggle(${i})" style="cursor:pointer;padding:1px 3px;border-radius:3px">${w}</span>`).join(' ');
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>${t('hi_title')} <span class="badge badge-listening">${t('badge_listening')}</span></h1>
  <p>${t('hi_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span></div>
  <div class="audio-widget">
    <button class="audio-btn" id="play-btn" onclick="HI_play()" aria-label="${t('btn_play_audio')}">▶</button>
    <div class="audio-progress"><div class="audio-label">${q.title}</div><div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div></div>
  </div>
  <div class="q-instruction">${t('hi_instruction_pre')} ${q.incorrectIndices.length} ${t('hi_instruction_suf')}</div>
  <div class="highlightable q-text" id="hi-text">${wordSpans}</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="HI_submit()">${t('btn_check')}</button>
    <button class="btn btn-secondary" onclick="HI_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-highlight-incorrect') || `<button class="btn btn-secondary" onclick="HI_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="HI_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-highlight-incorrect', qIndex, question: q, detailPage: 'highlight-incorrect' });
    bindMockDraftPersistence({ pageKey: 'practice-highlight-incorrect', question: q, questionType: 'highlightIncorrect', title: t('hi_title'), section: 'listening', sectionLabel: 'Listening', promptText: q.transcript });
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });
  }
  const selected=new Set();
  window.HI_toggle=function(i){const sp=document.querySelector(`#hi-text span[data-idx="${i}"]`);if(selected.has(i)){selected.delete(i);sp.style.background='';}else{selected.add(i);sp.style.background='#fde68a';}};
  window.HI_play=function(){const btn=$('#play-btn');const q=questions[qIndex];const fill=$('#ap-fill'); if(!player){ player=createAudioPlayer({ source:getQuestionAudioSource(q), fallbackText:q.transcript, onProgress:(pct)=>{fill.style.width=`${pct*100}%`;}, onEnd:()=>{player=null; fill.style.width='100%'; updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }) });}, onStateChange:(state)=>{ updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.transcript }), state }); } }); if(!player.play()) return; return; } player.toggle();};
  window.HI_submit=function(){
    const q=questions[qIndex]; let correct=0; let wrong=0;
    q.incorrectIndices.forEach(idx=>{
      const sp=document.querySelector(`#hi-text span[data-idx="${idx}"]`);
      if(selected.has(idx)){correct++;sp.classList.add('highlighted-found');}
      else{sp.classList.add('highlighted-wrong');}
    });
    selected.forEach(idx=>{if(!q.incorrectIndices.includes(idx)){wrong++;const sp=document.querySelector(`#hi-text span[data-idx="${idx}"]`);if(sp)sp.style.background='#fee2e2';}});
    const score=Math.max(0,correct-wrong);
    const _hi_total=q.incorrectIndices.length;
    Stats.record('highlightIncorrect',Math.round(score/_hi_total*100),100);
    $('#feedback-area').innerHTML=`<div class="score-panel" style="margin-top:16px"><div class="score-big">${score}/${_hi_total}</div><div class="score-label">${t('score_correct_picks')}</div></div>${window.AIScorer ? AIScorer.renderTaskFeedbackChips('highlightIncorrect', {extra:{correct,total:_hi_total,wrong}}) : ''}<div class="retry-row"><button class="btn btn-refresh" onclick="HI_retry()">${t('btn_retry')}</button></div>`;
  };
  window.HI_retry=()=>{ render(); };
  window.HI_prev=()=>{qIndex=Math.max(0,qIndex-1); render();};
  window.HI_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1); render();};
  render();
};

// ── Write From Dictation ──────────────────────────────────────────────────
Pages['write-dictation'] = function() {
  let qIndex=0;
  const sourceQuestions=getQuestionSet(DB.writeDictation, 'writeFromDictation', item => ({
    id: item.id,
    tag: `${t('prediction_badge')} · ${item.monthTag}`,
    sentence: item.content,
    audio: item.audio || item.audioUrl || '',
    isPrediction: true,
  }));
  const mockQuestions = getMockQuestionSet('writeDictation', sourceQuestions);
  const totalQuestions=mockQuestions.length;
  const questions=getTodayPlanQuestions('practice-write-dictation', getAccessibleQuestions(mockQuestions));
  qIndex = getInitialQuestionIndex(questions);
  let player=null;

  function stopPlayback() {
    if (player) {
      player.stop();
      player = null;
    }
  }

  function render(){
    stopPlayback();
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>${t('wfd_title')} <span class="badge badge-listening">${t('badge_listening')}</span></h1>
  <p>${t('wfd_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span></div>
  <div class="audio-widget">
    <button class="audio-btn" id="play-btn" onclick="WFD_play()" aria-label="${t('btn_play_audio')}">▶</button>
    <div class="audio-progress"><div class="audio-label">${t('wfd_audio_label')}</div><div class="audio-progress-bar"><div class="audio-progress-fill" id="ap-fill" style="width:0%"></div></div></div>
  </div>
  <div class="q-instruction">${t('wfd_instruction')}</div>
  <textarea class="textarea" id="answer" rows="3" placeholder="${t('wfd_placeholder')}"></textarea>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="WFD_submit()">${t('btn_check_answer')}</button>
    <button class="btn btn-secondary" onclick="WFD_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-write-dictation') || `<button class="btn btn-secondary" onclick="WFD_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="WFD_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-write-dictation', qIndex, question: q, detailPage: 'write-dictation' });
    bindMockDraftPersistence({ pageKey: 'practice-write-dictation', question: q, questionType: 'writeDictation', title: t('wfd_title'), section: 'listening', sectionLabel: 'Listening', promptText: q.sentence });
    updateAudioButton($('#play-btn'), { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.sentence }) });
  }
  window.WFD_play=function(){const btn=$('#play-btn');const q=questions[qIndex];const fill=$('#ap-fill'); if(!player){ player=createAudioPlayer({ source:getQuestionAudioSource(q), fallbackText:q.sentence, onProgress:(pct)=>{fill.style.width=`${pct*100}%`;}, onEnd:()=>{player=null; fill.style.width='100%'; updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.sentence }) });}, onStateChange:(state)=>{ updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(q), fallbackText: q.sentence }), state }); } }); if(!player.play()) return; return; } player.toggle();};
  window.WFD_submit=async function(){
    const q=questions[qIndex]; const text=$('#answer').value;
    if (!AppAuth.isLoggedIn()) {
      AuthUI.open('login');
      $('#feedback-area').innerHTML = AIScorer.renderAuthGate();
      return;
    }
    const result = Scorer.writeDictation(text, q.sentence);
    Stats.record('writeDictation', result.pte || 0, 90, { transcript: text || '', ai_feedback: result.label || '' });
    const diff=Scorer.diffWords(text,q.sentence);
    $('#feedback-area').innerHTML=`
${Scorer.renderLocalStructuredResult({ questionType: 'writeDictation', title: t('wfd_title'), result: {
  pte: result.pte,
  label: result.label,
  totalRaw: result.correct,
  totalMax: result.total,
  rubric: [
    { name: 'Content', raw: result.correct, max: result.total, desc: `${result.correct}/${result.total} words correct` },
  ],
}, retryAction: 'WFD_retry()', nextAction: qIndex < questions.length-1 ? 'WFD_next()' : getTodayPlanNextAction('practice-write-dictation') })}
<div class="card" style="margin-top:12px">
  <div class="card-title">${t('wfd_comparison')}</div>
  <div style="margin-bottom:6px"><strong>${t('wfd_correct_sentence')}</strong></div>
  <div class="transcript-box">${diff.map(w=>`<span class="${w.found?'word-correct':'word-wrong'}">${w.word}</span>`).join(' ')}</div>
  <div style="margin-top:8px;font-size:12px;color:var(--text-light)">${t('wfd_legend')}</div>
</div>
<div class="retry-row"><button class="btn btn-refresh" onclick="WFD_retry()">${t('btn_retry')}</button></div>`;
  };
  window.WFD_retry=()=>{ render(); };
  window.WFD_prev=()=>{qIndex=Math.max(0,qIndex-1); render();};
  window.WFD_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1); render();};
  render();
};
