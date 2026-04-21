// ── R&W Fill in Blanks ─────────────────────────────────────────────────────
Pages['rw-fill-blanks'] = function() {
  let qIndex=0;
  const sourceQuestions = getMockQuestionSet('rwFillBlanks', DB.rwFillBlanks);
  const totalQuestions=sourceQuestions.length;
  const questions=getTodayPlanQuestions('practice-rw-fill-blanks', getAccessibleQuestions(sourceQuestions));
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
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-rw-fill-blanks') || `<button class="btn btn-secondary" onclick="RWFIB_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="RWFIB_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    $('#page-container').innerHTML=html;
    mountMockProgressHeader({ pageKey: 'practice-rw-fill-blanks', qIndex, question: q, detailPage: 'rw-fill-blanks' });
    bindMockDraftPersistence({ pageKey: 'practice-rw-fill-blanks', question: q, questionType: 'rwFillBlanks', title: 'Reading & Writing Fill in the Blanks', section: 'reading', sectionLabel: 'Reading', promptText: q.parts.join(' ') });
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
  let qIndex=0; const sourceQuestions=getMockQuestionSet('mcSingleReading', DB.mcSingleReading); const totalQuestions=sourceQuestions.length; const questions=getTodayPlanQuestions('practice-mc-single-reading', getAccessibleQuestions(sourceQuestions));
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
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-mc-single-reading') || `<button class="btn btn-primary" onclick="MCSR_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-primary" onclick="MCSR_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-mc-single-reading', qIndex, question: q, detailPage: 'mc-single-reading' });
    bindMockDraftPersistence({ pageKey: 'practice-mc-single-reading', question: q, questionType: 'mcSingleReading', title: 'Multiple Choice Single Answer', section: 'reading', sectionLabel: 'Reading', promptText: `${q.passage} ${q.question}` });
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
  let qIndex=0; const sourceQuestions=getMockQuestionSet('mcMultipleReading', DB.mcMultipleReading); const totalQuestions=sourceQuestions.length; const questions=getTodayPlanQuestions('practice-mc-multiple-reading', getAccessibleQuestions(sourceQuestions));
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
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-mc-multiple-reading') || `<button class="btn btn-secondary" onclick="MCMR_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="MCMR_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-mc-multiple-reading', qIndex, question: q, detailPage: 'mc-multiple-reading' });
    bindMockDraftPersistence({ pageKey: 'practice-mc-multiple-reading', question: q, questionType: 'mcMultipleReading', title: 'Multiple Choice Multiple Answers', section: 'reading', sectionLabel: 'Reading', promptText: `${q.passage} ${q.question}` });
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
  let qIndex=0; const sourceQuestions=getMockQuestionSet('reorderParagraphs', DB.reorderParagraphs); const totalQuestions=sourceQuestions.length; const questions=getTodayPlanQuestions('practice-reorder-paragraphs', getAccessibleQuestions(sourceQuestions));
  qIndex = getInitialQuestionIndex(questions);
  let sourceOrder = [];
  let answerOrder = [];
  let dragState = null;
  let sortableInstances = [];

  function getCurrentQuestion() {
    return questions[qIndex];
  }

  function getSentenceMap(q) {
    return new Map(q.sentences.map(sentence => [String(sentence.id), sentence]));
  }

  function isTouchReorderMode() {
    if (!!window.Capacitor) return true;
    if (window.matchMedia?.('(pointer: coarse)').matches) return true;
    return (navigator.maxTouchPoints || 0) > 0;
  }

  function teardownReorderInteractions() {
    sortableInstances.forEach(instance => {
      try { instance.destroy(); } catch (_error) {}
    });
    sortableInstances = [];
    if (dragState?.cleanup) dragState.cleanup();
    dragState = null;
  }

  function resetQuestionState() {
    teardownReorderInteractions();
    const q = getCurrentQuestion();
    const shuffled = shuffle([...q.sentences]);
    sourceOrder = shuffled.map(item => String(item.id));
    answerOrder = [];
  }

  function renderZoneItems(ids, sentenceMap, emptyCopy) {
    if (!ids.length) {
      return `<div class="reorder-empty" data-empty="true">${emptyCopy}</div>`;
    }
    return ids.map(id => {
      const sentence = sentenceMap.get(String(id));
      if (!sentence) return '';
      return `<div class="reorder-item" data-id="${Scorer.escapeHtml(String(sentence.id))}" tabindex="0">${Scorer.escapeHtml(sentence.text)}</div>`;
    }).join('');
  }

  function getZone(box) {
    return box === 'answer' ? $('#answer-box') : $('#source-box');
  }

  function clearReorderFeedback() {
    const feedback = $('#feedback-area');
    if (feedback) feedback.innerHTML = '';
  }

  function syncOrderFromDom() {
    const sourceBox = $('#source-box');
    const answerBox = $('#answer-box');
    if (!sourceBox || !answerBox) return;
    sourceOrder = $$('#source-box .reorder-item').map(item => String(item.dataset.id));
    answerOrder = $$('#answer-box .reorder-item').map(item => String(item.dataset.id));
  }

  function ensureEmptyState() {
    ['source', 'answer'].forEach(box => {
      const zone = getZone(box);
      if (!zone) return;
      const existingEmpty = zone.querySelector('.reorder-empty');
      const hasItems = zone.querySelector('.reorder-item');
      const copy = box === 'answer'
        ? 'Drop sentences here in order...'
        : 'Drag or tap items back here.';
      if (!hasItems && !existingEmpty) {
        zone.insertAdjacentHTML('beforeend', `<div class="reorder-empty" data-empty="true">${copy}</div>`);
      }
      if (hasItems && existingEmpty) existingEmpty.remove();
    });
  }

  function refreshZonesFromState() {
    const q = getCurrentQuestion();
    const sentenceMap = getSentenceMap(q);
    const sourceBox = $('#source-box');
    const answerBox = $('#answer-box');
    if (!sourceBox || !answerBox) return;
    sourceBox.innerHTML = renderZoneItems(sourceOrder, sentenceMap, 'Drag or tap items back here.');
    answerBox.innerHTML = renderZoneItems(answerOrder, sentenceMap, 'Drop sentences here in order...');
    clearReorderFeedback();
  }

  function moveItemBetweenZones(itemId, targetBox, insertIndex = null) {
    const id = String(itemId);
    sourceOrder = sourceOrder.filter(value => value !== id);
    answerOrder = answerOrder.filter(value => value !== id);
    const nextList = targetBox === 'answer' ? answerOrder : sourceOrder;
    const index = typeof insertIndex === 'number' ? Math.max(0, Math.min(insertIndex, nextList.length)) : nextList.length;
    nextList.splice(index, 0, id);
    refreshZonesFromState();
    setupReorderInteractions();
  }

  function getDropReference(zone, clientY, excludeEl = null) {
    const items = [...zone.querySelectorAll('.reorder-item')].filter(item => item !== excludeEl);
    for (const item of items) {
      const rect = item.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return item;
    }
    return null;
  }

  function setupDesktopHtmlDrag() {
    const sourceBox = $('#source-box');
    const answerBox = $('#answer-box');
    if (!sourceBox || !answerBox) return;
    let dragged = null;

    const clearOverStates = () => {
      [sourceBox, answerBox].forEach(zone => zone.classList.remove('over'));
    };

    $$('.reorder-item').forEach(item => {
      item.setAttribute('draggable', 'true');
      item.addEventListener('dragstart', event => {
        dragged = item;
        item.classList.add('dragging');
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('text/plain', item.dataset.id || '');
        }
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        dragged = null;
        clearOverStates();
        syncOrderFromDom();
        ensureEmptyState();
      });
      item.addEventListener('click', () => {
        const currentBox = item.closest('#answer-box') ? 'answer' : 'source';
        moveItemBetweenZones(item.dataset.id, currentBox === 'answer' ? 'source' : 'answer');
      });
    });

    [sourceBox, answerBox].forEach(zone => {
      zone.addEventListener('dragover', event => {
        event.preventDefault();
        zone.classList.add('over');
        if (!dragged) return;
        const reference = getDropReference(zone, event.clientY, dragged);
        const empty = zone.querySelector('.reorder-empty');
        if (empty) empty.remove();
        if (reference) zone.insertBefore(dragged, reference);
        else zone.appendChild(dragged);
      });
      zone.addEventListener('dragleave', event => {
        if (!zone.contains(event.relatedTarget)) zone.classList.remove('over');
      });
      zone.addEventListener('drop', event => {
        event.preventDefault();
        zone.classList.remove('over');
        if (!dragged) return;
        const reference = getDropReference(zone, event.clientY, dragged);
        if (reference) zone.insertBefore(dragged, reference);
        else zone.appendChild(dragged);
        dragged.classList.remove('dragging');
        dragged = null;
        syncOrderFromDom();
        ensureEmptyState();
      });
    });
  }

  function setupSortableTouch() {
    if (typeof window.Sortable !== 'function') return false;
    const sortableConfig = {
      group: 'reorder',
      animation: 150,
      forceFallback: true,
      fallbackOnBody: true,
      fallbackTolerance: 3,
      emptyInsertThreshold: 10,
      onStart: () => {
        clearReorderFeedback();
      },
      onEnd: () => {
        syncOrderFromDom();
        ensureEmptyState();
      },
      onAdd: () => {
        syncOrderFromDom();
        ensureEmptyState();
      },
      onUpdate: () => {
        syncOrderFromDom();
        ensureEmptyState();
      },
    };
    const sourceBox = $('#source-box');
    const answerBox = $('#answer-box');
    if (!sourceBox || !answerBox) return false;
    sortableInstances = [
      new window.Sortable(sourceBox, sortableConfig),
      new window.Sortable(answerBox, sortableConfig),
    ];
    $$('.reorder-item').forEach(item => {
      item.addEventListener('click', () => {
        const currentBox = item.closest('#answer-box') ? 'answer' : 'source';
        moveItemBetweenZones(item.dataset.id, currentBox === 'answer' ? 'source' : 'answer');
      });
    });
    ensureEmptyState();
    return true;
  }

  function setupPointerTouchFallback() {
    const sourceBox = $('#source-box');
    const answerBox = $('#answer-box');
    if (!sourceBox || !answerBox) return;

    const zones = [sourceBox, answerBox];
    const clearOverStates = () => zones.forEach(zone => zone.classList.remove('over'));

    $$('.reorder-item').forEach(item => {
      item.addEventListener('click', () => {
        if (dragState?.moved) return;
        const currentBox = item.closest('#answer-box') ? 'answer' : 'source';
        moveItemBetweenZones(item.dataset.id, currentBox === 'answer' ? 'source' : 'answer');
      });

      item.addEventListener('pointerdown', event => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        const pointerId = event.pointerId;
        const startX = event.clientX;
        const startY = event.clientY;
        const originZone = item.closest('.reorder-drop-zone');
        let moved = false;
        let ghost = null;

        const updateGhost = moveEvent => {
          if (!ghost) {
            ghost = item.cloneNode(true);
            ghost.classList.add('reorder-ghost');
            ghost.style.width = `${item.getBoundingClientRect().width}px`;
            document.body.appendChild(ghost);
          }
          ghost.style.left = `${moveEvent.clientX}px`;
          ghost.style.top = `${moveEvent.clientY}px`;
        };

        const moveHandler = moveEvent => {
          if (moveEvent.pointerId !== pointerId) return;
          const deltaX = Math.abs(moveEvent.clientX - startX);
          const deltaY = Math.abs(moveEvent.clientY - startY);
          if (!moved && Math.max(deltaX, deltaY) < 8) return;
          moved = true;
          if (dragState) dragState.moved = true;
          clearReorderFeedback();
          item.classList.add('dragging');
          moveEvent.preventDefault();
          updateGhost(moveEvent);
          const target = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest('.reorder-drop-zone');
          clearOverStates();
          if (!target) return;
          target.classList.add('over');
          const empty = target.querySelector('.reorder-empty');
          if (empty) empty.remove();
          const reference = getDropReference(target, moveEvent.clientY, item);
          if (reference) target.insertBefore(item, reference);
          else target.appendChild(item);
        };

        const endHandler = endEvent => {
          if (endEvent.pointerId !== pointerId) return;
          item.releasePointerCapture?.(pointerId);
          item.classList.remove('dragging');
          clearOverStates();
          window.removeEventListener('pointermove', moveHandler);
          window.removeEventListener('pointerup', endHandler);
          window.removeEventListener('pointercancel', endHandler);
          if (ghost) ghost.remove();
          if (!moved) {
            const currentBox = originZone?.id === 'answer-box' ? 'answer' : 'source';
            moveItemBetweenZones(item.dataset.id, currentBox === 'answer' ? 'source' : 'answer');
            return;
          }
          syncOrderFromDom();
          ensureEmptyState();
        };

        dragState = {
          moved: false,
          cleanup: () => {
            window.removeEventListener('pointermove', moveHandler);
            window.removeEventListener('pointerup', endHandler);
            window.removeEventListener('pointercancel', endHandler);
            if (ghost) ghost.remove();
            clearOverStates();
          },
        };

        item.setPointerCapture?.(pointerId);
        window.addEventListener('pointermove', moveHandler, { passive: false });
        window.addEventListener('pointerup', endHandler);
        window.addEventListener('pointercancel', endHandler);
      });
    });

    ensureEmptyState();
  }

  function setupReorderInteractions() {
    teardownReorderInteractions();
    ensureEmptyState();
    if (isTouchReorderMode()) {
      if (setupSortableTouch()) return;
      setupPointerTouchFallback();
      return;
    }
    setupDesktopHtmlDrag();
  }

  function render(){
    const q=questions[qIndex];
    const sentenceMap = getSentenceMap(q);
    syncSelectedQuestion(q);
    if (window.PracticeTracker) PracticeTracker.setCurrentQuestion({ questionId: q.id, questionType: 'reorderParagraphs', questionText: q.sentences.map(s => s.text).join(' ') });
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
      <div id="source-box" class="reorder-drop-zone" data-box="source">
        ${renderZoneItems(sourceOrder, sentenceMap, 'Drag or tap items back here.')}
      </div>
    </div>
    <div class="reorder-col">
      <div class="reorder-col-title">Your Answer</div>
      <div id="answer-box" class="reorder-drop-zone" data-box="answer">
        ${renderZoneItems(answerOrder, sentenceMap, 'Drop sentences here in order...')}
      </div>
    </div>
  </div>
  <div id="feedback-area"></div>
  <hr class="section-divider">
  <div class="btn-group">
    <button class="btn btn-primary" onclick="ROP_submit()">Check Order</button>
    <button class="btn btn-secondary" onclick="ROP_reset()">Reset</button>
    <button class="btn btn-secondary" onclick="ROP_prev()" ${qIndex===0?'disabled':''}>${t('btn_prev')}</button>
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-reorder-paragraphs') || `<button class="btn btn-secondary" onclick="ROP_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="ROP_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-reorder-paragraphs', qIndex, question: q, detailPage: 'reorder-paragraphs' });
    bindMockDraftPersistence({ pageKey: 'practice-reorder-paragraphs', question: q, questionType: 'reorderParagraphs', title: 'Re-order Paragraphs', section: 'reading', sectionLabel: 'Reading', promptText: q.sentences.map(item => item.text).join(' ') });
    setupReorderInteractions();
  }

  window.ROP_reset=function(){ resetQuestionState(); render(); };
  window.ROP_submit=function(){
    const q=questions[qIndex];
    const correctOrder = q.correctOrder.map(id => String(id));
    syncOrderFromDom();
    const items=$$('#answer-box .reorder-item');
    const order=[...answerOrder];
    let correct=0;
    for(let i=0;i<order.length-1;i++){
      const currentIndex=correctOrder.indexOf(order[i]);
      const expectedNext=correctOrder[currentIndex+1];
      if(expectedNext && order[i+1]===expectedNext) correct++;
    }
    const maxPairs=Math.max(correctOrder.length-1,1);
    const pct=Math.round(correct/maxPairs*100);
    Stats.record('reorderParagraphs',pct,100);
    items.forEach((el,i)=>{
      el.style.borderColor = el.dataset.id===correctOrder[i] ? 'var(--success)' : 'var(--danger)';
    });
    if(order.length<correctOrder.length){
      $('#feedback-area').innerHTML=`<div style="color:var(--warning);margin-top:8px">⚠️ Move all sentences to the answer box first.</div>`;
      return;
    }
    const _rop_first=order.length>0&&order[0]===correctOrder[0];
    $('#feedback-area').innerHTML=`<div class="score-panel" style="margin-top:16px"><div class="score-big">${correct}/${maxPairs}</div><div class="score-label">${t('score_correct')} — ${Scorer.gradeLabel(pct)}</div></div>${window.AIScorer ? AIScorer.renderTaskFeedbackChips('reorderParagraphs', {extra:{correct,maxPairs,firstCorrect:_rop_first}}) : ''}<div class="retry-row"><button class="btn btn-refresh" onclick="ROP_retry()">${t('btn_retry')}</button></div>`;
  };
  window.ROP_retry=()=>{ resetQuestionState(); render(); };
  window.ROP_prev=()=>{ teardownReorderInteractions(); qIndex=Math.max(0,qIndex-1); resetQuestionState(); render();};
  window.ROP_next=()=>{ teardownReorderInteractions(); qIndex=Math.min(questions.length-1,qIndex+1); resetQuestionState(); render();};
  resetQuestionState();
  render();
};

// ── Reading Fill Blanks ────────────────────────────────────────────────────
Pages['r-fill-blanks'] = function() {
  let qIndex=0; const sourceQuestions=getMockQuestionSet('rFillBlanks', DB.rFillBlanks); const totalQuestions=sourceQuestions.length; const questions=getTodayPlanQuestions('practice-r-fill-blanks', getAccessibleQuestions(sourceQuestions));
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
    ${qIndex===questions.length-1 ? renderTodayPlanAction('practice-r-fill-blanks') || `<button class="btn btn-secondary" onclick="RFIB_next()" disabled>${t('btn_next')}</button>` : `<button class="btn btn-secondary" onclick="RFIB_next()">${t('btn_next')}</button>`}
  </div>
  ${renderGuestPracticeUpsell(totalQuestions, questions.length)}
</div>`;
    mountMockProgressHeader({ pageKey: 'practice-r-fill-blanks', qIndex, question: q, detailPage: 'r-fill-blanks' });
    bindMockDraftPersistence({ pageKey: 'practice-r-fill-blanks', question: q, questionType: 'rFillBlanks', title: 'Fill in the Blanks', section: 'reading', sectionLabel: 'Reading', promptText: q.fullText });
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
