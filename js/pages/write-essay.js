Pages['write-essay'] = function() {
  let qIndex=0, timerObj=null;
  const totalQuestions=DB.writeEssay.length;
  const questions=getAccessibleQuestions(DB.writeEssay);
  qIndex = getInitialQuestionIndex(questions);
  const pageStatePage = 'write-essay';

  function getQuestionStateKey(question) {
    return `writeEssay:${question?.id || qIndex}`;
  }

  function restoreSavedUi(question) {
    const saved = window.getPageUiState?.(pageStatePage, getQuestionStateKey(question));
    if (!saved) return false;
    if ($('#answer')) $('#answer').value = saved.answer || '';
    if ($('#wc-label')) $('#wc-label').textContent = saved.wordCountLabel || $('#wc-label').textContent;
    if ($('#feedback-area')) $('#feedback-area').innerHTML = saved.feedbackHtml || '';
    return true;
  }

  function persistUi(question, extra = {}) {
    if (!question) return;
    window.savePageUiState?.(pageStatePage, getQuestionStateKey(question), {
      answer: $('#answer')?.value || '',
      wordCountLabel: $('#wc-label')?.textContent || '',
      feedbackHtml: $('#feedback-area')?.innerHTML || '',
      ...extra,
    });
  }

  function clearSavedUi(question) {
    if (!question) return;
    window.clearPageUiState?.(pageStatePage, getQuestionStateKey(question));
  }

  function render(){
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'writeEssay', questionText: q.prompt });
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>${t('we_title')} <span class="badge badge-writing">${t('badge_writing')}</span></h1>
  <p>${t('we_subtitle').replace('${min}', q.wordRange[0]).replace('${max}', q.wordRange[1])}</p>
</div>
<div class="card">
  <div class="question-nav">
    <span class="q-number">${t('we_prompt_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span>
    <div id="timer-el" class="timer"><span class="timer-dot"></span>20:00</div>
  </div>
  <div class="q-instruction">${t('we_instruction').replace('${min}', q.wordRange[0]).replace('${max}', q.wordRange[1])}</div>
  <div class="q-text" style="font-weight:500">${q.prompt}</div>
  <div style="background:var(--surface);border:1px solid var(--primary);border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:var(--primary)">
    ${t('we_tip')}
  </div>
  <textarea class="textarea" id="answer" rows="14" placeholder="${t('we_placeholder')}" oninput="WE_update()"></textarea>
  <div class="word-count" id="wc-label">0 / ${q.wordRange[1]} ${t('words')}</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="WE_submit()">${t('btn_submit_essay')}</button>
    <button class="btn btn-secondary" onclick="WE_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    <button class="btn btn-secondary" onclick="WE_next()" ${qIndex===questions.length-1?'disabled':''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    timerObj=new CountdownTimer($('#timer-el'),1200,null,()=>WE_submit(true)); timerObj.start();
    if (!restoreSavedUi(q)) WE_update();
  }

  window.WE_update=function(){
    const q=questions[qIndex]; const wc=countWords($('#answer').value);
    const el=$('#wc-label'); el.textContent=`${wc} / ${q.wordRange[1]} ${t('words')}`;
    el.className='word-count'+(wc>=q.wordRange[0]&&wc<=q.wordRange[1]?' ok':wc>q.wordRange[1]?' warn':'');
    persistUi(q);
  };

  window.WE_submit=async function(auto=false){
    timerObj&&timerObj.stop();
    const q=questions[qIndex]; const text=$('#answer').value;
    if (!AppAuth.isLoggedIn()) {
      AuthUI.open('login');
      $('#feedback-area').innerHTML = AIScorer.renderAuthGate();
      persistUi(q);
      return;
    }
    const result = Scorer.writeEssay(text, q.prompt, q.wordRange);
    Stats.record('writeEssay', result.pte || 0, 90, { transcript: text || '', ai_feedback: result.label || '' });
    const sentences=text.split(/[.!?]+/).filter(s=>s.trim()).length;
    const paragraphs=text.split(/\n\n+/).filter(p=>p.trim()).length;
    const wc = countWords(text);
    $('#feedback-area').innerHTML=`
${Scorer.renderLocalStructuredResult({ questionType: 'writeEssay', title: t('we_title'), result, retryAction: 'WE_retry()', nextAction: qIndex < questions.length-1 ? 'WE_next()' : '' })}
<div class="card" style="margin-top:12px">
  <div style="display:flex;gap:20px;flex-wrap:wrap;font-size:13px">
    <span>Words: <strong>${wc}</strong></span>
    <span>Sentences: <strong>${sentences}</strong></span>
    <span>Paragraphs: <strong>${paragraphs}</strong></span>
    ${(wc < q.wordRange[0] || wc > q.wordRange[1]) ? `<span style="color:var(--warning)">Aim for ${q.wordRange[0]}–${q.wordRange[1]} words</span>` : ''}
    ${auto?'<span style="color:var(--warning)">Auto-submitted</span>':''}
  </div>
</div>
<div class="retry-row"><button class="btn btn-refresh" onclick="WE_retry()">${t('btn_retry')}</button></div>`;
    persistUi(q);
  };

  window.WE_retry=()=>{clearSavedUi(questions[qIndex]);timerObj&&timerObj.stop(); render();};
  window.WE_prev=()=>{clearSavedUi(questions[qIndex]);qIndex=Math.max(0,qIndex-1);timerObj&&timerObj.stop();render();};
  window.WE_next=()=>{clearSavedUi(questions[qIndex]);qIndex=Math.min(questions.length-1,qIndex+1);timerObj&&timerObj.stop();render();};
  render();
};
