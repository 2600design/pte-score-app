window.renderPracticeDirectoryPage = function () {
  const guest = isGuestUser();
  const isNativeIPad = typeof window.isNativeIPad === 'function'
      ? window.isNativeIPad()
      : (() => {
        if (window.__NATIVE_IOS_IPAD__ === true) return true;
        const ua = navigator.userAgent || '';
        const capacitorPlatform = typeof window.Capacitor?.getPlatform === 'function'
          ? window.Capacitor.getPlatform()
          : (window.Capacitor?.platform || '');
        const maxScreenEdge = Math.max(window.screen?.width || 0, window.screen?.height || 0);
        return /iPad/.test(ua)
          || /PTEscoreNativeiPad/i.test(ua)
          || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
          || (!!window.Capacitor && /iPad/i.test(ua))
          || (!!window.Capacitor && capacitorPlatform === 'ios' && navigator.maxTouchPoints > 1 && maxScreenEdge >= 1024);
      })();
  const isTabletLikeDevice = typeof window.isTabletLikeDevice === 'function'
    ? window.isTabletLikeDevice()
    : (() => {
        if (isNativeIPad) return true;
        const minViewport = Math.min(window.innerWidth || 0, window.innerHeight || 0);
        return minViewport >= 768;
      })();
  const isMobile = window.innerWidth <= 640 && !isNativeIPad && !isTabletLikeDevice;
  const currentLang = getAppLang();
  const currentPage = window.__currentPage || sessionStorage.getItem('pte_page') || 'practice-all';
  const practiceView = window.__practiceCategory
    || (currentPage === 'practice-speaking' ? 'speaking'
      : currentPage === 'practice-writing' ? 'writing'
      : currentPage === 'practice-reading' ? 'reading'
      : currentPage === 'practice-listening' ? 'listening'
      : (currentPage.startsWith('tools-') || currentPage.startsWith('smart-practice-')) ? 'prediction'
      : 'all');

  const predictionFilter = window.__practicePredictionFilter || false;
  const latestOnly = predictionFilter === 'latest';
  const highOnly = predictionFilter === 'high';

  const predictionCount = (key) => getPredictionBankActive(key, latestOnly, highOnly).length;
  const allPredictions = getPredictionBankActive('repeatSentence').length
    + getPredictionBankActive('writeFromDictation').length
    + getPredictionBankActive('answerShortQuestion').length
    + getPredictionBankActive('describeImage').length
    + getPredictionBankActive('retellLecture').length;
  const latestPredictions = getPredictionBankActive('repeatSentence', true).length
    + getPredictionBankActive('writeFromDictation', true).length
    + getPredictionBankActive('answerShortQuestion', true).length
    + getPredictionBankActive('describeImage', true).length
    + getPredictionBankActive('retellLecture', true).length;
  const highPredictions = getPredictionBankActive('repeatSentence', false, true).length
    + getPredictionBankActive('writeFromDictation', false, true).length
    + getPredictionBankActive('answerShortQuestion', false, true).length
    + getPredictionBankActive('describeImage', false, true).length
    + getPredictionBankActive('retellLecture', false, true).length;

  const taskGroups = [
    {
      title: t('label_speaking'),
      icon: '🎤',
      desc: t('practice_speaking_desc'),
      badge: '',
      tasks: [
        { key: 'readAloud', title: t('ra_title'), page: 'read-aloud', icon: '📖', count: DB.readAloud.length },
        { key: 'repeatSentence', title: t('rs_title'), page: 'repeat-sentence', icon: '🔁', count: DB.repeatSentence.length },
        { key: 'describeImage', title: t('di_title'), page: 'describe-image', icon: '🖼️', count: getDiTemplates().length || DB.describeImage.length },
        { key: 'retellLecture', title: t('rl_title'), page: 'retell-lecture', icon: '🎙️', count: DB.retellLecture.length },
        { key: 'answerShort', title: t('asq_title'), page: 'answer-short', icon: '❓', count: DB.answerShort.length },
      ],
    },
    {
      title: t('label_writing'),
      icon: '✍️',
      desc: t('practice_writing_desc'),
      badge: '',
      tasks: [
        { key: 'summarizeWritten', title: t('swt_title'), page: 'summarize-written', icon: '📝', count: DB.summarizeWritten.length },
        { key: 'writeEssay', title: t('we_title'), page: 'write-essay', icon: '✍️', count: DB.writeEssay.length },
      ],
    },
    {
      title: t('label_reading'),
      icon: '📖',
      desc: t('practice_reading_desc'),
      badge: '',
      tasks: [
        { key: 'rwFillBlanks', title: t('rwfb_title'), page: 'rw-fill-blanks', icon: '🔤', count: DB.rwFillBlanks.length },
        { key: 'mcSingleReading', title: t('mcsr_title'), page: 'mc-single-reading', icon: '🔘', count: DB.mcSingleReading.length },
        { key: 'mcMultipleReading', title: t('mcmr_title'), page: 'mc-multiple-reading', icon: '☑️', count: DB.mcMultipleReading.length },
        { key: 'reorderParagraphs', title: t('reorder_title'), page: 'reorder-paragraphs', icon: '🔀', count: DB.reorderParagraphs.length },
        { key: 'rFillBlanks', title: t('rfb_title'), page: 'r-fill-blanks', icon: '📋', count: DB.rFillBlanks.length },
      ],
    },
    {
      title: t('label_listening'),
      icon: '🎧',
      desc: t('practice_listening_desc'),
      badge: '',
      tasks: [
        { key: 'summarizeSpoken', title: t('sst_title'), page: 'summarize-spoken', icon: '🎧', count: DB.summarizeSpoken.length },
        { key: 'mcSingleListening', title: t('mcsl_title'), page: 'mc-single-listening', icon: '🔘', count: DB.mcSingleListening.length },
        { key: 'mcMultipleListening', title: t('mcml_title'), page: 'mc-multiple-listening', icon: '☑️', count: DB.mcMultipleListening.length },
        { key: 'fillBlanksListening', title: t('fbl_title'), page: 'fill-blanks-listening', icon: '🎵', count: DB.fillBlanksListening.length },
        { key: 'highlightSummary', title: t('hcs_title'), page: 'highlight-summary', icon: '💡', count: DB.highlightSummary.length },
        { key: 'selectMissing', title: t('smw_title'), page: 'select-missing', icon: '🔍', count: DB.selectMissing.length },
        { key: 'highlightIncorrect', title: t('hi_title'), page: 'highlight-incorrect', icon: '❌', count: DB.highlightIncorrect.length },
        { key: 'writeDictation', title: t('wfd_title'), page: 'write-dictation', icon: '✏️', count: DB.writeDictation.length },
      ],
    },
  ];

  const predictionGroups = [
    {
      key: 'repeatSentence',
      page: 'repeat-sentence',
      title: t('prediction_type_repeat_sentence'),
      count: predictionCount('repeatSentence'),
      icon: '🔁',
    },
    {
      key: 'writeFromDictation',
      page: 'write-dictation',
      title: t('prediction_type_write_from_dictation'),
      count: predictionCount('writeFromDictation'),
      icon: '✏️',
    },
    {
      key: 'answerShortQuestion',
      page: 'answer-short',
      title: t('prediction_type_answer_short_question'),
      count: predictionCount('answerShortQuestion'),
      icon: '❓',
    },
    {
      key: 'describeImage',
      page: 'describe-image',
      title: t('prediction_type_describe_image'),
      count: predictionCount('describeImage'),
      icon: '🖼️',
    },
    {
      key: 'retellLecture',
      page: 'retell-lecture',
      title: t('prediction_type_retell_lecture'),
      count: predictionCount('retellLecture'),
      icon: '🎙️',
    },
  ];

  // ── Mobile rendering ──────────────────────────────────────────────────────
  if (isMobile) {
    const listPageMap = {
      'read-aloud': 'practice-read-aloud', 'repeat-sentence': 'practice-repeat-sentence',
      'describe-image': 'practice-describe-image', 'retell-lecture': 'practice-retell-lecture',
      'answer-short': 'practice-answer-short', 'summarize-written': 'practice-summarize-written',
      'write-essay': 'practice-write-essay', 'rw-fill-blanks': 'practice-rw-fill-blanks',
      'mc-single-reading': 'practice-mc-single-reading', 'mc-multiple-reading': 'practice-mc-multiple-reading',
      'reorder-paragraphs': 'practice-reorder-paragraphs', 'r-fill-blanks': 'practice-r-fill-blanks',
      'summarize-spoken': 'practice-summarize-spoken', 'mc-single-listening': 'practice-mc-single-listening',
      'mc-multiple-listening': 'practice-mc-multiple-listening', 'fill-blanks-listening': 'practice-fill-blanks-listening',
      'highlight-summary': 'practice-highlight-summary', 'select-missing': 'practice-select-missing',
      'highlight-incorrect': 'practice-highlight-incorrect', 'write-dictation': 'practice-write-dictation',
    };

    if (practiceView === 'prediction') {
      const predictionTotal = latestOnly ? latestPredictions : highOnly ? highPredictions : allPredictions;
      const mobilePredictionCards = predictionGroups.map(group => {
        const listPage = {
          'repeat-sentence': 'practice-repeat-sentence',
          'describe-image': 'practice-describe-image',
          'retell-lecture': 'practice-retell-lecture',
          'answer-short': 'practice-answer-short',
          'write-dictation': 'practice-write-dictation',
        }[group.page];
        const openAction = group.count
          ? (listPage
              ? `openQuestionSet('${listPage}','prediction',${latestOnly ? 'true' : 'false'})`
              : `openQuestionSet('${group.page}','prediction',${latestOnly ? 'true' : 'false'})`)
          : 'return';
        const badgeText = highOnly
          ? t('prediction_high_badge')
          : latestOnly
            ? t('prediction_latest_label')
            : t('prediction_badge');

        return `
<div class="mob-qtype-card ${group.count ? '' : 'is-disabled'}" onclick="${openAction}" style="${group.count ? '' : 'opacity:.55'}">
  <div class="mob-qtype-bar" style="background:#f97316"></div>
  <div class="mob-qtype-body">
    <div class="mob-qtype-icon" style="background:#fff7ed;font-size:18px;display:flex;align-items:center;justify-content:center">${group.icon}</div>
    <div style="flex:1;min-width:0">
      <div class="mob-qtype-name">${group.title}</div>
      <div class="mob-qtype-count">${group.count} ${currentLang === 'zh' ? '题' : 'q'}</div>
      <div style="font-size:11px;color:#94a3b8;margin-top:4px">${badgeText}</div>
    </div>
    <div class="mob-qtype-arrow">${group.count ? '›' : '—'}</div>
  </div>
</div>`;
      }).join('');

      $('#page-container').innerHTML = `
<div class="mob-page">
  <div class="mob-practice-hero">
    <div class="mob-practice-title">${highOnly ? t('nav_high_frequency') : t('prediction_bank_title')}</div>
    <div style="margin-top:8px;color:rgba(255,255,255,.78);font-size:13px;line-height:1.5">
      ${highOnly ? t('home_directory_high_frequency_desc') : t('prediction_bank_subtitle')}
    </div>
  </div>
  <div class="mob-content" style="padding-top:16px">
    <div style="display:flex;gap:10px;overflow:auto;padding-bottom:4px;margin-bottom:14px">
      <button class="btn ${!predictionFilter ? 'btn-primary' : 'btn-outline'}" onclick="navigate('tools-prediction-bank')">${t('prediction_filter_bank')}</button>
      <button class="btn ${predictionFilter === 'high' ? 'btn-primary' : 'btn-outline'}" onclick="navigate('tools-high-frequency')">${t('prediction_filter_high')}</button>
      <button class="btn ${predictionFilter === 'latest' ? 'btn-primary' : 'btn-outline'}" onclick="window.__practicePredictionFilter='latest';setPredictionHighOnly(false);navigate('tools-prediction-bank')">${t('prediction_filter_latest')}</button>
    </div>
    ${predictionTotal
      ? mobilePredictionCards
      : `<div class="prog-empty"><div class="prog-empty-icon">🔥</div><div class="prog-empty-desc">${t('prediction_empty')}</div><div class="prog-empty-desc" style="margin-top:6px">${t('prediction_review_note')}</div></div>`}
  </div>
</div>`;
      return;
    }

    const tabMeta = [
      { id: 'speaking', label: currentLang === 'zh' ? '口语' : 'Speaking', color: '#3b82f6', bg: '#eff6ff',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>` },
      { id: 'writing',  label: currentLang === 'zh' ? '写作' : 'Writing',  color: '#f59e0b', bg: '#fffbeb',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>` },
      { id: 'reading',  label: currentLang === 'zh' ? '阅读' : 'Reading',  color: '#10b981', bg: '#ecfdf5',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>` },
      { id: 'listening',label: currentLang === 'zh' ? '听力' : 'Listening', color: '#8b5cf6', bg: '#f5f3ff',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>` },
    ];

    const activeTab = (practiceView === 'all' || practiceView === 'prediction') ? 'speaking' : practiceView;

    const renderMobSection = (group, meta) => {
      return group.tasks.map(task => {
        const avg = Stats.getAvg(task.key);
        const scoreHtml = typeof avg === 'number'
          ? `<span style="color:${Scorer.gradeColor(avg)};font-weight:700;font-size:14px">${avg}</span>`
          : `<span style="color:#c0c9d8;font-size:12px">${currentLang === 'zh' ? '未练习' : 'Not tried'}</span>`;
        const lp = listPageMap[task.page];
        const action = lp ? `openQuestionSet('${lp}','default',false)` : `openQuestionSet('${task.page}','default',false)`;
        return `
<div class="mob-qtype-card" onclick="${action}">
  <div class="mob-qtype-bar" style="background:${meta.color}"></div>
  <div class="mob-qtype-body">
    <div class="mob-qtype-icon" style="background:${meta.bg}">
      <span class="mob-qtype-icon-glyph">${task.icon}</span>
    </div>
    <div style="flex:1;min-width:0">
      <div class="mob-qtype-name">${task.title}</div>
      <div class="mob-qtype-count">${task.count} ${currentLang === 'zh' ? '题' : 'q'}</div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;padding-right:4px">
      <div style="font-size:10px;color:#b0bdd0">${currentLang === 'zh' ? '最近分数' : 'Last score'}</div>
      ${scoreHtml}
    </div>
    <div class="mob-qtype-arrow">›</div>
  </div>
</div>`;
      }).join('');
    };

    const sectionsHtml = taskGroups.map((group, i) => {
      const meta = tabMeta[i];
      return `<div id="mob-tab-${meta.id}" style="display:${meta.id === activeTab ? 'flex' : 'none'};flex-direction:column;gap:10px">
        ${renderMobSection(group, meta)}
      </div>`;
    }).join('');

    const tabsHtml = tabMeta.map(meta => `
<button class="mob-skill-tab ${meta.id === activeTab ? 'active' : ''}"
  onclick="document.querySelectorAll('.mob-skill-tab').forEach(b=>b.classList.remove('active'));this.classList.add('active');document.querySelectorAll('[id^=mob-tab-]').forEach(s=>s.style.display='none');document.getElementById('mob-tab-${meta.id}').style.display='flex'">
  ${meta.svg}
  ${meta.label}
</button>`).join('');

    $('#page-container').innerHTML = `
<div class="mob-page">
  <div class="mob-practice-hero">
    <div class="mob-practice-title">${currentLang === 'zh' ? '练习' : 'Practice'}</div>
    <div class="mob-practice-subtitle">${currentLang === 'zh' ? '选择题型开始练习' : 'Select a question type to begin'}</div>
  </div>
  <div class="mob-skill-tabs">${tabsHtml}</div>
  <div class="mob-content" style="padding-top:16px">
    ${sectionsHtml}
  </div>
</div>`;
    return;
  }
  // ── End mobile rendering ───────────────────────────────────────────────────

  const intro = `
<div class="card" style="margin-bottom:18px">
  <div class="eyebrow">${t('practice_focus_title')}</div>
  <div class="card-title" style="margin-bottom:8px">${practiceView === 'speaking'
    ? t('practice_speaking_title')
    : practiceView === 'writing'
      ? t('practice_writing_title')
      : practiceView === 'reading'
        ? t('practice_reading_title')
        : practiceView === 'listening'
          ? t('practice_listening_title')
          : t('practice_heading')}</div>
  <p style="font-size:13.5px;color:var(--text-light);line-height:1.7">${t('practice_focus_copy')}</p>
</div>`;

  const visibleTaskGroups = practiceView === 'all'
    ? taskGroups
    : taskGroups.filter(group => {
        const label = group.title;
        return (practiceView === 'speaking' && label === t('label_speaking'))
          || (practiceView === 'writing' && label === t('label_writing'))
          || (practiceView === 'reading' && label === t('label_reading'))
          || (practiceView === 'listening' && label === t('label_listening'));
      });

  const groupsHtml = visibleTaskGroups.map(group => {
    const total = group.tasks.reduce((sum, item) => sum + item.count, 0);
    const tasksHtml = group.tasks.map(task => {
      const avg = Stats.getAvg(task.key);
      const scoreHtml = typeof avg === 'number'
        ? `<span style="color:${Scorer.gradeColor(avg)}">${avg}</span>`
        : `<span style="color:var(--text-light)">${t('practice_no_score')}</span>`;
      const previewCount = Math.min(GUEST_FREE_QUESTION_LIMIT, task.count);
      const guestMeta = guest
        ? `<div style="font-size:11px;color:var(--text-light);margin-top:6px">${t('practice_free_preview').replace('${count}', previewCount)}</div>
           ${task.count > previewCount ? `<button class="btn btn-outline" style="margin-top:10px;font-size:12px;padding:0 12px;height:32px" onclick="event.stopPropagation();openLoginPrompt()">${t('practice_locked_more')}</button>` : ''}`
        : '';

      const listPage = {
        'read-aloud': 'practice-read-aloud',
        'repeat-sentence': 'practice-repeat-sentence',
        'describe-image': 'practice-describe-image',
        'retell-lecture': 'practice-retell-lecture',
        'answer-short': 'practice-answer-short',
        'summarize-written': 'practice-summarize-written',
        'write-essay': 'practice-write-essay',
        'rw-fill-blanks': 'practice-rw-fill-blanks',
        'mc-single-reading': 'practice-mc-single-reading',
        'mc-multiple-reading': 'practice-mc-multiple-reading',
        'reorder-paragraphs': 'practice-reorder-paragraphs',
        'r-fill-blanks': 'practice-r-fill-blanks',
        'summarize-spoken': 'practice-summarize-spoken',
        'mc-single-listening': 'practice-mc-single-listening',
        'mc-multiple-listening': 'practice-mc-multiple-listening',
        'fill-blanks-listening': 'practice-fill-blanks-listening',
        'highlight-summary': 'practice-highlight-summary',
        'select-missing': 'practice-select-missing',
        'highlight-incorrect': 'practice-highlight-incorrect',
        'write-dictation': 'practice-write-dictation',
      }[task.page];
      const taskAction = listPage
        ? `openQuestionSet('${listPage}','default',false)`
        : `openQuestionSet('${task.page}','default',false)`;
      return `
<div class="practice-task-card" onclick="${taskAction}">
  <div class="practice-task-left">
    <div class="practice-task-icon">${task.icon}</div>
    <div>
      <div class="practice-task-name">${task.title}</div>
      <div class="practice-task-count">${task.count} ${t('practice_questions')}</div>
    </div>
  </div>
  <div class="practice-task-score">
    <div style="font-size:11px;color:var(--text-light);margin-bottom:4px">${t('practice_recent_score')}</div>
    <div>${scoreHtml}</div>
    ${guestMeta}
  </div>
</div>`;
    }).join('');

    return `
<section class="practice-section">
  <div class="practice-section-title">
    <span style="margin-right:8px">${group.icon}</span>${group.title}
    ${group.badge ? `<span class="mod-card-badge mod-badge-ai" style="margin-left:8px">${group.badge}</span>` : ''}
    <span>${total} ${t('practice_tasks')}</span>
  </div>
  <div style="font-size:13px;color:var(--text-light);margin-bottom:14px">${group.desc}</div>
  <div class="practice-tasks-grid">
    ${tasksHtml}
  </div>
</section>`;
  }).join('');

  const predictionCards = predictionGroups.map(group => {
    const count = group.count;
    const previewCount = Math.min(GUEST_FREE_QUESTION_LIMIT, count);
    const predictionListPage = {
      'repeat-sentence': 'practice-repeat-sentence',
      'describe-image': 'practice-describe-image',
      'retell-lecture': 'practice-retell-lecture',
      'answer-short': 'practice-answer-short',
      'write-dictation': 'practice-write-dictation',
    }[group.page];
    const openAction = count
      ? predictionListPage
        ? `openQuestionSet('${predictionListPage}','prediction',${latestOnly ? 'true' : 'false'})`
        : `openQuestionSet('${group.page}','prediction',${latestOnly ? 'true' : 'false'})`
      : 'return';

    return `
<div class="practice-task-card ${count ? '' : 'is-disabled'}" onclick="${openAction}">
  <div class="practice-task-left">
    <div class="practice-task-icon">${group.icon}</div>
    <div>
      <div class="practice-task-name">${group.title}</div>
      <div class="practice-task-count">${count} ${t('practice_questions')}</div>
      <div style="font-size:11px;color:var(--text-light);margin-top:4px">${t('prediction_high_badge')}</div>
    </div>
  </div>
  <div class="practice-task-score">
    <div style="font-size:11px;color:var(--text-light);margin-bottom:4px">${t('prediction_month_label')}</div>
    <div>${count ? t('prediction_card_open') : t('prediction_empty')}</div>
    ${guest && count ? `<div style="font-size:11px;color:var(--text-light);margin-top:6px">${t('practice_free_preview').replace('${count}', Math.min(previewCount, count))}</div>` : ''}
    ${guest && count > previewCount ? `<button class="btn btn-outline" style="margin-top:10px;font-size:12px;padding:0 12px;height:32px" onclick="event.stopPropagation();openLoginPrompt()">${t('practice_locked_more')}</button>` : ''}
  </div>
</div>`;
  }).join('');

  const predictionTotal = latestOnly ? latestPredictions : highOnly ? highPredictions : allPredictions;
  const predictionFilterButtons = (currentPage.startsWith('tools-') || currentPage.startsWith('smart-practice-'))
    ? `
  <div class="prediction-filter-bar" style="margin-bottom:14px">
    <button class="btn ${!predictionFilter ? 'btn-primary' : 'btn-outline'}" onclick="navigate('tools-prediction-bank')">${t('prediction_filter_bank')}</button>
    <button class="btn ${predictionFilter === 'high' ? 'btn-primary' : 'btn-outline'}" onclick="navigate('tools-high-frequency')">${t('prediction_filter_high')}</button>
    <button class="btn ${predictionFilter === 'latest' ? 'btn-primary' : 'btn-outline'}" onclick="window.__practicePredictionFilter='latest';setPredictionHighOnly(false);navigate('tools-prediction-bank')">${t('prediction_filter_latest')}</button>
  </div>`
    : '';

  const predictionHtml = `
<section class="practice-section" id="practice-prediction-section">
  <div class="practice-section-title">
    <span style="margin-right:8px">🔥</span>${t('prediction_bank_title')}
    <span>${predictionTotal} ${t('practice_tasks')}</span>
  </div>
  <div style="font-size:13px;color:var(--text-light);margin-bottom:14px">${t('prediction_bank_subtitle')}</div>
  ${predictionFilterButtons}
  ${predictionTotal ? `<div class="practice-tasks-grid">${predictionCards}</div>` : `<div class="prog-empty"><div class="prog-empty-icon">🔥</div><div class="prog-empty-desc">${t('prediction_empty')}</div><div class="prog-empty-desc" style="margin-top:6px">${t('prediction_review_note')}</div></div>`}
</section>`;

  const pageTitle = practiceView === 'speaking'
    ? t('practice_speaking_title')
    : practiceView === 'writing'
      ? t('practice_writing_title')
      : practiceView === 'reading'
        ? t('practice_reading_title')
        : practiceView === 'listening'
          ? t('practice_listening_title')
          : t('practice_heading');
  const pageSubtitle = practiceView === 'speaking'
    ? t('practice_speaking_subtitle')
    : practiceView === 'writing'
      ? t('practice_writing_subtitle')
      : practiceView === 'reading'
        ? t('practice_reading_subtitle')
        : practiceView === 'listening'
          ? t('practice_listening_subtitle')
          : t('practice_subheading');

  $('#page-container').innerHTML = `
<div class="practice-page">
  <div class="page-header">
    <h1>${practiceView === 'prediction' ? t('prediction_bank_title') : pageTitle}</h1>
    <p>${practiceView === 'prediction' ? t('prediction_bank_subtitle') : pageSubtitle}</p>
  </div>
  ${practiceView === 'prediction' ? '' : intro}
  ${practiceView === 'prediction' ? predictionHtml : groupsHtml}
</div>`;

  window.Practice_setTab = function(tab) {
    window.__practiceCategory = tab === 'prediction' ? 'prediction' : 'all';
    window.__practiceTab = tab;
    window.__practicePredictionFilter = false;
    setPredictionHighOnly(false);
    navigate(tab === 'prediction' ? 'tools-prediction-bank' : 'practice-all');
  };

  window.Practice_setPredictionMode = function(setLatest, setHigh) {
    window.__practiceCategory = 'prediction';
    window.__practiceTab = 'prediction';
    window.__practicePredictionFilter = setLatest ? 'latest' : setHigh ? 'high' : false;
    setPredictionHighOnly(!!setHigh);
    navigate(setHigh ? 'tools-high-frequency' : 'tools-prediction-bank');
  };
};

Pages['practice'] = function () {
  if (window.innerWidth <= 640) {
    window.__practiceCategory = 'all';
    if (typeof window.renderPracticeDirectoryPage === 'function') {
      window.renderPracticeDirectoryPage();
      return;
    }
  }

  const currentLang = getAppLang();
  const isMobilePracticeUi = window.innerWidth <= 640;
  const skillCards = [
    {
      key: 'speaking',
      page: 'practice-speaking',
      title: t('label_speaking'),
      desc: t('practice_speaking_desc'),
      icon: '🎤',
      mini: '✦',
      count: DB.readAloud.length + DB.repeatSentence.length + DB.describeImage.length + DB.retellLecture.length + DB.answerShort.length,
      cls: 'speaking',
    },
    {
      key: 'writing',
      page: 'practice-writing',
      title: t('label_writing'),
      desc: t('practice_writing_desc'),
      icon: '✍️',
      mini: '•',
      count: DB.summarizeWritten.length + DB.writeEssay.length,
      cls: 'writing',
    },
    {
      key: 'reading',
      page: 'practice-reading',
      title: t('label_reading'),
      desc: t('practice_reading_desc'),
      icon: '📖',
      mini: '✦',
      count: DB.rwFillBlanks.length + DB.mcSingleReading.length + DB.mcMultipleReading.length + DB.reorderParagraphs.length + DB.rFillBlanks.length,
      cls: 'reading',
    },
    {
      key: 'listening',
      page: 'practice-listening',
      title: t('label_listening'),
      desc: t('practice_listening_desc'),
      icon: '🎧',
      mini: '•',
      count: DB.summarizeSpoken.length + DB.mcSingleListening.length + DB.mcMultipleListening.length + DB.fillBlanksListening.length + DB.highlightSummary.length + DB.selectMissing.length + DB.highlightIncorrect.length + DB.writeDictation.length,
      cls: 'listening',
    },
  ];

  const toolCards = [
    { page: 'tools-prediction-bank', title: t('nav_prediction_bank'), desc: t('home_directory_prediction_desc'), icon: '🔥', count: '' },
    { page: 'tools-high-frequency', title: t('nav_high_frequency'), desc: t('home_directory_high_frequency_desc'), icon: '📈', count: '' },
    { page: 'tools-mistakes', title: t('nav_mistakes'), desc: t('home_directory_mistakes_desc'), icon: '📝', count: '' },
    { page: 'tools-audio-trainer', title: t('nav_audio_trainer'), desc: t('home_directory_audio_desc'), icon: '🎧', count: '' },
  ];

  const breadcrumb = `${t('nav_home')} / ${t('nav_practice')}`;
  const subtitle = t('practice_landing_subtitle');

  const renderCount = (count) => `${count} ${currentLang === 'zh' ? '题' : 'questions'}`;

  $('#page-container').innerHTML = `
<div class="practice-page practice-landing-page">
  <div class="page-header">
    <div class="eyebrow">${breadcrumb}</div>
    <h1>${t('nav_practice')}</h1>
    <p>${subtitle}</p>
    ${isMobilePracticeUi ? `<div class="practice-landing-note">${t('practice_landing_note')}</div>` : ''}
  </div>

  <section class="home-directory-section">
    <div class="home-directory-section-heading">
      <div>
        <div class="eyebrow">${t('home_directory_modules_eyebrow')}</div>
        <h2>${t('home_directory_modules_title')}</h2>
      </div>
      <p>${t('practice_landing_modules_copy')}</p>
    </div>
    <div class="home-directory-grid home-directory-grid-primary practice-entry-grid">
      ${skillCards.map(card => `
        <button class="home-directory-card home-directory-card-primary ${card.cls}" type="button" onclick="navigate('${card.page}')">
          <div class="home-directory-card-top">
            ${isMobilePracticeUi
              ? `<div class="practice-skill-icon-shell ${card.cls}">
                  <div class="home-directory-card-icon">${card.icon}</div>
                  <span class="practice-skill-icon-mini">${card.mini}</span>
                </div>`
              : `<div class="home-directory-card-icon">${card.icon}</div>`}
            <div class="home-directory-card-stat">${renderCount(card.count)}</div>
          </div>
          <h3>${card.title}</h3>
          <p>${card.desc}</p>
        </button>
      `).join('')}
    </div>
  </section>

  <section class="home-directory-section">
    <div class="home-directory-section-heading">
      <div>
        <div class="eyebrow">${t('home_directory_smart_eyebrow')}</div>
        <h2>${t('home_directory_smart_title')}</h2>
      </div>
      <p>${t('home_directory_smart_copy')}</p>
    </div>
    <div class="home-directory-grid home-directory-grid-tools practice-entry-grid-tools">
      ${toolCards.map(card => `
        <button class="home-directory-card home-directory-card-tool" type="button" onclick="navigate('${card.page}')">
          <div class="home-directory-card-top">
            <div class="home-directory-card-icon">${card.icon}</div>
            ${card.count ? `<div class="home-directory-card-stat">${card.count}</div>` : ''}
          </div>
          <h3>${card.title}</h3>
          <p>${card.desc}</p>
        </button>
      `).join('')}
    </div>
  </section>
</div>`;
};
