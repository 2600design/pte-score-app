Pages['mock-test'] = function() {
  const isMobile = window.innerWidth <= 640;
  const currentLang = getAppLang();

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
      { label: currentLang === 'zh' ? '口语专项' : 'Speaking', desc: 'RA · RS · DI · RL · ASQ', time: '~30 min', action: "MT_start('speaking')", grad: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: currentLang === 'zh' ? '写作专项' : 'Writing',  desc: 'SWT · Essay · WFD',      time: '~30 min', action: "MT_start('writing')",  grad: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: currentLang === 'zh' ? '阅读专项' : 'Reading',  desc: 'RWFIB · MCQ · ROP',      time: '~32 min', action: "MT_start('reading')",  grad: 'linear-gradient(135deg,#10b981,#34d399)' },
      { label: currentLang === 'zh' ? '听力专项' : 'Listening', desc: 'SST · FBL · HCS · WFD', time: '~45 min', action: "MT_start('listening')", grad: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
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
      <span class="mob-full-mock-cta-subtitle">${currentLang === 'zh' ? '~2小时 · 本地评分 · 真实考试流程' : '~2 hours · Local scoring · Real exam format'}</span>
    </button>
    <div class="mob-full-mock-info">
      <div>${currentLang === 'zh' ? '包含：口语与写作（约60分钟）' : 'Includes: Speaking & Writing (~60 min)'}</div>
      <div>${currentLang === 'zh' ? '阅读（约30分钟）' : '• Reading (~30 min)'}</div>
      <div>${currentLang === 'zh' ? '听力（约40分钟）' : '• Listening (~40 min)'}</div>
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
  <p>Complete a timed full-length PTE mock test.</p>
</div>
<div class="grid-3" style="margin-bottom:24px">
  <div class="skill-card" onclick="MT_start('speaking')">
    <div class="skill-icon">🎤</div>
    <div class="skill-title">Speaking Section</div>
    <div class="skill-desc">RA × 2 · RS × 2 · DI × 1 · RL × 1 · ASQ × 2</div>
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
    <div class="skill-desc">RWFIB · MCSR · MCMR · ROP · RFIB</div>
    <div class="skill-count">~32 minutes</div>
  </div>
  <div class="skill-card" onclick="MT_start('listening')">
    <div class="skill-icon">🎧</div>
    <div class="skill-title">Listening Section</div>
    <div class="skill-desc">SST · FBL · HCS · SMW · HI · WFD</div>
    <div class="skill-count">~45 minutes</div>
  </div>
  <div class="skill-card" onclick="MT_start('mini')">
    <div class="skill-icon">⚡</div>
    <div class="skill-title">Mini Mock (Quick)</div>
    <div class="skill-desc">One question from each section</div>
    <div class="skill-count">~15 minutes</div>
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

window.MT_start = function(type) {
  if (type === 'full') {
    const isZh = typeof getAppLang === 'function' ? getAppLang() === 'zh' : true;
    showToast(isZh ? '完整模考流程还没有接好，先保留在 Mock Test 页面。' : 'The full mock flow is not wired up yet, so this stays on the Mock Test page for now.');
    return;
  }
  const map = { speaking:'read-aloud', writing:'summarize-written', reading:'rw-fill-blanks', listening:'summarize-spoken', mini:'read-aloud' };
  navigate(map[type]);
  showToast(`Starting ${type} section — good luck! 🎯`);
};
