function buildQuestionPreview(item) {
  const preview = item.preview || item.content || item.title || '';
  return String(preview).trim().slice(0, 120);
}

function getQuestionListState(pageKey) {
  if (!window.__questionListState) window.__questionListState = {};
  return window.__questionListState[pageKey] || {
    search: '',
    filter: 'all',
    sort: 'oldest',
  };
}

function setQuestionListState(pageKey, patch) {
  if (!window.__questionListState) window.__questionListState = {};
  const prev = getQuestionListState(pageKey);
  window.__questionListState[pageKey] = { ...prev, ...patch };
}

function questionMatchesFilter(item, filter) {
  if (filter === 'prediction') return !!item.isPrediction;
  if (filter === 'locked') return !!item.isLocked;
  if (filter === 'unlocked') return !item.isLocked;
  if (filter === 'latest') return !!item.isNew;
  return true;
}

function sortQuestionItems(items, sort) {
  const list = items.slice();
  if (sort === 'oldest') return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  if (sort === 'az') return list.sort((a, b) => String(a.title || a.content || '').localeCompare(String(b.title || b.content || '')));
  return list.sort((a, b) => (a.order || 0) - (b.order || 0));
}

function buildQuestionTags(item) {
  const tags = [];
  if (item.isPrediction) tags.push(`<span class="badge" style="background:rgba(239,68,68,0.10);color:#dc2626">${t('prediction_badge')}</span>`);
  if (item.isNew) tags.push(`<span class="badge" style="background:rgba(34,197,94,0.10);color:#15803d">${t('prediction_latest_label')}</span>`);
  if (item.isLocked) tags.push(`<span class="badge" style="background:rgba(15,23,42,0.08);color:var(--text-light)">${t('question_list_locked')}</span>`);
  if (item.typeLabel) tags.push(`<span class="badge" style="background:rgba(37,99,235,0.10);color:#1d4ed8">${item.typeLabel}</span>`);
  return tags.join(' ');
}

function renderQuestionCard(item, detailPage) {
  const action = item.isLocked ? 'openLoginPrompt()' : `selectQuestionAndOpen('${detailPage}','${item.id}')`;
  return `
<div onclick="${action}" style="padding:14px 0;border-bottom:1px solid var(--border);cursor:pointer;opacity:${item.isLocked ? '0.8' : '1'}">
  <div style="display:flex;gap:14px;align-items:flex-start">
    ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width:92px;height:62px;object-fit:cover;border-radius:10px;border:1px solid var(--border);background:#fff;flex-shrink:0">` : ''}
    <div style="min-width:0;flex:1">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div style="font-weight:600;color:var(--text);min-width:0">${item.title}</div>
        <button class="btn question-card-start-btn ${item.isLocked ? 'btn-outline' : 'btn-primary'}" style="height:32px;padding:0 12px;flex-shrink:0" onclick="event.stopPropagation();${action}">${item.isLocked ? t('question_list_locked') : t('question_list_start')}</button>
      </div>
      <div style="font-size:12px;color:var(--text-light);margin-top:4px">${item.meta || ''}</div>
      <div style="font-size:13px;color:var(--text-light);line-height:1.6;margin-top:6px">${buildQuestionPreview(item)}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">${buildQuestionTags(item)}</div>
    </div>
  </div>
</div>`;
}

function renderQuestionListPage(config) {
  const guest = isGuestUser();
  const state = getQuestionListState(config.pageKey);
  const search = String(state.search || '').trim().toLowerCase();

  const preparedItems = (config.items || []).map((item, index, array) => ({
    order: item.order || index + 1,
    preview: buildQuestionPreview(item),
    isLocked: item.isLocked || (guest && index >= GUEST_FREE_QUESTION_LIMIT),
    isNew: typeof item.isNew === 'boolean' ? item.isNew : index >= Math.max(0, array.length - 3),
    ...item,
  }));

  const filtered = preparedItems.filter(item => {
    const haystack = `${item.title || ''} ${item.content || ''} ${item.preview || ''}`.toLowerCase();
    return (!search || haystack.includes(search)) && questionMatchesFilter(item, state.filter);
  });
  const visibleItems = sortQuestionItems(filtered, state.sort);
  const continueItem = preparedItems.find(item => String(item.id) === String(getSelectedQuestionId()));

  $('#page-container').innerHTML = `
<div class="practice-page">
  <div class="page-header">
    <h1>${config.title}</h1>
    <p>${config.subtitle}</p>
  </div>
  <div class="card" style="margin-bottom:18px">
    <div class="eyebrow">${t('question_list_heading')}</div>
    <div class="card-title" style="margin-bottom:8px">${config.title}</div>
    <p style="font-size:13.5px;color:var(--text-light);line-height:1.7">${config.description || config.subtitle}</p>
    <p style="font-size:12px;color:var(--text-light);margin-top:8px">${t('question_list_pick_prompt')}</p>
    <div style="display:grid;grid-template-columns:minmax(0,1.3fr) repeat(2,minmax(140px,180px));gap:10px;margin-top:14px">
      <input class="input" value="${state.search || ''}" placeholder="${t('question_search_placeholder')}" oninput="QuestionList_updateSearch('${config.pageKey}', this.value)">
      <select class="input" onchange="QuestionList_updateFilter('${config.pageKey}', this.value)">
        <option value="all" ${state.filter === 'all' ? 'selected' : ''}>${t('question_filter_all')}</option>
        <option value="latest" ${state.filter === 'latest' ? 'selected' : ''}>${t('question_filter_latest')}</option>
        <option value="prediction" ${state.filter === 'prediction' ? 'selected' : ''}>${t('question_filter_prediction')}</option>
        <option value="unlocked" ${state.filter === 'unlocked' ? 'selected' : ''}>${t('question_filter_unlocked')}</option>
        <option value="locked" ${state.filter === 'locked' ? 'selected' : ''}>${t('question_filter_locked')}</option>
      </select>
      <select class="input" onchange="QuestionList_updateSort('${config.pageKey}', this.value)">
        <option value="newest" ${state.sort === 'newest' ? 'selected' : ''}>${t('question_sort_newest')}</option>
        <option value="oldest" ${state.sort === 'oldest' ? 'selected' : ''}>${t('question_sort_oldest')}</option>
        <option value="az" ${state.sort === 'az' ? 'selected' : ''}>${t('question_sort_az')}</option>
      </select>
    </div>
  </div>
  ${continueItem ? `
  <div class="card" style="margin-bottom:18px;border:1px solid rgba(37,99,235,0.18);background:var(--surface)">
    <div class="eyebrow">${t('continue_where_left_off')}</div>
    <div class="card-title" style="margin-bottom:8px">${continueItem.title}</div>
    <p style="font-size:13px;color:var(--text-light);line-height:1.7">${t('continue_question_label')}</p>
    <div class="btn-group" style="margin-top:14px">
      <button class="btn btn-primary" onclick="selectQuestionAndOpen('${config.detailPage}','${continueItem.id}')">${t('continue_open_cta')}</button>
    </div>
  </div>` : ''}
  ${visibleItems.length ? `<div class="card" style="padding:0 18px">${visibleItems.map(item => renderQuestionCard(item, config.detailPage)).join('')}</div>` : `<div class="prog-empty"><div class="prog-empty-desc">${t('question_list_empty')}</div></div>`}
  ${guest ? renderGuestPracticeUpsell(preparedItems.length, Math.min(preparedItems.length, GUEST_FREE_QUESTION_LIMIT)) : ''}
</div>`;
}

window.QuestionList_updateSearch = function(pageKey, value) {
  setQuestionListState(pageKey, { search: value });
  Pages[pageKey]();
};

window.QuestionList_updateFilter = function(pageKey, value) {
  setQuestionListState(pageKey, { filter: value });
  Pages[pageKey]();
};

window.QuestionList_updateSort = function(pageKey, value) {
  setQuestionListState(pageKey, { sort: value });
  Pages[pageKey]();
};

window.selectQuestionAndOpen = function(detailPage, id) {
  setSelectedQuestionId(id);
  navigate(detailPage);
};

window.renderQuestionListPage = renderQuestionListPage;
