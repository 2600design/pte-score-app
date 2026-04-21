function getMockPlanSummary(type = 'full') {
  const plan = getMockPlan(type);
  const totalQuestions = plan.reduce((sum, step) => sum + (Number(step?.count) || 0), 0);
  return { plan, totalQuestions };
}

Pages['mock-test'] = function() {
  const isMobile = window.innerWidth <= 640;
  const currentLang = getAppLang();
  const fullSummary = getMockPlanSummary('full');
  const speakingSummary = getMockPlanSummary('speaking');
  const writingSummary = getMockPlanSummary('writing');
  const readingSummary = getMockPlanSummary('reading');
  const listeningSummary = getMockPlanSummary('listening');

  // ── Mobile rendering ──────────────────────────────────────────────────────
  if (isMobile) {
    const allScores = Object.values(Stats.get())
      .flatMap(s => (s.history || []).map(h => h.score).filter(sc => typeof sc === 'number' && sc > 0));
    const avgScore = allScores.length
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null;
    const bestScore = allScores.length ? Math.max(...allScores) : null;
    const mockHistory = Object.values(Stats.get()).flatMap(s => s.history || []);
    const mockCount = mockHistory.length;

    const sections = [
      { label: currentLang === 'zh' ? '口语专项' : 'Speaking', desc: `RA × 5 · RS × 4 · DI × 3 · RL × 2 · ASQ × 5 · ${speakingSummary.totalQuestions}${currentLang === 'zh' ? '题' : 'q'}`, time: '~30 min', action: "MT_start('speaking')", grad: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: currentLang === 'zh' ? '写作专项' : 'Writing',  desc: `SWT × 2 · Essay × 1 · ${writingSummary.totalQuestions}${currentLang === 'zh' ? '题' : 'q'}`, time: '~30 min', action: "MT_start('writing')",  grad: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: currentLang === 'zh' ? '阅读专项' : 'Reading',  desc: `RWFIB · MCSR · MCMR · ROP · RFIB · ${readingSummary.totalQuestions}${currentLang === 'zh' ? '题' : 'q'}`, time: '~32 min', action: "MT_start('reading')",  grad: 'linear-gradient(135deg,#10b981,#34d399)' },
      { label: currentLang === 'zh' ? '听力专项' : 'Listening', desc: `SST · MCSL · MCML · FBL · HCS · SMW · HI · WFD × 4 · ${listeningSummary.totalQuestions}${currentLang === 'zh' ? '题' : 'q'}`, time: '~45 min', action: "MT_start('listening')", grad: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
    ];

    const sectionCards = sections.map(s => `
<div class="mob-exam-card" onclick="${s.action}" style="cursor:pointer">
  <div class="mob-exam-header">
    <div class="mob-exam-icon" style="background:${s.grad}">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    </div>
    <div>
      <div class="mob-exam-title">${s.label}</div>
      <div class="mob-exam-subtitle">${s.desc} · ${s.time}</div>
    </div>
  </div>
  <div class="mob-exam-divider"></div>
  <div class="mob-exam-footer">
    <div>
      <div class="mob-exam-score-label">${currentLang === 'zh' ? '上次得分: —' : 'Last Score: —'}</div>
    </div>
    <button class="mob-btn-start">${currentLang === 'zh' ? '练习' : 'Practice'} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
  </div>
</div>`).join('');

    $('#page-container').innerHTML = `
<div class="mob-page">
  <div class="mob-mock-hero">
    <div class="mob-mock-title">${currentLang === 'zh' ? '模拟考试' : 'Mock Test'}</div>
    <div class="mob-mock-sub">${currentLang === 'zh' ? '真实考场环境 · 本地即时评分' : 'Real exam environment · Instant scoring'}</div>
    <div class="mob-score-strip">
      <div class="mob-score-pill">
        <span class="mob-score-pill-label">${currentLang === 'zh' ? '已完成' : 'Completed'}</span>
        <span class="mob-score-pill-val">${mockCount}</span>
      </div>
      <div class="mob-score-pill">
        <span class="mob-score-pill-label">${currentLang === 'zh' ? '最高分' : 'Best score'}</span>
        <span class="mob-score-pill-val">${bestScore || '—'}</span>
      </div>
      <div class="mob-score-pill">
        <span class="mob-score-pill-label">${currentLang === 'zh' ? '平均分' : 'Avg Score'}</span>
        <span class="mob-score-pill-val">${avgScore || '—'}</span>
      </div>
    </div>
  </div>
  <div class="mob-content">
    <button class="mob-full-mock-cta" onclick="MT_start('full')">
      <span class="mob-full-mock-cta-title">${currentLang === 'zh' ? '开始完整模考' : 'Start Full Mock Test'}</span>
      <span class="mob-full-mock-cta-subtitle">${currentLang === 'zh' ? `共 ${fullSummary.totalQuestions} 题 · ~2小时 · 本地评分 · 真实考试流程` : `${fullSummary.totalQuestions} questions · ~2 hours · Local scoring · Real exam format`}</span>
    </button>
    <div class="mob-full-mock-info">
      <div>${currentLang === 'zh' ? `包含：口语 ${speakingSummary.totalQuestions} 题 + 写作 ${writingSummary.totalQuestions} 题` : `Includes: Speaking ${speakingSummary.totalQuestions} + Writing ${writingSummary.totalQuestions}`}</div>
      <div>${currentLang === 'zh' ? `阅读 ${readingSummary.totalQuestions} 题（约30分钟）` : `• Reading ${readingSummary.totalQuestions} questions (~30 min)`}</div>
      <div>${currentLang === 'zh' ? `听力 ${listeningSummary.totalQuestions} 题（约40分钟）` : `• Listening ${listeningSummary.totalQuestions} questions (~40 min)`}</div>
      <div>${currentLang === 'zh' ? '自动计时 · 不可暂停 · 真实流程' : '• Auto timed · No pause · Real flow'}</div>
    </div>
    <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:-6px">${currentLang === 'zh' ? '专项模考' : 'Practice by Section'}</div>
    ${sectionCards}
    <div style="background:linear-gradient(135deg,#0f1d36,#1e3560);border-radius:18px;padding:18px;display:flex;gap:14px;align-items:flex-start">
      <div style="width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px">${currentLang === 'zh' ? '模考小贴士' : 'Tips'}</div>
        <div style="font-size:12px;color:rgba(255,255,255,.55);line-height:1.5">${currentLang === 'zh' ? '建议在安静环境佩戴耳机完成模考，考试期间无法暂停。' : 'Use headphones in a quiet environment. The test cannot be paused.'}</div>
      </div>
    </div>
  </div>
</div>`;
    return;
  }
  // ── End mobile rendering ───────────────────────────────────────────────────

  $('#page-container').innerHTML = `
<div class="page-header">
  <h1>模拟考试 Mock Test <span class="badge badge-speaking">Full Test</span></h1>
  <p>${currentLang === 'zh' ? `当前原创完整模考共 ${fullSummary.totalQuestions} 题，可直接开始整套或分模块练习。` : `The current original full mock contains ${fullSummary.totalQuestions} questions. Start the full test or practice by section.`}</p>
</div>
<div class="grid-3" style="margin-bottom:24px">
  <div class="skill-card" onclick="MT_start('full')" style="grid-column:1 / -1;border:1px solid rgba(96,165,250,.3);background:linear-gradient(135deg,rgba(15,29,54,.98),rgba(30,53,96,.98));color:#fff">
    <div class="skill-icon">🧪</div>
    <div class="skill-title" style="color:#f8fbff">${currentLang === 'zh' ? '完整原创模考' : 'Original Full Mock Test'}</div>
    <div class="skill-desc" style="color:rgba(226,232,240,.92)">${currentLang === 'zh' ? `共 ${fullSummary.totalQuestions} 题，按完整考试顺序进行` : `${fullSummary.totalQuestions} questions in the full exam order`}</div>
    <div class="skill-count" style="color:#7dd3fc">${currentLang === 'zh' ? '~2 小时 · 自动进入下一模块' : '~2 hours · Auto-advances through every section'}</div>
  </div>
  <div class="skill-card" onclick="MT_start('speaking')">
    <div class="skill-icon">🎤</div>
    <div class="skill-title">Speaking Section</div>
    <div class="skill-desc">RA × 5 · RS × 4 · DI × 3 · RL × 2 · ASQ × 5</div>
    <div class="skill-count">~30 minutes</div>
  </div>
  <div class="skill-card" onclick="MT_start('writing')">
    <div class="skill-icon">✍️</div>
    <div class="skill-title">Writing Section</div>
    <div class="skill-desc">SWT × 2 · Essay × 1</div>
    <div class="skill-count">~30 minutes</div>
  </div>
  <div class="skill-card" onclick="MT_start('reading')">
    <div class="skill-icon">📖</div>
    <div class="skill-title">Reading Section</div>
    <div class="skill-desc">RWFIB × 5 · MCMR × 2 · ROP × 3 · RFIB × 4 · MCSR × 2</div>
    <div class="skill-count">~32 minutes</div>
  </div>
  <div class="skill-card" onclick="MT_start('listening')">
    <div class="skill-icon">🎧</div>
    <div class="skill-title">Listening Section</div>
    <div class="skill-desc">SST × 2 · MCML × 2 · FBL × 4 · HCS × 2 · MCSL × 2 · SMW × 2 · HI × 2 · WFD × 4</div>
    <div class="skill-count">~45 minutes</div>
  </div>
</div>

<!-- PTE Exam Structure -->
<div class="card" style="margin-bottom:16px">
  <div class="card-title" style="margin-bottom:16px">📋 PTE 考试结构 Exam Structure</div>

  <!-- Part 1 -->
  <div class="mt-part-header mt-part-speaking">
    <span class="mt-part-badge">Part 1</span>
    <span class="mt-part-name">Speaking &amp; Writing</span>
    <span class="mt-part-time">77 – 93 min</span>
  </div>
  <table class="mt-table">
    <thead><tr><th>题型 Item Type</th><th>题数</th><th>时间</th></tr></thead>
    <tbody>
      <tr><td>📖 Read Aloud</td><td>6 – 9</td><td>~30–40 s / 题</td></tr>
      <tr><td>🔁 Repeat Sentence</td><td>10 – 12</td><td>~15 s / 题</td></tr>
      <tr><td>🖼️ Describe Image</td><td>6 – 7</td><td>25 s 准备 + 40 s 答</td></tr>
      <tr><td>🎙️ Re-tell Lecture</td><td>3 – 4</td><td>10 s 准备 + 40 s 答</td></tr>
      <tr><td>❓ Answer Short Q.</td><td>5 – 6</td><td>~10 s / 题</td></tr>
      <tr class="mt-row-divider"><td>📝 Summarize Written Text</td><td>1 – 2</td><td>10 min / 题</td></tr>
      <tr><td>✍️ Write Essay</td><td>1 – 2</td><td>20 min / 题</td></tr>
    </tbody>
  </table>

  <!-- Part 2 -->
  <div class="mt-part-header mt-part-reading" style="margin-top:18px">
    <span class="mt-part-badge">Part 2</span>
    <span class="mt-part-name">Reading</span>
    <span class="mt-part-time">32 – 41 min</span>
  </div>
  <table class="mt-table">
    <thead><tr><th>题型 Item Type</th><th>题数</th><th>时间</th></tr></thead>
    <tbody>
      <tr><td>🔤 R&amp;W Fill in the Blanks</td><td>5 – 6</td><td>–</td></tr>
      <tr><td>🔘 MC Single Answer</td><td>2 – 3</td><td>–</td></tr>
      <tr><td>☑️ MC Multiple Answers</td><td>2 – 3</td><td>–</td></tr>
      <tr><td>🔀 Re-order Paragraphs</td><td>2 – 3</td><td>–</td></tr>
      <tr><td>📋 Reading Fill in Blanks</td><td>4 – 5</td><td>–</td></tr>
    </tbody>
  </table>

  <!-- Part 3 -->
  <div class="mt-part-header mt-part-listening" style="margin-top:18px">
    <span class="mt-part-badge">Part 3</span>
    <span class="mt-part-name">Listening</span>
    <span class="mt-part-time">45 – 57 min</span>
  </div>
  <table class="mt-table">
    <thead><tr><th>题型 Item Type</th><th>题数</th><th>时间</th></tr></thead>
    <tbody>
      <tr><td>🎧 Summarize Spoken Text</td><td>2 – 3</td><td>10 min / 题</td></tr>
      <tr><td>☑️ MC Multiple Answers</td><td>2 – 3</td><td>–</td></tr>
      <tr><td>🎵 Fill in the Blanks</td><td>2 – 3</td><td>–</td></tr>
      <tr><td>💡 Highlight Correct Summary</td><td>2 – 3</td><td>–</td></tr>
      <tr><td>🔘 MC Single Answer</td><td>2 – 3</td><td>–</td></tr>
      <tr><td>🔍 Select Missing Word</td><td>2 – 3</td><td>–</td></tr>
      <tr><td>❌ Highlight Incorrect Words</td><td>2 – 3</td><td>–</td></tr>
      <tr><td>✏️ Write from Dictation</td><td>3 – 4</td><td>~3 min / 题</td></tr>
    </tbody>
  </table>
</div>

<div class="card">
  <div class="card-title">Recent Mock Test Scores</div>
  ${generateMockHistory()}
</div>`;
};

function generateMockHistory() {
  const stats=Stats.get();
  const types=['readAloud','repeatSentence','summarizeWritten','writeEssay','writeDictation'];
  const labels=['Read Aloud','Repeat Sentence','Summarize Written','Write Essay','Write Dictation'];
  let rows=types.map((t,i)=>{
    const avg=Stats.getAvg(t); const d=stats[t];
    return `<div class="score-bar-row">
<div class="score-bar-label">${labels[i]}</div>
<div class="score-bar-track"><div class="score-bar-fill" style="width:${avg||0}%;background:${Scorer.gradeColor(avg||0)}"></div></div>
<div class="score-bar-val">${avg!=null?avg:'--'}</div>
</div>`;
  }).join('');
  return rows || '<div class="empty-state"><div class="empty-icon">📊</div><p>Complete exercises to see your stats here</p></div>';
}

function getMockPlan(type) {
  return typeof window.getMockBlueprint === 'function' ? window.getMockBlueprint(type) : [];
}

window.MT_start = async function(type) {
  const plan = getMockPlan(type);
  const isZh = typeof getAppLang === 'function' ? getAppLang() === 'zh' : true;
  await startMockSession('full_mock_1', type);
  startTodayPlan(plan);
  const labelMap = {
    full: isZh ? '完整原创模考' : 'original full mock test',
    speaking: isZh ? '口语原创模考' : 'original speaking mock',
    writing: isZh ? '写作原创模考' : 'original writing mock',
    reading: isZh ? '阅读原创模考' : 'original reading mock',
    listening: isZh ? '听力原创模考' : 'original listening mock',
  };
  showToast(isZh ? `开始${labelMap[type] || labelMap.full}，加油。` : `Starting the ${labelMap[type] || labelMap.full}. Good luck.`);
};

window.MT_restart = async function(type = 'full') {
  clearMockSession();
  await MT_start(type);
};

Pages['mock-results'] = function() {
  const session = getMockSession();
  if (!session) {
    navigate('mock-test', { replace: true });
    return;
  }
  const reviewItems = getMockReviewItems();
  const sectionStats = ['speakingWriting', 'reading', 'listening']
    .map(section => collectMockSectionStats(section))
    .filter(Boolean);
  const answered = reviewItems.filter(item => item.response?.answered).length;
  const scored = reviewItems.map(item => item.response?.score).filter(score => typeof score === 'number');
  const averageScore = scored.length ? Math.round(scored.reduce((sum, score) => sum + score, 0) / scored.length) : null;
  const currentLang = getAppLang();

  $('#page-container').innerHTML = `
<div class="page-header">
  <h1>${currentLang === 'zh' ? '模考结果' : 'Mock Test Results'}</h1>
  <p>${currentLang === 'zh' ? '本次完整模考已结束，可查看整体表现并进入答题回顾。' : 'Your mock exam is complete. Review the overall summary and inspect your answers.'}</p>
</div>
<div class="mock-results-grid">
  <div class="card mock-result-hero">
    <div class="mock-result-kicker">${session.title || 'PTE Full Mock Test'}</div>
    <div class="mock-result-score">${averageScore == null ? '—' : averageScore}</div>
    <div class="mock-result-sub">${currentLang === 'zh' ? '综合估算分' : 'Estimated Overall Score'}</div>
    <div class="mock-result-pill-row">
      <div class="mock-result-pill"><span>${currentLang === 'zh' ? '已作答' : 'Answered'}</span><strong>${answered}</strong></div>
      <div class="mock-result-pill"><span>${currentLang === 'zh' ? '未作答' : 'Unanswered'}</span><strong>${Math.max(0, reviewItems.length - answered)}</strong></div>
      <div class="mock-result-pill"><span>${currentLang === 'zh' ? '总题数' : 'Total Questions'}</span><strong>${reviewItems.length}</strong></div>
    </div>
    <div class="btn-group" style="margin-top:16px">
      <button class="btn btn-primary" onclick="navigate('mock-review')">${currentLang === 'zh' ? '查看答案回顾' : 'Review Answers'}</button>
      <button class="btn btn-outline" onclick="MT_restart('${session.mode || 'full'}')">${currentLang === 'zh' ? '重新开始模考' : 'Restart Mock Test'}</button>
    </div>
  </div>
  <div class="card">
    <div class="card-title">${currentLang === 'zh' ? '分区概览' : 'Section Summary'}</div>
    <div class="mock-section-summary">
      ${sectionStats.map(section => `
<div class="mock-section-row">
  <div>
    <div class="mock-section-row-title">${section.label}</div>
    <div class="mock-section-row-meta">${section.answered}/${section.total} ${currentLang === 'zh' ? '已完成' : 'answered'}</div>
  </div>
  <div class="mock-section-row-end">
    <div class="mock-section-row-score">${section.averageScore == null ? '—' : section.averageScore}</div>
    <div class="mock-section-row-caption">${currentLang === 'zh' ? '估算分' : 'est.'}</div>
  </div>
</div>`).join('')}
    </div>
  </div>
</div>`;
};

Pages['mock-review'] = function() {
  const session = getMockSession();
  if (!session) {
    navigate('mock-test', { replace: true });
    return;
  }
  const currentLang = getAppLang();
  const reviewItems = getMockReviewItems();

  $('#page-container').innerHTML = `
<div class="page-header">
  <h1>${currentLang === 'zh' ? '模考回顾' : 'Mock Review'}</h1>
  <p>${currentLang === 'zh' ? '查看每道题的作答状态、草稿内容和标准答案。' : 'Inspect each question, your saved response, and the correct answer when available.'}</p>
</div>
<div class="mock-review-list">
  ${reviewItems.map(item => {
    const draftSummary = item.response?.draft?.summary || item.response?.transcript || '';
    const correctAnswer = item.response?.correctAnswer || '';
    return `
<div class="card mock-review-card">
  <div class="mock-review-card-top">
    <div>
      <div class="mock-review-card-tag">${item.sectionLabel}</div>
      <div class="mock-review-card-title">${item.overallNumber}. ${item.title}</div>
    </div>
    <div class="mock-review-card-status ${item.response?.answered ? 'is-answered' : 'is-unanswered'}">
      ${item.response?.answered ? (currentLang === 'zh' ? '已作答' : 'Answered') : (currentLang === 'zh' ? '未作答' : 'Unanswered')}
    </div>
  </div>
  <div class="mock-review-card-prompt">${Scorer.escapeHtml((item.response?.promptText || item.question?.prompt || item.question?.text || item.question?.transcript || item.question?.content || item.question?.title || '').slice(0, 280) || '—')}</div>
  <div class="mock-review-card-grid">
    <div>
      <div class="mock-review-label">${currentLang === 'zh' ? '你的答案' : 'Your Answer'}</div>
      <div class="mock-review-value">${Scorer.escapeHtml(draftSummary || (currentLang === 'zh' ? '暂无保存内容' : 'No saved response yet.'))}</div>
    </div>
    <div>
      <div class="mock-review-label">${currentLang === 'zh' ? '参考答案' : 'Correct Answer'}</div>
      <div class="mock-review-value">${Scorer.escapeHtml(correctAnswer || (currentLang === 'zh' ? '该题型暂不提供固定标准答案' : 'No fixed answer key for this task type.'))}</div>
    </div>
  </div>
  <div class="mock-review-footer">
    <span>${currentLang === 'zh' ? '分数' : 'Score'}: <strong>${typeof item.response?.score === 'number' ? item.response.score : '—'}</strong></span>
  </div>
</div>`;
  }).join('')}
</div>
<div class="btn-group" style="margin-top:18px">
  <button class="btn btn-outline" onclick="navigate('mock-results')">${currentLang === 'zh' ? '返回结果页' : 'Back to Results'}</button>
  <button class="btn btn-primary" onclick="MT_restart('${session.mode || 'full'}')">${currentLang === 'zh' ? '重新开始模考' : 'Restart Mock Test'}</button>
</div>`;
};
