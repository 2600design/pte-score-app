Pages['summarize-written'] = function() {
  let qIndex=0, timerObj=null;
  const totalQuestions=DB.summarizeWritten.length;
  const questions=getAccessibleQuestions(DB.summarizeWritten);
  qIndex = getInitialQuestionIndex(questions);

  function render(){
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'summarizeWritten', questionText: q.text });
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>${t('swt_title')} <span class="badge badge-writing">${t('badge_writing')}</span></h1>
  <p>${t('swt_subtitle')}</p>
</div>
<div class="card">
  <div class="question-nav">
    <span class="q-number">${t('question_label')} ${qIndex+1} ${t('question_of')} ${questions.length}</span>
    <div id="timer-el" class="timer"><span class="timer-dot"></span>10:00</div>
  </div>
  <div class="q-instruction">${t('swt_instruction').replace('${min}', q.wordRange[0]).replace('${max}', q.wordRange[1])}</div>
  <div style="font-weight:600;margin-bottom:8px;font-size:14px">${q.title}</div>
  <div class="q-text">${q.text}</div>
  <textarea class="textarea" id="answer" rows="3" placeholder="${t('swt_placeholder')}" oninput="SWT_update()"></textarea>
  <div class="word-count" id="wc-label">0 ${t('words')}</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="SWT_submit()">${t('btn_submit_answer')}</button>
    <button class="btn btn-secondary" onclick="SWT_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    <button class="btn btn-secondary" onclick="SWT_next()" ${qIndex===questions.length-1?'disabled':''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    timerObj=new CountdownTimer($('#timer-el'),600,null,()=>SWT_submit(true)); timerObj.start();
  }

  window.SWT_update=function(){
    const q=questions[qIndex];
    const wc=countWords($('#answer').value);
    const el=$('#wc-label');
    el.textContent=`${wc} ${t('words')}`;
    el.className='word-count'+(wc>=q.wordRange[0]&&wc<=q.wordRange[1]?' ok':wc>q.wordRange[1]?' warn':'');
  };

  window.SWT_submit=async function(auto=false){
    timerObj&&timerObj.stop();
    const q=questions[qIndex];
    const text=$('#answer').value;
    if (!AppAuth.isLoggedIn()) {
      AuthUI.open('login');
      $('#feedback-area').innerHTML = AIScorer.renderAuthGate();
      return;
    }
    const result = Scorer.summarizeWritten(text, q.text, q.wordRange);
    Stats.record('summarizeWritten', result.pte || 0, 90, { transcript: text || '', ai_feedback: result.label || '' });
    const sentences=text.split(/[.!?]+/).filter(s=>s.trim()).length;
    const oneSentence=sentences===1;
    const wc = countWords(text);
    $('#feedback-area').innerHTML=`
${Scorer.renderLocalStructuredResult({ questionType: 'summarizeWritten', title: t('swt_title'), result, retryAction: 'SWT_retry()', nextAction: qIndex < questions.length-1 ? 'SWT_next()' : '' })}
<div class="card" style="margin-top:12px">
  <div style="display:flex;flex-direction:column;gap:8px">
    <div style="display:flex;align-items:center;gap:8px"><span style="font-size:18px">${oneSentence?'✅':'❌'}</span><span>One sentence: ${oneSentence?'Yes':'No — found '+sentences+' sentences'}</span></div>
    <div style="display:flex;align-items:center;gap:8px"><span style="font-size:18px">${(wc>=q.wordRange[0]&&wc<=q.wordRange[1])?'✅':'⚠️'}</span><span>Word count: ${wc} (range: ${q.wordRange[0]}–${q.wordRange[1]})</span></div>
  </div>
  ${auto?'<div style="color:var(--warning);font-size:13px;margin-top:8px">Auto-submitted when time ran out.</div>':''}
</div>
<div class="retry-row"><button class="btn btn-refresh" onclick="SWT_retry()">${t('btn_retry')}</button></div>`;
  };

  window.SWT_retry=()=>{timerObj&&timerObj.stop(); render();};
  window.SWT_prev=()=>{qIndex=Math.max(0,qIndex-1);timerObj&&timerObj.stop();render();};
  window.SWT_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1);timerObj&&timerObj.stop();render();};
  render();
};
