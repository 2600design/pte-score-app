// ── R&W Fill in Blanks ─────────────────────────────────────────────────────
Pages['rw-fill-blanks'] = function() {
  let qIndex=0;
  const totalQuestions=DB.rwFillBlanks.length;
  const questions=getAccessibleQuestions(DB.rwFillBlanks);
  qIndex = getInitialQuestionIndex(questions);

  function render(){
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'rwFillBlanks', questionText: q.parts.join(' ___ ') });
    let html=`
<div class="page-header">
  <h1>R&W Fill in the Blanks <span class="badge badge-reading">Reading</span></h1>
  <p>Select the best word from each dropdown to complete the text.</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">Question ${qIndex+1} / ${questions.length}</span></div>
  <div class="q-instruction">📌 Choose the most appropriate word for each blank.</div>
  <div class="q-text" style="line-height:2.2" id="q-body">`;
    let bIdx=0;
    q.parts.forEach((part,i)=>{
      html+=part;
      if(bIdx<q.blanks.length){
        const b=q.blanks[bIdx];
        html+=`<select class="blank-select" id="blank-${bIdx}" onchange="RWFIB_update()">
<option value="">-- select --</option>
${b.options.map(o=>`<option value="${o}">${o}</option>`).join('')}
</select>`;
        bIdx++;
      }
    });
    html+=`</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="RWFIB_submit()">Check Answers</button>
    <button class="btn btn-secondary" onclick="RWFIB_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    <button class="btn btn-secondary" onclick="RWFIB_next()" ${qIndex===questions.length-1?'disabled':''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    $('#page-container').innerHTML=html;
  }

  window.RWFIB_update=function(){};
  window.RWFIB_submit=function(){
    const q=questions[qIndex]; let correct=0;
    q.blanks.forEach((b,i)=>{
      const sel=$('#blank-'+i); const val=sel.value;
      if(val===b.answer){ correct++; sel.style.background='#dcfce7'; sel.style.color='#15803d'; sel.style.borderColor='#22c55e'; }
      else { sel.style.background='#fee2e2'; sel.style.color='var(--danger)'; sel.style.borderColor='var(--danger)';
        const sp=document.createElement('span'); sp.style='font-size:12px;color:var(--success);margin-left:4px'; sp.textContent='→'+b.answer;
        sel.after(sp); }
    });
    const pct=Math.round(correct/q.blanks.length*100);
    Stats.record('rwFillBlanks',pct,100);
    $('#feedback-area').innerHTML=`<div class="score-panel" style="margin-top:16px"><div class="score-big">${correct}/${q.blanks.length}</div><div class="score-label">${pct}% ${t('score_correct')}</div></div>${window.AIScorer ? AIScorer.renderTaskFeedbackChips('rwFillBlanks', {extra:{correct,total:q.blanks.length}}) : ''}<div class="retry-row"><button class="btn btn-refresh" onclick="RWFIB_retry()">${t('btn_retry')}</button></div>`;
  };
  window.RWFIB_retry=()=>{ render(); };
  window.RWFIB_prev=()=>{qIndex=Math.max(0,qIndex-1);render();};
  window.RWFIB_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1);render();};
  render();
};

// ── MC Single Answer (Reading) ─────────────────────────────────────────────
Pages['mc-single-reading'] = function() {
  let qIndex=0; const totalQuestions=DB.mcSingleReading.length; const questions=getAccessibleQuestions(DB.mcSingleReading);
  qIndex = getInitialQuestionIndex(questions);

  function render(){
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'mcSingleReading', questionText: `${q.passage} ${q.question}` });
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>MC Single Answer <span class="badge badge-reading">Reading</span></h1>
  <p>Read the passage and choose the best answer.</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">Question ${qIndex+1} / ${questions.length}</span></div>
  <div class="q-text">${q.passage}</div>
  <div class="q-title">${q.question}</div>
  <div class="choice-list" id="choices">
    ${q.options.map((o,i)=>`<label class="choice" id="c${i}"><input type="radio" name="mc" value="${i}" onchange="MCSR_check(${i})"> ${o}</label>`).join('')}
  </div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-secondary" onclick="MCSR_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    <button class="btn btn-primary" onclick="MCSR_next()" ${qIndex===questions.length-1?'disabled':''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
  }

  window.MCSR_check=function(i){
    const q=questions[qIndex]; const correct=q.answer;
    $$('.choice').forEach(c=>c.classList.remove('selected','correct','incorrect'));
    if(i===correct){ $('#c'+i).classList.add('correct'); Stats.record('mcSingleReading',100,100);
      $('#feedback-area').innerHTML=`${window.AIScorer ? AIScorer.renderTaskFeedbackChips('mcSingleReading', {extra:{isCorrect:true}}) : ''}<div style="color:var(--success);font-weight:600">${t('answer_correct')}</div><div class="retry-row"><button class="btn btn-refresh" onclick="MCSR_retry()">${t('btn_retry')}</button></div>`; }
    else { $('#c'+i).classList.add('incorrect'); $('#c'+correct).classList.add('correct'); Stats.record('mcSingleReading',0,100);
      $('#feedback-area').innerHTML=`${window.AIScorer ? AIScorer.renderTaskFeedbackChips('mcSingleReading', {extra:{isCorrect:false}}) : ''}<div style="color:var(--danger);font-weight:600">${t('answer_incorrect_highlighted')}</div><div class="retry-row"><button class="btn btn-refresh" onclick="MCSR_retry()">${t('btn_retry')}</button></div>`; }
  };
  window.MCSR_retry=()=>{ render(); };
  window.MCSR_prev=()=>{qIndex=Math.max(0,qIndex-1);render();};
  window.MCSR_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1);render();};
  render();
};

// ── MC Multiple Answer (Reading) ──────────────────────────────────────────
Pages['mc-multiple-reading'] = function() {
  let qIndex=0; const totalQuestions=DB.mcMultipleReading.length; const questions=getAccessibleQuestions(DB.mcMultipleReading);
  qIndex = getInitialQuestionIndex(questions);

  function render(){
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'mcMultipleReading', questionText: `${q.passage} ${q.question}` });
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>MC Multiple Answer <span class="badge badge-reading">Reading</span></h1>
  <p>Select ALL correct answers (there may be more than one).</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">Question ${qIndex+1} / ${questions.length}</span></div>
  <div class="q-text">${q.passage}</div>
  <div class="q-title">${q.question}</div>
  <div class="choice-list" id="choices">
    ${q.options.map((o,i)=>`<label class="choice" id="cm${i}"><input type="checkbox" value="${i}" onchange="MCMR_toggle(${i})"> ${o}</label>`).join('')}
  </div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="MCMR_submit()">Check Answers</button>
    <button class="btn btn-secondary" onclick="MCMR_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    <button class="btn btn-secondary" onclick="MCMR_next()" ${qIndex===questions.length-1?'disabled':''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
  }

  window.MCMR_toggle=function(i){ $('#cm'+i).classList.toggle('selected'); };
  window.MCMR_submit=function(){
    const q=questions[qIndex];
    const selected=$$('.choice input:checked').map(el=>+el.value);
    const correct=q.answers;
    let pts=0;
    q.options.forEach((_,i)=>{
      const sel=selected.includes(i), ans=correct.includes(i);
      if(sel&&ans){$('#cm'+i).classList.add('correct');pts++;}
      else if(sel&&!ans){$('#cm'+i).classList.add('incorrect');pts--;}
      else if(!sel&&ans){$('#cm'+i).style.border='2px dashed var(--success)';}
    });
    pts=Math.max(0,pts);
    const pct=Math.round(pts/correct.length*100);
    Stats.record('mcMultipleReading',pct,100);
    const _mcmr_missed=correct.filter(i=>!selected.includes(i)).length;
    const _mcmr_wrong=selected.filter(i=>!correct.includes(i)).length;
    $('#feedback-area').innerHTML=`<div class="score-panel" style="margin-top:16px"><div class="score-big">${pts}/${correct.length}</div><div class="score-label">${t('score_correct')}</div></div>${window.AIScorer ? AIScorer.renderTaskFeedbackChips('mcMultipleReading', {extra:{pts,total:correct.length,missed:_mcmr_missed,wrong:_mcmr_wrong}}) : ''}<div class="retry-row"><button class="btn btn-refresh" onclick="MCMR_retry()">${t('btn_retry')}</button></div>`;
  };
  window.MCMR_retry=()=>{ render(); };
  window.MCMR_prev=()=>{qIndex=Math.max(0,qIndex-1);render();};
  window.MCMR_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1);render();};
  render();
};

// ── Re-order Paragraphs ────────────────────────────────────────────────────
Pages['reorder-paragraphs'] = function() {
  let qIndex=0; const totalQuestions=DB.reorderParagraphs.length; const questions=getAccessibleQuestions(DB.reorderParagraphs);
  qIndex = getInitialQuestionIndex(questions);
  let dragged=null;

  function render(){
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'reorderParagraphs', questionText: q.sentences.map(s => s.text).join(' ') });
    const shuffled=shuffle([...q.sentences]);
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>Re-order Paragraphs <span class="badge badge-reading">Reading</span></h1>
  <p>Drag sentences from the left box into the correct order on the right.</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">Question ${qIndex+1} / ${questions.length}</span></div>
  <div class="q-instruction">📌 Drag all sentences to the right panel in the correct logical order.</div>
  <div class="reorder-area">
    <div class="reorder-col">
      <div class="reorder-col-title">Source</div>
      <div id="source-box" class="reorder-drop-zone"
        ondragover="event.preventDefault();this.classList.add('over')"
        ondragleave="this.classList.remove('over')"
        ondrop="ROP_drop(event,'source')">
        ${shuffled.map(s=>`<div class="reorder-item" draggable="true" data-id="${s.id}" ondragstart="ROP_drag(event)">${s.text}</div>`).join('')}
      </div>
    </div>
    <div class="reorder-col">
      <div class="reorder-col-title">Your Answer</div>
      <div id="answer-box" class="reorder-drop-zone"
        ondragover="event.preventDefault();this.classList.add('over')"
        ondragleave="this.classList.remove('over')"
        ondrop="ROP_drop(event,'answer')">
        <div style="color:var(--text-light);font-size:13px;padding:8px">Drop sentences here in order...</div>
      </div>
    </div>
  </div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="ROP_submit()">Check Order</button>
    <button class="btn btn-secondary" onclick="ROP_reset()">Reset</button>
    <button class="btn btn-secondary" onclick="ROP_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    <button class="btn btn-secondary" onclick="ROP_next()" ${qIndex===questions.length-1?'disabled':''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
  }

  window.ROP_drag=function(e){ dragged=e.target; e.target.classList.add('dragging'); };
  window.ROP_drop=function(e,box){
    e.preventDefault(); e.currentTarget.classList.remove('over');
    if(!dragged) return;
    // Remove placeholder
    const ph=e.currentTarget.querySelector('div[style*="color"]');
    if(ph) ph.remove();
    dragged.classList.remove('dragging');
    e.currentTarget.appendChild(dragged);
    dragged=null;
  };
  window.ROP_reset=function(){ render(); };
  window.ROP_submit=function(){
    const q=questions[qIndex];
    const items=$$('#answer-box .reorder-item');
    const order=items.map(el=>el.dataset.id);
    let correct=0;
    for(let i=0;i<order.length-1;i++){
      const currentIndex=q.correctOrder.indexOf(order[i]);
      const expectedNext=q.correctOrder[currentIndex+1];
      if(expectedNext && order[i+1]===expectedNext) correct++;
    }
    const maxPairs=Math.max(q.correctOrder.length-1,1);
    const pct=Math.round(correct/maxPairs*100);
    Stats.record('reorderParagraphs',pct,100);
    items.forEach((el,i)=>{
      el.style.borderColor = el.dataset.id===q.correctOrder[i] ? 'var(--success)' : 'var(--danger)';
    });
    if(order.length<q.correctOrder.length){
      $('#feedback-area').innerHTML=`<div style="color:var(--warning);margin-top:8px">⚠️ Move all sentences to the answer box first.</div>`;
      return;
    }
    const _rop_first=order.length>0&&order[0]===q.correctOrder[0];
    $('#feedback-area').innerHTML=`<div class="score-panel" style="margin-top:16px"><div class="score-big">${correct}/${maxPairs}</div><div class="score-label">${t('score_correct')} — ${Scorer.gradeLabel(pct)}</div></div>${window.AIScorer ? AIScorer.renderTaskFeedbackChips('reorderParagraphs', {extra:{correct,maxPairs,firstCorrect:_rop_first}}) : ''}<div class="retry-row"><button class="btn btn-refresh" onclick="ROP_retry()">${t('btn_retry')}</button></div>`;
  };
  window.ROP_retry=()=>{ render(); };
  window.ROP_prev=()=>{qIndex=Math.max(0,qIndex-1);render();};
  window.ROP_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1);render();};
  render();
};

// ── Reading Fill Blanks ────────────────────────────────────────────────────
Pages['r-fill-blanks'] = function() {
  let qIndex=0; const totalQuestions=DB.rFillBlanks.length; const questions=getAccessibleQuestions(DB.rFillBlanks);
  qIndex = getInitialQuestionIndex(questions);

  function render(){
    const q=questions[qIndex];
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'rFillBlanks', questionText: q.fullText });
    let text=q.fullText;
    q.blanks.forEach(b=>{ text=text.replace(b.word,`<input class="blank-input" data-word="${b.word}" placeholder="${b.hint.split(',')[0]}..." style="min-width:${b.word.length*10}px">`); });
    $('#page-container').innerHTML=`
<div class="page-header">
  <h1>Reading Fill in the Blanks <span class="badge badge-reading">Reading</span></h1>
  <p>Click each blank and type the missing word from context.</p>
</div>
<div class="card">
  <div class="question-nav"><span class="q-number">Question ${qIndex+1} / ${questions.length}</span></div>
  <div class="q-instruction">📌 Type the word that best fits each blank. Words are removed from the original passage.</div>
  <div class="q-text" style="line-height:2.4">${text}</div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="RFIB_submit()">Check Answers</button>
    <button class="btn btn-secondary" onclick="RFIB_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    <button class="btn btn-secondary" onclick="RFIB_next()" ${qIndex===questions.length-1?'disabled':''}>${t('btn_next')}</button>
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
  }

  window.RFIB_submit=function(){
    const q=questions[qIndex];
    const inputs=$$('.blank-input'); let correct=0;
    inputs.forEach(inp=>{
      const val=inp.value.trim().toLowerCase(); const ans=inp.dataset.word.toLowerCase();
      if(val===ans){ correct++; inp.style.background='#dcfce7'; inp.style.color='#15803d'; inp.style.borderBottomColor='#22c55e'; }
      else { inp.style.background='#fee2e2'; inp.style.color='var(--danger)'; inp.style.borderBottomColor='var(--danger)';
        const sp=document.createElement('span'); sp.style='font-size:12px;color:var(--success);margin-left:2px'; sp.textContent='('+inp.dataset.word+')';
        inp.after(sp); }
    });
    const pct=Math.round(correct/q.blanks.length*100);
    Stats.record('rFillBlanks',pct,100);
    $('#feedback-area').innerHTML=`<div class="score-panel" style="margin-top:16px"><div class="score-big">${correct}/${q.blanks.length}</div><div class="score-label">${pct}% ${t('score_correct')}</div></div>${window.AIScorer ? AIScorer.renderTaskFeedbackChips('rFillBlanks', {extra:{correct,total:q.blanks.length}}) : ''}<div class="retry-row"><button class="btn btn-refresh" onclick="RFIB_retry()">${t('btn_retry')}</button></div>`;
  };
  window.RFIB_retry=()=>{ render(); };
  window.RFIB_prev=()=>{qIndex=Math.max(0,qIndex-1);render();};
  window.RFIB_next=()=>{qIndex=Math.min(questions.length-1,qIndex+1);render();};
  render();
};
