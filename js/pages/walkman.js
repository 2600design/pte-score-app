function renderAudioTrainerPage() {
  const state = {
    index: 0,
    isAutoplay: true,
    filter: 'all',
    player: null,
    playState: 'idle',
  };

  function getTrainerItems() {
    const repeatSentence = getQuestionSet(DB.repeatSentence, 'repeatSentence', item => ({
      id: item.id,
      text: item.content,
      audio: item.audio || item.audioUrl || '',
      type: 'repeatSentence',
    })).map(item => ({
      id: item.id,
      text: item.text,
      audio: item.audio,
      type: 'repeatSentence',
    }));

    const writeDictation = getQuestionSet(DB.writeDictation, 'writeFromDictation', item => ({
      id: item.id,
      sentence: item.content,
      audio: item.audio || item.audioUrl || '',
      type: 'writeFromDictation',
    })).map(item => ({
      id: item.id,
      text: item.sentence,
      audio: item.audio,
      type: 'writeFromDictation',
    }));

    const allItems = [...repeatSentence, ...writeDictation];
    if (state.filter === 'repeatSentence') return allItems.filter(item => item.type === 'repeatSentence');
    if (state.filter === 'writeFromDictation') return allItems.filter(item => item.type === 'writeFromDictation');
    return allItems;
  }

  function getPlaylist() {
    const items = getTrainerItems();
    if (!items.length) return [];
    if (state.index > items.length - 1) state.index = items.length - 1;
    if (state.index < 0) state.index = 0;
    return items;
  }

  function getCurrentItem() {
    const playlist = getPlaylist();
    return playlist[state.index] || null;
  }

  function getTypeLabel(type) {
    return type === 'writeFromDictation' ? t('wfd_title') : t('rs_title');
  }

  function stopPlayer() {
    if (!state.player) return;
    state.player.stop();
    state.player = null;
    state.playState = 'idle';
  }

  function updatePlaybackButton() {
    const btn = document.getElementById('audio-trainer-play');
    if (!btn) return;
    const item = getCurrentItem();
    updateAudioButton(btn, { mode: getPlaybackMode({ source: getQuestionAudioSource(item), fallbackText: item.text }), state: state.playState });
  }

  function updateProgressFill(pct = 0) {
    const fill = document.getElementById('audio-trainer-progress-fill');
    if (!fill) return;
    fill.style.width = `${Math.max(0, Math.min(100, pct * 100))}%`;
  }

  function updateNowPlaying() {
    const item = getCurrentItem();
    const playlist = getPlaylist();
    const typeEl = document.getElementById('audio-trainer-type');
    const progressEl = document.getElementById('audio-trainer-count');
    const textEl = document.getElementById('audio-trainer-text');
    const emptyEl = document.getElementById('audio-trainer-empty');
    const shellEl = document.getElementById('audio-trainer-shell');
    const autoToggle = document.getElementById('audio-trainer-autoplay');

    if (autoToggle) autoToggle.checked = state.isAutoplay;

    if (!item) {
      if (shellEl) shellEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    if (shellEl) shellEl.style.display = 'grid';
    if (emptyEl) emptyEl.style.display = 'none';
    if (typeEl) typeEl.textContent = getTypeLabel(item.type);
    if (progressEl) progressEl.textContent = `${state.index + 1}/${playlist.length}`;
    if (textEl) textEl.textContent = item.text;
    updatePlaybackButton();
    updateProgressFill(0);

    document.querySelectorAll('[data-audio-filter]').forEach(button => {
      button.classList.toggle('active', button.dataset.audioFilter === state.filter);
    });

  }

  function playCurrent({ restart = true } = {}) {
    const item = getCurrentItem();
    if (!item) return;

    if (restart) stopPlayer();
    if (state.player && !restart) {
      state.player.toggle();
      return;
    }

    state.player = createAudioPlayer({
      source: getQuestionAudioSource(item),
      fallbackText: item.text,
      onProgress: pct => updateProgressFill(pct),
      onEnd: () => {
        state.player = null;
        state.playState = 'idle';
        updatePlaybackButton();
        updateProgressFill(1);
        if (state.isAutoplay) {
          const playlist = getPlaylist();
          if (state.index < playlist.length - 1) {
            state.index += 1;
            updateNowPlaying();
            playCurrent({ restart: true });
          }
        }
      },
      onStateChange: nextState => {
        state.playState = nextState === 'ended' ? 'idle' : nextState;
        updatePlaybackButton();
      },
    });

    if (!state.player.play()) {
      state.player = null;
      state.playState = 'idle';
      updatePlaybackButton();
    }
  }

  function goToIndex(nextIndex, shouldAutoplay = false) {
    stopPlayer();
    state.index = nextIndex;
    updateNowPlaying();
    if (shouldAutoplay) playCurrent({ restart: true });
  }

  function bindControls() {
    window.AudioTrainer_togglePlay = function() {
      if (!state.player) {
        playCurrent({ restart: true });
        return;
      }
      state.player.toggle();
    };

    window.AudioTrainer_next = function() {
      const playlist = getPlaylist();
      if (!playlist.length) return;
      const nextIndex = Math.min(state.index + 1, playlist.length - 1);
      goToIndex(nextIndex, state.playState === 'playing');
    };

    window.AudioTrainer_prev = function() {
      const playlist = getPlaylist();
      if (!playlist.length) return;
      const nextIndex = Math.max(state.index - 1, 0);
      goToIndex(nextIndex, state.playState === 'playing');
    };

    window.AudioTrainer_toggleAutoplay = function(checked) {
      state.isAutoplay = !!checked;
    };

    window.AudioTrainer_setFilter = function(filter) {
      state.filter = filter || 'all';
      state.index = 0;
      stopPlayer();
      updateNowPlaying();
    };

  }

  $('#page-container').innerHTML = `
<div class="practice-page">
  <div class="page-header">
    <h1>${t('audioTrainer')}</h1>
    <p>${t('audio_trainer_subtitle')}</p>
  </div>

  <div class="card" id="audio-trainer-empty" style="display:none">
    <div class="card-title">${t('audioTrainer')}</div>
    <p style="font-size:14px;color:var(--text-light);line-height:1.7">${t('audio_trainer_empty')}</p>
  </div>

  <div id="audio-trainer-shell" class="audio-trainer-shell">
    <div class="card audio-trainer-main-card" style="padding:26px 28px">
      <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;margin-bottom:20px">
        <div>
          <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-light)">${t('audio_trainer_current_type')}</div>
          <div id="audio-trainer-type" style="margin-top:8px;font-size:24px;font-weight:700;color:var(--text)"></div>
        </div>
        <div style="text-align:right">
          <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-light)">${t('audio_trainer_progress')}</div>
          <div id="audio-trainer-count" style="margin-top:8px;font-size:24px;font-weight:700;color:var(--text)"></div>
        </div>
      </div>

      <div class="audio-trainer-text-wrap" style="padding:28px;border:1px solid var(--border);border-radius:22px;background:var(--surface);min-height:240px;display:flex;align-items:center;justify-content:center;text-align:center">
        <div id="audio-trainer-text" class="audio-trainer-text" style="font-size:28px;line-height:1.6;font-weight:600;letter-spacing:-0.02em;color:var(--text);max-width:780px"></div>
      </div>

      <div style="margin-top:18px;height:8px;background:rgba(148,163,184,0.16);border-radius:999px;overflow:hidden">
        <div id="audio-trainer-progress-fill" style="width:0%;height:100%;background:var(--text);border-radius:999px"></div>
      </div>

      <div style="display:flex;justify-content:center;gap:12px;align-items:center;flex-wrap:wrap;margin-top:22px">
        <button class="btn btn-outline" type="button" onclick="AudioTrainer_prev()">⏮</button>
        <button class="btn btn-primary" id="audio-trainer-play" type="button" onclick="AudioTrainer_togglePlay()">${t('btn_play_audio')}</button>
        <button class="btn btn-outline" type="button" onclick="AudioTrainer_next()">⏭</button>
      </div>
    </div>

    <div class="audio-trainer-side" style="display:grid;gap:20px">
      <div class="card" style="padding:22px 24px">
        <div class="card-title">${t('audio_trainer_autoplay')}</div>
        <label style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:14px;color:var(--text)">
          <span>${t('audio_trainer_autoplay')}</span>
          <input id="audio-trainer-autoplay" type="checkbox" checked onchange="AudioTrainer_toggleAutoplay(this.checked)">
        </label>
      </div>

      <div class="card" style="padding:22px 24px">
        <div class="card-title">${t('audio_trainer_filter')}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
          <button class="btn btn-outline audio-trainer-chip active" type="button" data-audio-filter="all" onclick="AudioTrainer_setFilter('all')">${t('question_filter_all')}</button>
          <button class="btn btn-outline audio-trainer-chip" type="button" data-audio-filter="repeatSentence" onclick="AudioTrainer_setFilter('repeatSentence')">${t('audio_trainer_rs')}</button>
          <button class="btn btn-outline audio-trainer-chip" type="button" data-audio-filter="writeFromDictation" onclick="AudioTrainer_setFilter('writeFromDictation')">${t('audio_trainer_wfd')}</button>
        </div>
      </div>

    </div>
  </div>
</div>`;

  bindControls();
  updateNowPlaying();

  setPageCleanup(() => {
    stopPlayer();
    delete window.AudioTrainer_togglePlay;
    delete window.AudioTrainer_next;
    delete window.AudioTrainer_prev;
    delete window.AudioTrainer_toggleAutoplay;
    delete window.AudioTrainer_setFilter;
  });
}

Pages['audio-trainer'] = renderAudioTrainerPage;
Pages['tools-audio-trainer'] = renderAudioTrainerPage;
Pages['smart-practice-audio-trainer'] = renderAudioTrainerPage;
