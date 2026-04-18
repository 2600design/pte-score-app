Pages['study-plan'] = function() {
  if (isGuestUser()) {
    $('#page-container').innerHTML = renderProtectedFeatureGate('study_plan_guest_title', 'study_plan_guest_copy');
    return;
  }

  const stats = Stats.get();
  const totals = Object.values(stats).reduce((sum, item) => sum + (item.attempts || 0), 0);
  const tasks = [
    { title: t('study_plan_task_rs'), page: 'practice-repeat-sentence', detailPage: 'repeat-sentence', count: 10 },
    { title: t('study_plan_task_wfd'), page: 'practice-write-dictation', detailPage: 'write-dictation', count: 10 },
    { title: t('study_plan_task_di'), page: 'practice-describe-image', detailPage: 'describe-image', count: 5 },
  ];

  $('#page-container').innerHTML = `
<div class="page-header">
  <h1>${t('study_plan_title')}</h1>
  <p>${t('study_plan_subtitle')}</p>
</div>

<div class="grid-3" style="margin-bottom:20px">
  <div class="stat-card stat-card-product">
    <div class="stat-label">${t('study_plan_card_focus')}</div>
    <div class="stat-value stat-value-sm">Speaking + Dictation</div>
    <div class="stat-sub">${t('best_fast_gain')}</div>
  </div>
  <div class="stat-card stat-card-product">
    <div class="stat-label">${t('study_plan_card_load')}</div>
    <div class="stat-value">${totals}</div>
    <div class="stat-sub">${t('total_completed_sessions')}</div>
  </div>
  <div class="stat-card stat-card-product">
    <div class="stat-label">${t('study_plan_card_session')}</div>
    <div class="stat-value">25 min</div>
    <div class="stat-sub">${t('speaking_listening_block')}</div>
  </div>
</div>

<div class="card">
  <div class="card-title">${t('study_plan_today_tasks')}</div>
  <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
    ${tasks.map((item, index) => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:${index === tasks.length - 1 ? '0' : '1px solid var(--border)'}">
        <div style="display:flex;align-items:center;gap:12px;min-width:0">
          <div style="width:28px;height:28px;border-radius:999px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--text-light)">${index + 1}</div>
          <div style="font-size:14px;color:var(--text)">${item.title}</div>
        </div>
      </div>
    `).join('')}
  </div>
  <div class="result-actions" style="margin-top:18px">
    <button class="btn btn-primary" onclick="StudyPlan_startToday()">${t('study_plan_start_today')}</button>
  </div>
</div>`;

  window.StudyPlan_startToday = function() {
    startTodayPlan(tasks);
  };
};
