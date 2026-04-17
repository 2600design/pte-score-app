Pages['progress'] = function () {
  if (isGuestUser()) {
    $('#page-container').innerHTML = renderProtectedFeatureGate('progress_guest_title', 'progress_guest_copy');
    return;
  }

  const stats = Stats.get();
  const isMobile = window.innerWidth <= 640;
  const currentLang = getAppLang();

  const taskMeta = [
    { key: 'readAloud', title: t('ra_title'), cat: t('label_speaking'), icon: '📖' },
    { key: 'repeatSentence', title: t('rs_title'), cat: t('label_speaking'), icon: '🔁' },
    { key: 'describeImage', title: t('di_title'), cat: t('label_speaking'), icon: '🖼️' },
    { key: 'retellLecture', title: t('rl_title'), cat: t('label_speaking'), icon: '🎙️' },
    { key: 'answerShort', title: t('asq_title'), cat: t('label_speaking'), icon: '❓' },
    { key: 'summarizeWritten', title: t('swt_title'), cat: t('label_writing'), icon: '📝' },
    { key: 'writeEssay', title: t('we_title'), cat: t('label_writing'), icon: '✍️' },
    { key: 'rwFillBlanks', title: t('rwfb_title'), cat: t('label_reading'), icon: '🔤' },
    { key: 'mcSingleReading', title: t('mcsr_title'), cat: t('label_reading'), icon: '🔘' },
    { key: 'mcMultipleReading', title: t('mcmr_title'), cat: t('label_reading'), icon: '☑️' },
    { key: 'reorderParagraphs', title: t('reorder_title'), cat: t('label_reading'), icon: '🔀' },
    { key: 'rFillBlanks', title: t('rfb_title'), cat: t('label_reading'), icon: '📋' },
    { key: 'summarizeSpoken', title: t('sst_title'), cat: t('label_listening'), icon: '🎧' },
    { key: 'mcSingleListening', title: t('mcsl_title'), cat: t('label_listening'), icon: '🔘' },
    { key: 'mcMultipleListening', title: t('mcml_title'), cat: t('label_listening'), icon: '☑️' },
    { key: 'fillBlanksListening', title: t('fbl_title'), cat: t('label_listening'), icon: '🎵' },
    { key: 'highlightSummary', title: t('hcs_title'), cat: t('label_listening'), icon: '💡' },
    { key: 'selectMissing', title: t('smw_title'), cat: t('label_listening'), icon: '🔍' },
    { key: 'highlightIncorrect', title: t('hi_title'), cat: t('label_listening'), icon: '❌' },
    { key: 'writeDictation', title: t('wfd_title'), cat: t('label_listening'), icon: '✏️' },
  ];

  const history = taskMeta.flatMap(item =>
    (stats[item.key]?.history || []).map(row => ({ ...row, ...item }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const scored = history.filter(item => typeof item.score === 'number');
  const avgScore = scored.length ? Math.round(scored.reduce((sum, item) => sum + item.score, 0) / scored.length) : null;
  const typeCount = new Set(history.map(item => item.key)).size;

  function relTime(dateStr) {
    const mins = Math.max(1, Math.round((Date.now() - new Date(dateStr).getTime()) / 60000));
    if (mins < 60) return t('time_minutes_ago').replace('${n}', mins);
    if (mins < 1440) return t('time_hours_ago').replace('${n}', Math.round(mins / 60));
    return t('time_days_ago').replace('${n}', Math.round(mins / 1440));
  }

  const targetScore = Math.max(79, (avgScore || 58) + 10);
  const progressPct = Math.max(12, Math.min(100, Math.round(((avgScore || 0) / targetScore) * 100)));
  const recentScores = scored.slice(0, 14);
  const previousWindow = recentScores.slice(Math.min(7, recentScores.length));
  const recentWindow = recentScores.slice(0, Math.min(7, recentScores.length));
  const recentAvg = recentWindow.length
    ? Math.round(recentWindow.reduce((sum, item) => sum + item.score, 0) / recentWindow.length)
    : avgScore;
  const previousAvg = previousWindow.length
    ? Math.round(previousWindow.reduce((sum, item) => sum + item.score, 0) / previousWindow.length)
    : null;
  const avgDelta = typeof recentAvg === 'number' && typeof previousAvg === 'number'
    ? recentAvg - previousAvg
    : null;

  const categoryMeta = {
    speaking: {
      label: currentLang === 'zh' ? '口语' : 'Speaking',
      color: '#3b82f6',
      bg: '#eef4ff',
      icon: '🎤',
      keys: ['readAloud', 'repeatSentence', 'describeImage', 'retellLecture', 'answerShort'],
    },
    writing: {
      label: currentLang === 'zh' ? '写作' : 'Writing',
      color: '#f59e0b',
      bg: '#fff5e8',
      icon: '✍️',
      keys: ['summarizeWritten', 'writeEssay'],
    },
    reading: {
      label: currentLang === 'zh' ? '阅读' : 'Reading',
      color: '#22c55e',
      bg: '#ecfbf1',
      icon: '📘',
      keys: ['rwFillBlanks', 'mcSingleReading', 'mcMultipleReading', 'reorderParagraphs', 'rFillBlanks'],
    },
    listening: {
      label: currentLang === 'zh' ? '听力' : 'Listening',
      color: '#8b5cf6',
      bg: '#f4f0ff',
      icon: '🎧',
      keys: ['summarizeSpoken', 'mcSingleListening', 'mcMultipleListening', 'fillBlanksListening', 'highlightSummary', 'selectMissing', 'highlightIncorrect', 'writeDictation'],
    },
  };

  const skillCards = Object.values(categoryMeta).map(section => {
    const items = section.keys
      .map(key => ({ avg: Stats.getAvg(key), attempts: stats[key]?.attempts || 0 }))
      .filter(item => typeof item.avg === 'number' && item.attempts > 0);
    const sectionAvg = items.length ? Math.round(items.reduce((sum, item) => sum + item.avg, 0) / items.length) : null;
    const sectionAttempts = items.reduce((sum, item) => sum + item.attempts, 0);
    return {
      ...section,
      avg: sectionAvg,
      attempts: sectionAttempts,
    };
  }).filter(item => item.avg !== null);

  const trendPoints = scored.slice(0, 7).reverse();

  function buildTrendSvg(points) {
    if (!points.length) {
      return `<div class="prog-empty"><div class="prog-empty-icon">📈</div><div class="prog-empty-desc">${t('progress_chart_empty')}</div></div>`;
    }
    const width = 320;
    const height = 156;
    const paddingX = 18;
    const paddingTop = 18;
    const chartHeight = 90;
    const step = points.length > 1 ? (width - paddingX * 2) / (points.length - 1) : 0;
    const coords = points.map((item, index) => {
      const x = paddingX + step * index;
      const y = paddingTop + (1 - Math.max(0, Math.min(1, item.score / 90))) * chartHeight;
      return { x, y, score: item.score, date: item.date };
    });
    const polyline = coords.map(point => `${point.x},${point.y}`).join(' ');
    const area = `0,${paddingTop + chartHeight + 14} ${coords.map(point => `${point.x},${point.y}`).join(' ')} ${width},${paddingTop + chartHeight + 14}`;
    const labels = coords.map(point => `
      <div class="mob-progress-chart-label" style="left:${(point.x / width) * 100}%">
        <span>${new Date(point.date).toLocaleDateString(currentLang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    `).join('');
    return `
<div class="mob-progress-chart">
  <svg viewBox="0 0 ${width} ${height}" class="mob-progress-chart-svg" aria-hidden="true">
    <defs>
      <linearGradient id="progressAreaGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(59,130,246,0.18)"></stop>
        <stop offset="100%" stop-color="rgba(59,130,246,0)"></stop>
      </linearGradient>
    </defs>
    <line x1="${paddingX}" y1="${paddingTop + chartHeight}" x2="${width - paddingX}" y2="${paddingTop + chartHeight}" stroke="#dbe5f2" stroke-width="1.5"></line>
    <polygon points="${area}" fill="url(#progressAreaGradient)"></polygon>
    <polyline points="${polyline}" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
    ${coords.map(point => `<circle cx="${point.x}" cy="${point.y}" r="4.5" fill="#3b82f6"></circle>`).join('')}
    ${coords.map(point => `<text x="${point.x}" y="${point.y - 12}" text-anchor="middle" class="mob-progress-chart-score">${point.score}</text>`).join('')}
  </svg>
  <div class="mob-progress-chart-labels">${labels}</div>
</div>`;
  }

  if (isMobile) {
    const heroSubtitle = currentLang === 'zh'
      ? '追踪你的进步，更接近目标分数。'
      : 'Track your growth and get closer to your target!';
    const targetCardTitle = currentLang === 'zh' ? '目标分数' : 'Target Score';
    const currentAvgTitle = currentLang === 'zh' ? '当前均分' : 'Current Avg';
    const encouragementTitle = currentLang === 'zh' ? '继续加油！' : 'Great job!';
    const encouragementCopy = currentLang === 'zh'
      ? '你正在持续进步'
      : "You're improving, keep it up!";
    const chartRangeLabel = currentLang === 'zh' ? '最近 7 次' : 'Last 7 attempts';
    const historyCountLabel = currentLang === 'zh'
      ? `${history.length} 条记录`
      : `${history.length} records`;

    const skillCardsHtml = skillCards.length
      ? skillCards.map(item => `
<div class="mob-progress-skill-card" style="--skill-color:${item.color};--skill-bg:${item.bg}">
  <div class="mob-progress-skill-icon">${item.icon}</div>
  <div class="mob-progress-skill-name">${item.label}</div>
  <div class="mob-progress-skill-score">${item.avg}<span>/ 90</span></div>
  <div class="mob-progress-skill-meta">${item.attempts} ${currentLang === 'zh' ? '次练习' : 'attempts'}</div>
  <div class="mob-progress-skill-bar"><div class="mob-progress-skill-bar-fill" style="width:${Math.round(item.avg / 90 * 100)}%"></div></div>
</div>`).join('')
      : `<div class="prog-empty"><div class="prog-empty-icon">📊</div><div class="prog-empty-desc">${t('progress_focus_empty')}</div></div>`;

    const historyRowsHtml = history.slice(0, 6).map(item => `
<div class="mob-progress-history-row">
  <div class="mob-progress-history-icon">${item.icon}</div>
  <div class="mob-progress-history-main">
    <div class="mob-progress-history-top">
      <span>${item.title}</span>
      <span class="mob-progress-history-tag">${item.cat}</span>
    </div>
    <div class="mob-progress-history-meta">${relTime(item.date)}</div>
  </div>
  <div class="mob-progress-history-score" style="color:${typeof item.score === 'number' ? Scorer.gradeColor(item.score) : '#94a3b8'}">
    ${item.score ?? '--'}<span>/ 90</span>
  </div>
</div>`).join('');

    $('#page-container').innerHTML = `
<div class="mob-page mob-progress-page">
  <div class="mob-progress-hero">
    <div class="mob-progress-title">${t('progress_title')}</div>
    <div class="mob-progress-subtitle">${heroSubtitle}</div>

    <div class="mob-progress-hero-grid">
      <div class="mob-progress-target-card">
        <div class="mob-progress-hero-label">${targetCardTitle}</div>
        <div class="mob-progress-target-score">${targetScore}+</div>
        <button class="mob-progress-edit-btn" type="button">${currentLang === 'zh' ? '编辑' : 'Edit'}</button>
        <div class="mob-progress-target-bar"><div class="mob-progress-target-bar-fill" style="width:${progressPct}%"></div></div>
        <div class="mob-progress-target-copy">${currentLang === 'zh' ? `已完成 ${progressPct}%` : `You're ${progressPct}% there!`}</div>
      </div>

      <div class="mob-progress-avg-card">
        <div class="mob-progress-hero-label">${currentAvgTitle}</div>
        <div class="mob-progress-mini-ring" style="--score-pct:${Math.max(0, Math.min(100, Math.round((avgScore || 0) / 90 * 100)))}%">
          <div class="mob-progress-mini-ring-inner">
            <div class="mob-progress-mini-score">${avgScore ?? '--'}</div>
            <div class="mob-progress-mini-denom">/ 90</div>
          </div>
        </div>
        <div class="mob-progress-mini-delta ${avgDelta !== null && avgDelta >= 0 ? 'up' : ''}">
          ${avgDelta === null ? '—' : `${avgDelta > 0 ? '+' : ''}${avgDelta}`}
        </div>
      </div>

      <div class="mob-progress-cheer-card">
        <div class="mob-progress-cheer-emoji">🏆</div>
        <div class="mob-progress-cheer-title">${encouragementTitle}</div>
        <div class="mob-progress-cheer-copy">${encouragementCopy}</div>
      </div>
    </div>
  </div>

  <div class="mob-content" style="padding-top:14px">
    <div class="mob-progress-stat-grid">
      <div class="mob-progress-stat-card">
        <div class="mob-progress-stat-icon">⭐</div>
        <div class="mob-progress-stat-label">${t('overall_average')}</div>
        <div class="mob-progress-stat-value">${avgScore ?? '--'}</div>
        <div class="mob-progress-stat-sub">${avgDelta === null ? (currentLang === 'zh' ? '继续练习生成趋势' : 'Keep practicing to unlock trends') : `${avgDelta > 0 ? '+' : ''}${avgDelta} ${currentLang === 'zh' ? 'vs 上周' : 'vs last week'}`}</div>
      </div>
      <div class="mob-progress-stat-card">
        <div class="mob-progress-stat-icon">📚</div>
        <div class="mob-progress-stat-label">${t('total_attempts')}</div>
        <div class="mob-progress-stat-value">${history.length}</div>
        <div class="mob-progress-stat-sub">${currentLang === 'zh' ? '累计练习次数' : 'Total practice records'}</div>
      </div>
      <div class="mob-progress-stat-card">
        <div class="mob-progress-stat-icon">🧩</div>
        <div class="mob-progress-stat-label">${t('types_practiced')}</div>
        <div class="mob-progress-stat-value">${skillCards.length} / 4</div>
        <div class="mob-progress-stat-sub">${currentLang === 'zh' ? '已覆盖的技能模块' : 'Skill groups covered'}</div>
      </div>
      <div class="mob-progress-stat-card">
        <div class="mob-progress-stat-icon">🕒</div>
        <div class="mob-progress-stat-label">${t('progress_recent_meta')}</div>
        <div class="mob-progress-stat-value">${history[0] ? relTime(history[0].date) : '--'}</div>
        <div class="mob-progress-stat-sub">${history[0] ? `${history[0].title} · ${history[0].score ?? '--'}` : t('progress_history_empty')}</div>
      </div>
    </div>

    <div class="mob-progress-section-card">
      <div class="mob-progress-section-head">
        <div>
          <div class="mob-progress-section-title">${t('progress_chart_title')}</div>
          <div class="mob-progress-section-copy">${currentLang === 'zh' ? '你的最近表现变化' : 'Your performance over time'}</div>
        </div>
        <div class="mob-progress-chip">${chartRangeLabel}</div>
      </div>
      ${buildTrendSvg(trendPoints)}
    </div>

    <div class="mob-progress-section-card">
      <div class="mob-progress-section-head">
        <div>
          <div class="mob-progress-section-title">${currentLang === 'zh' ? '技能表现' : 'Performance by Skill'}</div>
          <div class="mob-progress-section-copy">${currentLang === 'zh' ? '各技能题型平均分' : 'Average score by skill group'}</div>
        </div>
      </div>
      <div class="mob-progress-skill-grid">
        ${skillCardsHtml}
      </div>
    </div>

    <div class="mob-progress-section-card">
      <div class="mob-progress-section-head">
        <div>
          <div class="mob-progress-section-title">${currentLang === 'zh' ? '历史记录' : 'History'}</div>
          <div class="mob-progress-section-copy">${historyCountLabel}</div>
        </div>
      </div>
      ${historyRowsHtml || `<div class="prog-empty"><div class="prog-empty-icon">📝</div><div class="prog-empty-desc">${t('progress_history_empty')}</div></div>`}
    </div>
  </div>
</div>`;
    return;
  }

  const chartPoints = scored.slice(0, 8).reverse();
  const chartHtml = chartPoints.length
    ? `<div class="trend-chart-wrap"><div class="trend-chart-bars"><div class="trend-baseline"></div>${
        chartPoints.map(item => `
<div class="trend-bar-col">
  <div class="trend-bar-val">${item.score}</div>
  <div class="trend-bar" style="height:${Math.max(8, Math.round(item.score / 90 * 72))}px;background:${Scorer.gradeColor(item.score)}"></div>
  <div class="trend-bar-date">${new Date(item.date).toLocaleDateString(getAppLang() === 'zh' ? 'zh-CN' : 'en', { month: 'short', day: 'numeric' })}</div>
</div>`).join('')
      }</div></div>`
    : `<div class="prog-empty"><div class="prog-empty-icon">📈</div><div class="prog-empty-desc">${t('progress_chart_empty')}</div></div>`;

  const historyHtml = history.slice(0, 10).map(item => `
<div class="prog-attempt-row">
  <div class="prog-attempt-left">
    <div class="prog-attempt-icon">${item.icon}</div>
    <div>
      <div class="prog-attempt-name">${item.title}</div>
      <div class="prog-attempt-meta">${item.cat} · ${relTime(item.date)}</div>
    </div>
  </div>
  <div class="prog-attempt-score">
    <div class="prog-score-big" style="color:${typeof item.score === 'number' ? Scorer.gradeColor(item.score) : 'var(--text-light)'}">${item.score ?? '—'}</div>
    <div class="prog-score-denom">/ 90</div>
  </div>
</div>`).join('');

  const focus = taskMeta
    .map(item => ({ ...item, avg: Stats.getAvg(item.key), attempts: stats[item.key]?.attempts || 0 }))
    .filter(item => typeof item.avg === 'number' && item.attempts > 0)
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 3);

  const focusHtml = focus.length ? focus.map(item => `
<div class="prog-focus-item">
  <div class="prog-focus-row">
    <div class="prog-focus-name">${item.title}</div>
    <div class="prog-focus-score" style="color:${Scorer.gradeColor(item.avg)}">${item.avg}</div>
  </div>
  <div class="prog-focus-hint">${item.cat} · ${item.attempts}</div>
  <div class="prog-focus-bar"><div class="prog-focus-bar-fill" style="width:${Math.round(item.avg / 90 * 100)}%;background:${Scorer.gradeColor(item.avg)}"></div></div>
</div>`).join('') : `<div class="prog-empty"><div class="prog-empty-icon">🎯</div><div class="prog-empty-desc">${t('progress_focus_empty')}</div></div>`;

  $('#page-container').innerHTML = `
<div class="progress-page">
  <div class="page-header">
    <h1>${t('progress_title')}</h1>
    <p>${t('progress_subtitle')}</p>
  </div>

  <div class="prog-stats-grid">
    <div class="prog-stat-card">
      <span class="prog-stat-icon">⭐</span>
      <div class="prog-stat-value">${avgScore ?? '--'}</div>
      <div class="prog-stat-label">${t('overall_average')}</div>
    </div>
    <div class="prog-stat-card">
      <span class="prog-stat-icon">📚</span>
      <div class="prog-stat-value">${history.length}</div>
      <div class="prog-stat-label">${t('total_attempts')}</div>
    </div>
    <div class="prog-stat-card">
      <span class="prog-stat-icon">🧩</span>
      <div class="prog-stat-value">${typeCount}</div>
      <div class="prog-stat-label">${t('types_practiced')}</div>
    </div>
    <div class="prog-stat-card">
      <span class="prog-stat-icon">🕒</span>
      <div class="prog-stat-value">${history[0] ? relTime(history[0].date) : '--'}</div>
      <div class="prog-stat-label">${t('progress_recent_meta')}</div>
    </div>
  </div>

  <div class="prog-grid-2" style="margin-top:18px">
    <div>
      <div class="prog-card">
        <div class="prog-card-header">
          <div class="prog-card-title">${t('progress_chart_title')}</div>
        </div>
        ${chartHtml}
      </div>

      <div class="prog-card" style="margin-top:16px">
        <div class="prog-card-header">
          <div class="prog-card-title">${t('progress_history_title')}</div>
          <div class="prog-card-meta">${history.length} ${t('progress_latest_count')}</div>
        </div>
        ${historyHtml || `<div class="prog-empty"><div class="prog-empty-icon">📝</div><div class="prog-empty-desc">${t('progress_history_empty')}</div></div>`}
      </div>
    </div>

    <div>
      <div class="prog-card">
        <div class="prog-card-header">
          <div class="prog-card-title">${t('progress_focus_title')}</div>
        </div>
        ${focusHtml}
      </div>

      <div class="prog-card" style="margin-top:16px">
        <div class="prog-card-header">
          <div class="prog-card-title">${t('progress_plan_title')}</div>
        </div>
        <div class="prog-plan-list">
          <div class="prog-plan-item"><div class="prog-plan-dot"></div><div class="prog-plan-text">${t('plan_step_1')}</div></div>
          <div class="prog-plan-item"><div class="prog-plan-dot"></div><div class="prog-plan-text">${t('plan_step_2')}</div></div>
          <div class="prog-plan-item"><div class="prog-plan-dot"></div><div class="prog-plan-text">${t('plan_step_3')}</div></div>
        </div>
        <div class="btn-group" style="margin-top:16px">
          <button class="btn btn-outline" onclick="navigate('study-plan')">${t('nav_study_plan')}</button>
          <button class="btn btn-primary" onclick="navigate('practice')">${t('nav_practice')}</button>
        </div>
      </div>
    </div>
  </div>

  <div style="padding:20px 0 24px;text-align:right">
    <button class="btn-link" style="font-size:12px" onclick="if(confirm('${t('progress_reset')}?')){Stats.save({});navigate('progress');showToast('${t('progress_reset')}')}">${t('progress_reset_local')}</button>
  </div>
</div>`;
};
