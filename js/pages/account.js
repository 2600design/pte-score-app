const EXAM_PROFILE_STORAGE_KEY = 'pte_exam_profile';

function getExamProfile() {
  try {
    const parsed = JSON.parse(localStorage.getItem(EXAM_PROFILE_STORAGE_KEY) || '{}');
    return {
      examDate: parsed.examDate || '',
      targetScore: parsed.targetScore || '79+',
    };
  } catch (_error) {
    return { examDate: '', targetScore: '79+' };
  }
}

function saveExamProfile(profile) {
  localStorage.setItem(EXAM_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

function getProfileDisplayName(userEmail, currentLang) {
  if (window.AppProfile?.getDisplayName) return AppProfile.getDisplayName(AppAuth?.user, currentLang);
  return userEmail !== '—' ? userEmail.split('@')[0] : (currentLang === 'zh' ? '同学' : 'Guest');
}

function getProfileInitial(userEmail, currentLang) {
  if (window.AppProfile?.getInitial) return AppProfile.getInitial(AppAuth?.user, currentLang);
  return getProfileDisplayName(userEmail, currentLang).charAt(0).toUpperCase();
}

function renderProfileAvatar(userEmail, currentLang) {
  return getProfileInitial(userEmail, currentLang);
}

function ensureProfileModal() {
  if (document.getElementById('profile-modal-overlay')) return;
  document.body.insertAdjacentHTML('beforeend', `
<div id="profile-modal-overlay" class="exam-goal-modal-overlay hidden" onclick="AccountSettings_closeProfileModal(event)">
  <div class="exam-goal-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" onclick="event.stopPropagation()">
    <button class="exam-goal-close" type="button" onclick="AccountSettings_closeProfileModal()" aria-label="Close">×</button>
    <div class="exam-goal-header">
      <div id="profile-modal-title" class="exam-goal-title"></div>
      <div id="profile-modal-copy" class="exam-goal-copy"></div>
    </div>
    <label class="exam-goal-field">
      <span id="profile-name-label"></span>
      <input id="profile-name-input" type="text" maxlength="24">
    </label>
    <div class="exam-goal-actions">
      <button id="profile-cancel" class="btn btn-secondary" type="button" onclick="AccountSettings_closeProfileModal()"></button>
      <button id="profile-save" class="btn btn-primary" type="button" onclick="AccountSettings_saveProfile()"></button>
    </div>
  </div>
</div>`);

}

function ensureExamGoalModal() {
  if (document.getElementById('exam-goal-modal-overlay')) return;
  document.body.insertAdjacentHTML('beforeend', `
<div id="exam-goal-modal-overlay" class="exam-goal-modal-overlay hidden" onclick="AccountSettings_closeExamGoalModal(event)">
  <div class="exam-goal-modal" role="dialog" aria-modal="true" aria-labelledby="exam-goal-title" onclick="event.stopPropagation()">
    <button class="exam-goal-close" type="button" onclick="AccountSettings_closeExamGoalModal()" aria-label="Close">×</button>
    <div class="exam-goal-header">
      <div id="exam-goal-title" class="exam-goal-title"></div>
      <div id="exam-goal-copy" class="exam-goal-copy"></div>
    </div>
    <label class="exam-goal-field">
      <span id="exam-goal-date-label"></span>
      <input id="exam-goal-date-input" type="date">
    </label>
    <label class="exam-goal-field">
      <span id="exam-goal-score-label"></span>
      <input id="exam-goal-score-input" type="text" maxlength="8" placeholder="79+">
    </label>
    <div class="exam-goal-actions">
      <button id="exam-goal-cancel" class="btn btn-secondary" type="button" onclick="AccountSettings_closeExamGoalModal()"></button>
      <button id="exam-goal-save" class="btn btn-primary" type="button" onclick="AccountSettings_saveExamGoal()"></button>
    </div>
  </div>
</div>`);
}

function formatExamDate(dateStr, lang) {
  if (!dateStr) return lang === 'zh' ? '未设置考试时间' : 'Exam date not set';
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return lang === 'zh'
    ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    : date.toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getDaysUntilExam(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  const examDate = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(examDate.getTime())) return null;
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfExam = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate());
  return Math.ceil((startOfExam - startOfToday) / 86400000);
}

function renderExamCountdown(profile, currentLang) {
  const daysLeft = getDaysUntilExam(profile.examDate);
  const dateLabel = formatExamDate(profile.examDate, currentLang);
  const daysCopy = daysLeft == null
    ? (currentLang === 'zh' ? '待设置' : 'Not set')
    : daysLeft < 0
      ? (currentLang === 'zh' ? '已考试' : 'Completed')
      : currentLang === 'zh'
        ? `${daysLeft} 天`
        : `${daysLeft} days`;

  return `
    <div style="margin-top:16px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:16px 18px;display:grid;grid-template-columns:1fr 1px 110px;gap:14px;align-items:center;">
      <div>
        <div style="font-size:12px;color:rgba(255,255,255,.65);margin-bottom:4px">${currentLang === 'zh' ? '距离考试' : 'Days to exam'}</div>
        <div style="font-size:24px;line-height:1.05;font-weight:800;color:#fff;margin-bottom:6px">${daysCopy}</div>
        <div style="font-size:13px;color:rgba(255,255,255,.62)">${dateLabel}</div>
      </div>
      <div style="width:1px;height:52px;background:rgba(255,255,255,.12)"></div>
      <div style="text-align:right">
        <div style="font-size:12px;color:rgba(255,255,255,.65);margin-bottom:4px">${currentLang === 'zh' ? '目标分数' : 'Target score'}</div>
        <div style="font-size:24px;line-height:1.05;font-weight:800;color:#f8c15c">${profile.targetScore || '79+'}</div>
      </div>
    </div>
  `;
}

function ensureDeleteAccountDialog() {
  if (document.getElementById('delete-account-overlay')) return;
  document.body.insertAdjacentHTML('beforeend', `
<div id="delete-account-overlay" class="logout-dialog-overlay hidden" onclick="AccountSettings_closeDeleteAccountDialog(event)">
  <div id="delete-account-dialog" class="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-account-title" tabindex="-1" onclick="event.stopPropagation()">
    <button class="logout-dialog-close" type="button" onclick="AccountSettings_closeDeleteAccountDialog()" aria-label="Close">×</button>
    <div class="logout-dialog-body">
      <h2 id="delete-account-title" class="logout-dialog-title"></h2>
      <p id="delete-account-copy" class="logout-dialog-copy"></p>
    </div>
    <div class="logout-dialog-actions">
      <button id="delete-account-cancel" class="btn btn-secondary" type="button" onclick="AccountSettings_closeDeleteAccountDialog()"></button>
      <button id="delete-account-confirm" class="btn btn-danger" type="button" onclick="AccountSettings_confirmDeleteAccount()"></button>
    </div>
  </div>
</div>`);
}

window.AccountSettings_requestDeleteAccount = function() {
  const lang = typeof getAppLang === 'function' ? getAppLang() : 'en';
  ensureDeleteAccountDialog();
  const title = document.getElementById('delete-account-title');
  const copy = document.getElementById('delete-account-copy');
  const cancel = document.getElementById('delete-account-cancel');
  const confirm = document.getElementById('delete-account-confirm');
  if (title) title.textContent = typeof t === 'function' ? t('delete_account_dialog_title') : 'Delete Account?';
  if (copy) copy.textContent = typeof t === 'function' ? t('delete_account_dialog_copy') : 'This is permanent and cannot be undone.';
  if (cancel) cancel.textContent = lang === 'zh' ? '取消' : 'Cancel';
  if (confirm) { confirm.textContent = lang === 'zh' ? '确认删除' : 'Delete'; confirm.disabled = false; }
  const overlay = document.getElementById('delete-account-overlay');
  if (overlay) overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setTimeout(() => document.getElementById('delete-account-dialog')?.focus(), 20);
};

window.AccountSettings_closeDeleteAccountDialog = function(event) {
  if (event && event.target?.id !== 'delete-account-overlay' && event.type === 'click') return;
  const overlay = document.getElementById('delete-account-overlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

window.AccountSettings_confirmDeleteAccount = async function() {
  const lang = typeof getAppLang === 'function' ? getAppLang() : 'en';
  const confirm = document.getElementById('delete-account-confirm');
  const cancel = document.getElementById('delete-account-cancel');
  const deletingText = typeof t === 'function' ? t('delete_account_deleting') : 'Deleting...';
  const confirmText = typeof t === 'function' ? t('delete_account_confirm') : (lang === 'zh' ? '确认删除' : 'Delete');
  let didSucceed = false;

  if (confirm) {
    confirm.disabled = true;
    confirm.textContent = deletingText;
  }
  if (cancel) cancel.disabled = true;

  try {
    await AppAuth.deleteAccount();

    try { localStorage.clear(); } catch (_error) {}
    try { sessionStorage.clear(); } catch (_error) {}
    try {
      const client = window.SupabaseService?.getClient?.();
      if (client) await client.auth.signOut().catch(() => {});
    } catch (_error) {}

    didSucceed = true;
    const overlay = document.getElementById('delete-account-overlay');
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    if (typeof showToast === 'function') showToast(typeof t === 'function' ? t('delete_account_success') : 'Account deleted.');
    setTimeout(() => {
      if (typeof navigate === 'function') {
        navigate('home');
      } else {
        window.location.href = '/';
      }
    }, 300);
  } catch (err) {
    if (typeof showToast === 'function') showToast(typeof t === 'function' ? t('delete_account_error') : 'Failed to delete account.');
    console.error('[DeleteAccount]', err);
  } finally {
    if (!didSucceed) {
      if (confirm) {
        confirm.disabled = false;
        confirm.textContent = confirmText;
      }
      if (cancel) cancel.disabled = false;
    }
  }
};

window.AccountSettings_editExamGoal = function() {
  const currentLang = typeof getAppLang === 'function' ? getAppLang() : 'zh';
  const current = getExamProfile();
  ensureExamGoalModal();
  const overlay = document.getElementById('exam-goal-modal-overlay');
  const dateInput = document.getElementById('exam-goal-date-input');
  const scoreInput = document.getElementById('exam-goal-score-input');
  const title = document.getElementById('exam-goal-title');
  const copy = document.getElementById('exam-goal-copy');
  const dateLabel = document.getElementById('exam-goal-date-label');
  const scoreLabel = document.getElementById('exam-goal-score-label');
  const cancel = document.getElementById('exam-goal-cancel');
  const save = document.getElementById('exam-goal-save');
  if (!overlay || !dateInput || !scoreInput) return;

  title.textContent = currentLang === 'zh' ? '编辑考试目标' : 'Edit exam goal';
  copy.textContent = currentLang === 'zh' ? '设置考试时间和目标分数' : 'Set your exam date and target score';
  dateLabel.textContent = currentLang === 'zh' ? '考试日期' : 'Exam date';
  scoreLabel.textContent = currentLang === 'zh' ? '目标分数' : 'Target score';
  cancel.textContent = currentLang === 'zh' ? '取消' : 'Cancel';
  save.textContent = currentLang === 'zh' ? '保存' : 'Save';
  dateInput.value = current.examDate || '';
  scoreInput.value = current.targetScore || '79+';
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setTimeout(() => dateInput.focus(), 0);
};

window.AccountSettings_closeExamGoalModal = function() {
  const overlay = document.getElementById('exam-goal-modal-overlay');
  if (!overlay) return;
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

window.AccountSettings_editProfile = function(focusField = '') {
  const currentLang = typeof getAppLang === 'function' ? getAppLang() : 'zh';
  const userEmail = AppAuth?.user?.email || '—';
  ensureProfileModal();
  const overlay = document.getElementById('profile-modal-overlay');
  const title = document.getElementById('profile-modal-title');
  const copy = document.getElementById('profile-modal-copy');
  const nameLabel = document.getElementById('profile-name-label');
  const nameInput = document.getElementById('profile-name-input');
  const cancel = document.getElementById('profile-cancel');
  const save = document.getElementById('profile-save');
  if (!overlay || !nameInput) return;

  title.textContent = currentLang === 'zh' ? '编辑个人资料' : 'Edit profile';
  copy.textContent = currentLang === 'zh' ? '修改用户名' : 'Update your display name';
  nameLabel.textContent = currentLang === 'zh' ? '用户名' : 'Display name';
  cancel.textContent = currentLang === 'zh' ? '取消' : 'Cancel';
  save.textContent = currentLang === 'zh' ? '保存' : 'Save';
  nameInput.value = getProfileDisplayName(userEmail, currentLang);
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setTimeout(() => {
    nameInput.focus();
  }, 0);
};

window.AccountSettings_closeProfileModal = function() {
  const overlay = document.getElementById('profile-modal-overlay');
  if (!overlay) return;
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

window.AccountSettings_saveProfile = function() {
  const currentLang = typeof getAppLang === 'function' ? getAppLang() : 'zh';
  const userEmail = AppAuth?.user?.email || '—';
  const nameInput = document.getElementById('profile-name-input');
  if (!nameInput || !window.AppProfile?.save) return;
  const displayName = String(nameInput.value || '').trim() || getProfileDisplayName(userEmail, currentLang);
  AppProfile.save({
    displayName,
  });
  window.AccountSettings_closeProfileModal();
};

window.AccountSettings_saveExamGoal = function() {
  const currentLang = typeof getAppLang === 'function' ? getAppLang() : 'zh';
  const dateInput = document.getElementById('exam-goal-date-input');
  const scoreInput = document.getElementById('exam-goal-score-input');
  if (!dateInput || !scoreInput) return;

  const trimmedDate = String(dateInput.value || '').trim();
  const trimmedScore = String(scoreInput.value || '').trim() || '79+';
  if (trimmedDate && !/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
    window.alert(currentLang === 'zh' ? '日期格式需要是 YYYY-MM-DD' : 'Date format must be YYYY-MM-DD');
    return;
  }

  saveExamProfile({
    examDate: trimmedDate,
    targetScore: trimmedScore,
  });
  window.AccountSettings_closeExamGoalModal();
  if (typeof Pages !== 'undefined' && typeof Pages['account-settings'] === 'function') {
    Pages['account-settings']();
  }
};

Pages['account-settings'] = function () {
  const isLoggedIn = !!(window.AppAuth && AppAuth.isLoggedIn());
  const userEmail = AppAuth?.user?.email || '—';
  const micLabel = window.MicAccess ? MicAccess.getStatusLabel() : 'Unknown';
  const micState = window.MicAccess ? MicAccess.permissionState : 'prompt';
  const isMobile = window.innerWidth <= 640;
  const currentLang = getAppLang();
  const examProfile = getExamProfile();

  // ── Mobile rendering ──────────────────────────────────────────────────────
  if (isMobile) {
    const allHistory = Object.values(Stats.get()).flatMap(s => s.history || []);
    const todayStr = new Date().toDateString();
    const todayCount = allHistory.filter(h => new Date(h.date).toDateString() === todayStr).length;
    const uniqueDays = [...new Set(allHistory.map(h => new Date(h.date).toDateString()))];
    let streak = 0; const dd = new Date();
    while (uniqueDays.includes(dd.toDateString())) { streak++; dd.setDate(dd.getDate() - 1); }
    const totalAttempts = allHistory.length;
    const allScores = allHistory.map(h => h.score).filter(sc => typeof sc === 'number' && sc > 0);
    const avgScore = allScores.length ? Math.round(allScores.reduce((a,b)=>a+b,0)/allScores.length) : '—';
    const userName = getProfileDisplayName(userEmail, currentLang);

    const skillStats = [
      { key: 'readAloud',    label: currentLang === 'zh' ? '口语 Speaking' : 'Speaking', color: '#3b82f6' },
      { key: 'summarizeWritten', label: currentLang === 'zh' ? '写作 Writing' : 'Writing', color: '#f59e0b' },
      { key: 'rwFillBlanks', label: currentLang === 'zh' ? '阅读 Reading'  : 'Reading',  color: '#10b981' },
      { key: 'writeDictation',label: currentLang === 'zh' ? '听力 Listening': 'Listening',color: '#8b5cf6' },
    ].map(s => {
      const avg = Stats.getAvg(s.key) || 0;
      const cnt = (Stats.get()[s.key]?.history || []).length;
      return `<div style="display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:13px;font-weight:500;color:#0f1d36;display:flex;align-items:center;gap:6px">
            <span style="width:8px;height:8px;border-radius:50%;background:${s.color};display:inline-block"></span>
            ${s.label}
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:13px;font-weight:700;color:${s.color}">${avg || '—'}</span>
            <span style="font-size:11px;color:#64748b">${cnt}${currentLang === 'zh' ? '题' : 'q'}</span>
          </div>
        </div>
        <div style="height:5px;background:#edf0f7;border-radius:999px;overflow:hidden">
          <div style="height:100%;width:${avg}%;background:${s.color};border-radius:999px"></div>
        </div>
      </div>`;
    }).join('');

    $('#page-container').innerHTML = `
<div class="mob-page">
  <div class="mob-profile-hero">
    <div class="mob-user-row">
      <div class="mob-user-avatar">${renderProfileAvatar(userEmail, currentLang)}</div>
      <div style="flex:1;min-width:0">
        <div class="mob-user-name">${userName}</div>
        <div class="mob-user-email">${userEmail}</div>
      </div>
      <button onclick="AccountSettings_editProfile()" style="background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);border-radius:12px;color:#fff;font-size:12px;font-weight:600;padding:6px 12px;cursor:pointer">${currentLang === 'zh' ? '编辑' : 'Edit'}</button>
    </div>
    ${renderExamCountdown(examProfile, currentLang)}
  </div>

  <div class="mob-content">

    <!-- 学习概览 -->
    <section>
      <div style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">${currentLang === 'zh' ? '学习概览' : 'Overview'}</div>
      <div class="mob-stats-grid">
        <div class="mob-stat-card">
          <div class="mob-stat-card-icon">⭐</div>
          <div class="mob-stat-card-val accent">${avgScore}</div>
          <div class="mob-stat-card-label">${currentLang === 'zh' ? '当前平均分' : 'Avg score'}</div>
        </div>
        <div class="mob-stat-card">
          <div class="mob-stat-card-icon">📚</div>
          <div class="mob-stat-card-val">${totalAttempts}</div>
          <div class="mob-stat-card-label">${currentLang === 'zh' ? '总练习次数' : 'Total attempts'}</div>
        </div>
        <div class="mob-stat-card">
          <div class="mob-stat-card-icon">🔥</div>
          <div class="mob-stat-card-val accent">${streak}</div>
          <div class="mob-stat-card-label">${currentLang === 'zh' ? '连续打卡天数' : 'Day streak'}</div>
        </div>
        <div class="mob-stat-card">
          <div class="mob-stat-card-icon">✅</div>
          <div class="mob-stat-card-val">${todayCount}</div>
          <div class="mob-stat-card-label">${currentLang === 'zh' ? '今日练题数' : 'Today'}</div>
        </div>
      </div>
    </section>

    <!-- 题型分析 -->
    <section>
      <div style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">${currentLang === 'zh' ? '题型分析' : 'Skill breakdown'}</div>
      <div class="mob-breakdown-card">
        ${skillStats}
      </div>
    </section>

    <!-- 账户设置 -->
    <section>
      <div style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">${currentLang === 'zh' ? '账户设置' : 'Settings'}</div>
      <div class="mob-settings-card">
        <div class="mob-settings-row" onclick="AccountSettings_editProfile()">
          <div class="mob-settings-icon" style="background:#eff6ff">👤</div>
          <span class="mob-settings-label">${currentLang === 'zh' ? '用户名' : 'Display name'}</span>
          <span class="mob-settings-value">${userName}</span>
          <span class="mob-settings-chevron">›</span>
        </div>
        <div class="mob-settings-row" onclick="AccountSettings_editExamGoal()">
          <div class="mob-settings-icon" style="background:#fff7ed">🎯</div>
          <span class="mob-settings-label">${currentLang === 'zh' ? '目标与考试日期' : 'Goal & exam date'}</span>
          <span class="mob-settings-value">${`${examProfile.targetScore || '79+'} · ${examProfile.examDate ? formatExamDate(examProfile.examDate, currentLang) : (currentLang === 'zh' ? '未设置' : 'Not set')}`}</span>
          <span class="mob-settings-chevron">›</span>
        </div>
        <div class="mob-settings-row" onclick="requestMicPreauth('account-settings')">
          <div class="mob-settings-icon" style="background:#eff6ff">🎤</div>
          <span class="mob-settings-label">${currentLang === 'zh' ? '麦克风权限' : 'Microphone'}</span>
          <span class="mob-settings-value">${micLabel}</span>
          <span class="mob-settings-chevron">›</span>
        </div>
        <div class="mob-settings-row" onclick="setAppLang(currentLang==='zh'?'en':'zh');Pages['account-settings']()">
          <div class="mob-settings-icon" style="background:#ecfdf5">🌐</div>
          <span class="mob-settings-label">${currentLang === 'zh' ? '界面语言' : 'Language'}</span>
          <span class="mob-settings-value">${currentLang === 'zh' ? '中文' : 'English'}</span>
          <span class="mob-settings-chevron">›</span>
        </div>
        <div class="mob-settings-row" onclick="navigate('progress')">
          <div class="mob-settings-icon" style="background:#f5f3ff">📊</div>
          <span class="mob-settings-label">${currentLang === 'zh' ? '详细进度报告' : 'Progress report'}</span>
          <span class="mob-settings-chevron">›</span>
        </div>
        <div class="mob-settings-row" onclick="navigate('support')">
          <div class="mob-settings-icon" style="background:#eff6ff">?</div>
          <span class="mob-settings-label">Support</span>
          <span class="mob-settings-chevron">›</span>
        </div>
      </div>
    </section>

    ${isLoggedIn ? `
    <button class="mob-logout-btn" onclick="AppAuth.requestLogout()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      ${currentLang === 'zh' ? '退出登录' : 'Sign out'}
    </button>
    <button class="mob-logout-btn" style="margin-top:8px" onclick="AccountSettings_requestDeleteAccount()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      ${currentLang === 'zh' ? '删除账号' : 'Delete Account'}
    </button>` : `
    <button class="mob-task-btn" style="width:100%;justify-content:center;display:flex" onclick="AuthUI.open('login')">
      ${currentLang === 'zh' ? '登录 / 注册' : 'Sign in / Register'}
    </button>`}

  </div>
</div>`;
    return;
  }
  // ── End mobile rendering ───────────────────────────────────────────────────

  $('#page-container').innerHTML = `
<div class="page-header">
  <h1>${t('account_settings_title')}</h1>
  <p>${t('account_settings_subtitle')}</p>
</div>

<div class="card" style="margin-bottom:16px">
  <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
    <div class="mob-user-avatar" style="width:56px;height:56px;background:#eaf2ff;border-color:#d6e4ff;color:#2563eb">${renderProfileAvatar(userEmail, currentLang)}</div>
    <div style="min-width:0;flex:1">
      <div style="font-size:18px;font-weight:800;color:var(--text)">${getProfileDisplayName(userEmail, currentLang)}</div>
      <div style="font-size:13px;color:var(--text-light)">${userEmail}</div>
    </div>
    <button class="btn btn-outline" onclick="AccountSettings_editProfile()">${currentLang === 'zh' ? '编辑资料' : 'Edit profile'}</button>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px">
    <div>
      <div class="eyebrow">${currentLang === 'zh' ? '考试目标' : 'Exam goal'}</div>
      <div class="card-title">${currentLang === 'zh' ? '考试倒计时与目标分数' : 'Countdown and target score'}</div>
    </div>
    <button class="btn btn-outline" onclick="AccountSettings_editExamGoal()">${currentLang === 'zh' ? '编辑' : 'Edit'}</button>
  </div>
  <div style="display:grid;grid-template-columns:minmax(0,1fr) 1px 160px;gap:18px;align-items:center">
    <div>
      <div style="font-size:12px;color:var(--text-light);margin-bottom:6px">${currentLang === 'zh' ? '距离考试' : 'Days to exam'}</div>
      <div style="font-size:30px;font-weight:800;line-height:1.1;color:var(--text);margin-bottom:6px">${
        (() => {
          const daysLeft = getDaysUntilExam(examProfile.examDate);
          if (daysLeft == null) return currentLang === 'zh' ? '待设置' : 'Not set';
          if (daysLeft < 0) return currentLang === 'zh' ? '已考试' : 'Completed';
          return currentLang === 'zh' ? `${daysLeft} 天` : `${daysLeft} days`;
        })()
      }</div>
      <div style="font-size:13px;color:var(--text-light)">${formatExamDate(examProfile.examDate, currentLang)}</div>
    </div>
    <div style="width:1px;height:58px;background:var(--border)"></div>
    <div style="text-align:right">
      <div style="font-size:12px;color:var(--text-light);margin-bottom:6px">${currentLang === 'zh' ? '目标分数' : 'Target score'}</div>
      <div style="font-size:30px;font-weight:800;line-height:1.1;color:var(--primary)">${examProfile.targetScore || '79+'}</div>
    </div>
  </div>
</div>

<div class="grid-2 account-grid">
  <div class="card">
    <div class="eyebrow">${t('account_title')}</div>
    <div class="card-title" style="margin-bottom:10px">${isLoggedIn ? t('account_signed_in') : t('account_signed_out')}</div>
    <div style="display:grid;gap:10px;font-size:13.5px;color:var(--text-light);line-height:1.7">
      <div><strong style="color:var(--text)">${t('account_status_title')}</strong><br>${isLoggedIn ? t('account_signed_in') : t('account_signed_out')}</div>
      <div><strong style="color:var(--text)">${t('account_signed_in_as')}</strong><br>${isLoggedIn ? userEmail : '—'}</div>
    </div>
    <div class="btn-group" style="margin-top:16px">
      ${isLoggedIn
        ? `<button class="btn btn-outline" onclick="AppAuth.requestLogout()">${t('btn_logout')}</button>
           <button class="btn btn-danger" onclick="AccountSettings_requestDeleteAccount()" style="margin-top:8px">${t('delete_account_btn')}</button>`
        : `<button class="btn btn-primary" onclick="AuthUI.open('login')">${t('btn_sign_in')}</button>`}
    </div>
  </div>

  <div class="card">
    <div class="eyebrow">${t('account_sync_title')}</div>
    <div class="card-title" style="margin-bottom:10px">${t('account_sync_title')}</div>
    <p style="font-size:13.5px;color:var(--text-light);line-height:1.7">
      ${isLoggedIn ? t('account_sync_copy_in') : t('account_sync_copy_out')}
    </p>
  </div>
</div>

<div class="grid-2 settings-grid" style="margin-top:16px">
  <div class="card settings-card">
    <div class="eyebrow">${t('app_settings_title')}</div>
    <div class="card-title" style="margin-bottom:10px">${t('account_settings_language')}</div>
    <div class="lang-toggle" role="tablist" aria-label="Language switcher">
      <button class="lang-btn ${getAppLang() === 'zh' ? 'active' : ''}" onclick="setAppLang('zh')">中文</button>
      <button class="lang-btn ${getAppLang() === 'en' ? 'active' : ''}" onclick="setAppLang('en')">EN</button>
    </div>
  </div>

  <div class="card settings-card">
    <div class="eyebrow">${t('app_settings_title')}</div>
    <div class="card-title" style="margin-bottom:10px">${t('account_settings_mic_simple')}</div>
    <p style="font-size:13.5px;color:var(--text-light);line-height:1.7;margin-bottom:14px">
      ${t('mic_status_label')}: <strong style="color:var(--text)">${micLabel}</strong>
    </p>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="requestMicPreauth('account-settings')" ${micState === 'granted' ? 'disabled' : ''}>${t('btn_enable_mic')}</button>
      ${micState === 'granted' ? `<span style="font-size:12.5px;color:var(--success)">${t('mic_already_enabled')}</span>` : ''}
    </div>
  </div>

  <div class="card settings-card">
    <div class="eyebrow">Support</div>
    <div class="card-title" style="margin-bottom:10px">Support</div>
    <p style="font-size:13.5px;color:var(--text-light);line-height:1.7;margin-bottom:14px">
      Need help with account, login, profile, or technical issues?
    </p>
    <button class="btn btn-outline" onclick="navigate('support')">Support</button>
  </div>
</div>`;
};

Pages['account'] = function () {
  navigate('account-settings', { replace: true });
};
