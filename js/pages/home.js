Pages.home = function () {
  const isLoggedIn = !!(window.AppAuth && AppAuth.isLoggedIn());
  const currentLang = getAppLang();
  const isEn = currentLang === 'en';
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

  // Calculate today's practice count and streak
  const allHistory = Object.values(Stats.get())
    .flatMap(s => s.history || []);
  const todayStr = new Date().toDateString();
  const todayCount = allHistory.filter(h => new Date(h.date).toDateString() === todayStr).length;

  // Streak: count consecutive days with at least 1 attempt
  const uniqueDays = [...new Set(allHistory.map(h => new Date(h.date).toDateString()))];
  let streak = 0;
  const d = new Date();
  while (true) {
    if (uniqueDays.includes(d.toDateString())) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else { break; }
  }

  // ── Mobile rendering ────────────────────────────────────────────────────────
  if (isMobile) {
    const hour = new Date().getHours();
    const greeting = currentLang === 'zh'
      ? (hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好')
      : (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');
    const userName = window.AppProfile?.getDisplayName
      ? AppProfile.getDisplayName(AppAuth?.user, currentLang)
      : (AppAuth?.user?.email?.split('@')[0] || (currentLang === 'zh' ? '同学' : 'there'));

    // avg score from stats
    const allScores = Object.values(Stats.get())
      .flatMap(s => (s.history || []).map(h => h.score).filter(sc => typeof sc === 'number' && sc > 0));
    const avgScore = allScores.length
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : '—';

    const speakCount = DB.readAloud.length + DB.repeatSentence.length + (getDiTemplates().length || DB.describeImage.length) + DB.retellLecture.length + DB.answerShort.length;
    const writeCount = DB.summarizeWritten.length + DB.writeEssay.length;
    const readCount  = DB.rwFillBlanks.length + DB.mcSingleReading.length + DB.mcMultipleReading.length + DB.reorderParagraphs.length + DB.rFillBlanks.length;
    const listenCount = DB.summarizeSpoken.length + DB.mcSingleListening.length + DB.mcMultipleListening.length + DB.fillBlanksListening.length + DB.highlightSummary.length + DB.selectMissing.length + DB.highlightIncorrect.length + DB.writeDictation.length;

    $('#page-container').innerHTML = `
<div class="mob-page">

  <!-- HERO -->
  <div class="mob-hero">
    <div class="mob-hero-deco mob-hero-deco-1"></div>
    <div class="mob-hero-deco mob-hero-deco-2"></div>
    <div class="mob-hero-greeting">${greeting}，${userName} 👋</div>
    <div class="mob-hero-title">${currentLang === 'zh' ? '今天继续练习' : 'Keep practicing today'}</div>
    <div class="mob-stats-row">
      <div class="mob-stat-pill">
        <div class="mob-stat-val accent">${todayCount}</div>
        <div class="mob-stat-label">${currentLang === 'zh' ? '今日已练题' : 'Today'}</div>
      </div>
      <div class="mob-stat-pill">
        <div class="mob-stat-val">${streak}</div>
        <div class="mob-stat-label">${currentLang === 'zh' ? '连续学习天' : 'Day streak'}</div>
      </div>
      <div class="mob-stat-pill">
        <div class="mob-stat-val accent">${avgScore}</div>
        <div class="mob-stat-label">${currentLang === 'zh' ? '当前均分' : 'Avg score'}</div>
      </div>
    </div>
  </div>

  <!-- TODAY TASK STRIP -->
  <div class="mob-task-strip">
    <div class="mob-task-left">
      <div class="mob-task-label">${currentLang === 'zh' ? '今日推荐' : 'Recommended'}</div>
      <div class="mob-task-name">Speaking + Dictation</div>
      <div class="mob-task-sub">${currentLang === 'zh' ? '从口语开始练习' : 'Start with speaking'}</div>
    </div>
    <button class="mob-task-btn" onclick="navigate('practice-speaking')">${currentLang === 'zh' ? '开始练习' : 'Start'}</button>
  </div>

  <div class="mob-content">

    <!-- FOUR SKILLS -->
    <section>
      <div class="mob-section-label">
        ${currentLang === 'zh' ? '四大技能' : 'Four Skills'}
        <a onclick="navigate('practice-all')" style="cursor:pointer">${currentLang === 'zh' ? '全部 ›' : 'All ›'}</a>
      </div>
      <div class="mob-skills-grid">
        <div class="mob-skill-card" onclick="navigate('practice-speaking')">
          <div class="mob-skill-bar" style="background:linear-gradient(90deg,#3b82f6,#60a5fa)"></div>
          <div class="mob-skill-icon" style="background:#eff6ff">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </div>
          <div>
            <div class="mob-skill-name">${currentLang === 'zh' ? '口语' : 'Speaking'}</div>
            <div class="mob-skill-count">${speakCount} ${currentLang === 'zh' ? '题' : 'q'}</div>
          </div>
          <div class="mob-skill-tags">RA · RS · DI · RL · ASQ</div>
          <span class="mob-skill-arrow">›</span>
        </div>
        <div class="mob-skill-card" onclick="navigate('practice-writing')">
          <div class="mob-skill-bar" style="background:linear-gradient(90deg,#f59e0b,#fbbf24)"></div>
          <div class="mob-skill-icon" style="background:#fffbeb">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div>
            <div class="mob-skill-name">${currentLang === 'zh' ? '写作' : 'Writing'}</div>
            <div class="mob-skill-count">${writeCount} ${currentLang === 'zh' ? '题' : 'q'}</div>
          </div>
          <div class="mob-skill-tags">SWT · WFD · Essay</div>
          <span class="mob-skill-arrow">›</span>
        </div>
        <div class="mob-skill-card" onclick="navigate('practice-reading')">
          <div class="mob-skill-bar" style="background:linear-gradient(90deg,#10b981,#34d399)"></div>
          <div class="mob-skill-icon" style="background:#ecfdf5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <div>
            <div class="mob-skill-name">${currentLang === 'zh' ? '阅读' : 'Reading'}</div>
            <div class="mob-skill-count">${readCount} ${currentLang === 'zh' ? '题' : 'q'}</div>
          </div>
          <div class="mob-skill-tags">RO · MCQ · FIB</div>
          <span class="mob-skill-arrow">›</span>
        </div>
        <div class="mob-skill-card" onclick="navigate('practice-listening')">
          <div class="mob-skill-bar" style="background:linear-gradient(90deg,#8b5cf6,#a78bfa)"></div>
          <div class="mob-skill-icon" style="background:#f5f3ff">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
          </div>
          <div>
            <div class="mob-skill-name">${currentLang === 'zh' ? '听力' : 'Listening'}</div>
            <div class="mob-skill-count">${listenCount} ${currentLang === 'zh' ? '题' : 'q'}</div>
          </div>
          <div class="mob-skill-tags">SST · MCM · FIB · HIW</div>
          <span class="mob-skill-arrow">›</span>
        </div>
      </div>
    </section>

    <!-- QUICK ACCESS -->
    <section>
      <div class="mob-section-label">${currentLang === 'zh' ? '高效刷题' : 'Quick Access'}</div>
      <div class="mob-quick-grid">
        <div class="mob-quick-card" onclick="navigate('tools-prediction-bank')">
          <div class="mob-quick-icon" style="background:#fff7ed">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div class="mob-quick-text">
            <div class="mob-quick-name">${currentLang === 'zh' ? '预测题库' : 'Predictions'}</div>
            <div class="mob-quick-sub">${currentLang === 'zh' ? '最新考题预测' : 'Latest exam tips'}</div>
          </div>
        </div>
        <div class="mob-quick-card" onclick="navigate('tools-high-frequency')">
          <div class="mob-quick-icon" style="background:#eff6ff">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div class="mob-quick-text">
            <div class="mob-quick-name">${currentLang === 'zh' ? '高频题' : 'High Freq'}</div>
            <div class="mob-quick-sub">${currentLang === 'zh' ? '高频必练题型' : 'Must-do questions'}</div>
          </div>
        </div>
        <div class="mob-quick-card" onclick="navigate('tools-mistakes')">
          <div class="mob-quick-icon" style="background:#fef2f2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          </div>
          <div class="mob-quick-text">
            <div class="mob-quick-name">${currentLang === 'zh' ? '错题本' : 'Mistakes'}</div>
            <div class="mob-quick-sub">${currentLang === 'zh' ? '巩固薄弱项' : 'Review weak areas'}</div>
          </div>
        </div>
        <div class="mob-quick-card" onclick="navigate('tools-audio-trainer')">
          <div class="mob-quick-icon" style="background:#f5f3ff">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
          </div>
          <div class="mob-quick-text">
            <div class="mob-quick-name">${currentLang === 'zh' ? '语音训练' : 'Audio Trainer'}</div>
            <div class="mob-quick-sub">${currentLang === 'zh' ? '口语跟读训练' : 'Pronunciation drills'}</div>
          </div>
        </div>
        <div class="mob-quick-card" onclick="navigate('mock-test')">
          <div class="mob-quick-icon" style="background:#eff6ff">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
          </div>
          <div class="mob-quick-text">
            <div class="mob-quick-name">${currentLang === 'zh' ? '完整模考' : 'Mock Test'}</div>
            <div class="mob-quick-sub">${currentLang === 'zh' ? '全真考试流程' : 'Full exam simulation'}</div>
          </div>
        </div>
      </div>
    </section>

    ${!isLoggedIn ? `
    <section>
      <div style="background:linear-gradient(135deg,#0f1d36,#1e3560);border-radius:18px;padding:20px;text-align:center">
        <div style="color:#fff;font-size:15px;font-weight:700;margin-bottom:6px">${currentLang === 'zh' ? '登录解锁全部功能' : 'Sign in to unlock all'}</div>
        <div style="color:rgba(255,255,255,.6);font-size:12px;margin-bottom:16px">${currentLang === 'zh' ? 'AI 评分 · 进度追踪 · 云端同步' : 'AI scoring · Progress · Sync'}</div>
        <button class="mob-task-btn" style="margin:0 auto" onclick="AuthUI.open('login')">${currentLang === 'zh' ? '立即登录' : 'Sign In'}</button>
      </div>
    </section>` : ''}

  </div>
</div>`;
    return;
  }
  // ── End mobile rendering ────────────────────────────────────────────────────

  const todayLabel = currentLang === 'zh' ? '今日已练' : 'Today';
  const streakLabel = currentLang === 'zh' ? '连续学习' : 'Streak';
  const questionsLabel = currentLang === 'zh' ? '题' : 'q';
  const daysLabel = currentLang === 'zh' ? '天' : 'd';

  const progressBanner = `
    <div class="home-progress-banner">
      <div class="home-progress-stat">
        <span class="home-progress-num">${todayCount}</span>
        <span class="home-progress-label">${todayLabel} ${questionsLabel}</span>
      </div>
      <div class="home-progress-divider"></div>
      <div class="home-progress-stat">
        <span class="home-progress-num">${streak}</span>
        <span class="home-progress-label">${streakLabel} ${daysLabel}</span>
      </div>
    </div>
  `;

  const moduleCards = [
    {
      icon: '🎤',
      title: t('label_speaking'),
      desc: t('home_module_speaking_desc'),
      mobileDesc: 'RA · RS · DI · RL · ASQ',
      page: 'practice-speaking',
      tone: 'speaking',
      stat: `${DB.readAloud.length + DB.repeatSentence.length + (getDiTemplates().length || DB.describeImage.length) + DB.retellLecture.length + DB.answerShort.length} ${t('practice_questions')}`,
    },
    {
      icon: '✍️',
      title: t('label_writing'),
      desc: t('home_module_writing_desc'),
      mobileDesc: 'SWT · WFD · Essay',
      page: 'practice-writing',
      tone: 'writing',
      stat: `${DB.summarizeWritten.length + DB.writeEssay.length} ${t('practice_questions')}`,
    },
    {
      icon: '📖',
      title: t('label_reading'),
      desc: t('home_module_reading_desc'),
      mobileDesc: 'RO · MCQ · FIB',
      page: 'practice-reading',
      tone: 'reading',
      stat: `${DB.rwFillBlanks.length + DB.mcSingleReading.length + DB.mcMultipleReading.length + DB.reorderParagraphs.length + DB.rFillBlanks.length} ${t('practice_questions')}`,
    },
    {
      icon: '🎧',
      title: t('label_listening'),
      desc: t('home_module_listening_desc'),
      mobileDesc: 'SST · MCM · FIB · HIW',
      page: 'practice-listening',
      tone: 'listening',
      stat: `${DB.summarizeSpoken.length + DB.mcSingleListening.length + DB.mcMultipleListening.length + DB.fillBlanksListening.length + DB.highlightSummary.length + DB.selectMissing.length + DB.highlightIncorrect.length + DB.writeDictation.length} ${t('practice_questions')}`,
    },
  ];

  const smartCards = [
    { icon: '🔥', title: t('nav_prediction_bank'), desc: t('home_directory_prediction_desc'), mobileDesc: currentLang === 'zh' ? '最新考题预测' : 'Latest predictions', page: 'tools-prediction-bank' },
    { icon: '⬆️', title: t('nav_high_frequency'), desc: t('home_directory_high_frequency_desc'), mobileDesc: currentLang === 'zh' ? '高频必练题型' : 'Must-do questions', page: 'tools-high-frequency' },
    { icon: '📝', title: t('nav_mistakes'), desc: t('home_directory_mistakes_desc'), mobileDesc: currentLang === 'zh' ? '巩固薄弱项' : 'Review weak areas', page: 'tools-mistakes' },
    { icon: '🎙️', title: t('nav_audio_trainer'), desc: t('home_directory_audio_desc'), mobileDesc: currentLang === 'zh' ? '口语跟读训练' : 'Pronunciation drills', page: 'tools-audio-trainer' },
  ];

  const toolCards = [
    { icon: '🧪', title: t('nav_mock_test'), desc: t('home_directory_mock_desc'), mobileDesc: currentLang === 'zh' ? '全真模拟测试' : 'Full mock exam', page: 'mock-test' },
    { icon: '📊', title: t('nav_progress'), desc: t('home_directory_progress_desc'), mobileDesc: currentLang === 'zh' ? '学习数据报告' : 'Learning analytics', page: 'progress' },
    { icon: '🗓️', title: t('nav_study_plan'), desc: t('home_directory_plan_desc'), mobileDesc: currentLang === 'zh' ? '个性化备考计划' : 'Personalised plan', page: 'study-plan' },
  ];

  const renderCards = (items, variant = 'default') => items.map(item => `
    <article class="home-directory-card home-directory-card-${variant}${item.tone ? ` ${item.tone}` : ''}" onclick="navigate('${item.page}')">
      <div class="home-directory-card-main">
        <div class="home-directory-card-top">
          <div class="home-directory-card-icon">${item.icon}</div>
          <div>
            <h3>${item.title}</h3>
            ${item.stat ? `<div class="home-directory-card-stat">${item.stat}</div>` : ''}
            ${item.mobileDesc ? `<div class="home-directory-card-mini-desc">${item.mobileDesc}</div>` : ''}
          </div>
        </div>
        <p>${item.desc}</p>
      </div>
    </article>
  `).join('');

  const pageTitle = isLoggedIn ? t('home_title') : t('hero_title_guest').replace('\n', '<br>');
  const pageSubtitle = isLoggedIn ? t('home_directory_subtitle') : t('hero_subtitle_guest');

  const guestTeaser = !isLoggedIn ? `
    <section class="home-zone home-directory-teaser">
      <div class="login-teaser">
        <div class="login-teaser-body">
          <div class="login-teaser-eyebrow">${isEn ? 'Free · No credit card required' : '免费 · 无需信用卡'}</div>
          <div class="login-teaser-title">${t('teaser_title')}</div>
          <ul class="login-teaser-features">
            <li>${isEn ? 'Save scores' : '保存分数'}</li>
            <li>${isEn ? 'Structured AI feedback' : '结构化 AI 反馈'}</li>
            <li>${isEn ? 'Practice history' : '练习历史'}</li>
            <li>${isEn ? 'Track progress' : '追踪进度'}</li>
          </ul>
        </div>
        <div class="login-teaser-actions">
          <button class="btn btn-primary" onclick="AuthUI.open('login')">${t('btn_sign_in_google')}</button>
          <button class="btn btn-outline" onclick="navigate('practice-speaking')">${t('btn_continue_guest')}</button>
        </div>
      </div>
    </section>
  ` : '';

  $('#page-container').innerHTML = `
<div class="home-dashboard-shell home-directory-shell">
  <div class="page-header home-dashboard-header dashboard-header home-directory-header">
    <div>
      <div class="eyebrow">${isLoggedIn ? t('home_header_eyebrow') : t('hero_eyebrow')}</div>
      <h1>${pageTitle}</h1>
      <p>${pageSubtitle}</p>
    </div>
    <div class="lang-toggle home-lang-desktop" role="tablist" aria-label="Language switcher">
      <button class="lang-btn ${currentLang === 'zh' ? 'active' : ''}" onclick="setAppLang('zh')">中文</button>
      <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" onclick="setAppLang('en')">EN</button>
    </div>
  </div>

  ${guestTeaser}

  ${progressBanner}

  <section class="home-zone home-directory-section home-directory-section-hero">
    <div class="home-directory-section-heading">
      <div>
        <h2>${t('home_directory_modules_title')}</h2>
        <p>${t('home_directory_modules_copy')}</p>
      </div>
    </div>
    <div class="home-directory-grid home-directory-grid-primary">
      ${renderCards(moduleCards, 'primary')}
    </div>
  </section>

  <section class="home-zone home-directory-section">
    <div class="home-directory-section-heading">
      <div>
        <div class="eyebrow">${t('home_directory_smart_eyebrow')}</div>
        <h2>${t('home_directory_smart_title')}</h2>
        <p>${t('home_directory_smart_copy')}</p>
      </div>
    </div>
    <div class="home-directory-grid home-directory-grid-secondary">
      ${renderCards(smartCards, 'secondary')}
    </div>
  </section>

  <section class="home-zone home-directory-section">
    <div class="home-directory-section-heading">
      <div>
        <div class="eyebrow">${t('home_directory_tools_eyebrow')}</div>
        <h2>${t('home_directory_tools_title')}</h2>
        <p>${t('home_directory_tools_copy')}</p>
      </div>
    </div>
    <div class="home-directory-grid home-directory-grid-tools">
      ${renderCards(toolCards, 'tool')}
    </div>
  </section>

</div>`;
};
