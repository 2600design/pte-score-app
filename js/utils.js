// ── Utilities ──────────────────────────────────────────────────────────────

function $(sel, ctx) { return (ctx||document).querySelector(sel); }
function $$(sel, ctx) { return [...(ctx||document).querySelectorAll(sel)]; }

function showToast(msg, duration=2800) {
  const old = document.querySelector('.toast');
  if(old) old.remove();
  const el = document.createElement('div');
  el.className='toast'; el.textContent=msg;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), duration);
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(w=>w.length>0).length;
}

function formatTime(sec) {
  const m=Math.floor(sec/60), s=sec%60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

const MicAccess = {
  stream: null,
  permissionState: 'prompt',
  pending: null,
  preauthStarted: false,

  async syncPermissionState() {
    if(!navigator.permissions || !navigator.permissions.query) return this.permissionState;
    try {
      const status = await navigator.permissions.query({ name: 'microphone' });
      this.permissionState = status.state;
      status.onchange = () => { this.permissionState = status.state; };
      return this.permissionState;
    } catch(e) {
      return this.permissionState;
    }
  },

  getStatusLabel() {
    if (this.permissionState === 'granted') return 'Allowed';
    if (this.permissionState === 'denied') return 'Blocked';
    return 'Not enabled';
  },

  async ensure() {
    // 检查已有 stream 是否仍然活跃（跨页面导航后 tracks 可能变成 ended）
    if (this.stream) {
      const alive = this.stream.getTracks().some(t => t.readyState === 'live');
      if (!alive) { this.stream = null; } // 清除失效 stream，重新申请
    }
    if(this.stream) return this.stream;
    if(this.pending) return this.pending;
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return null;

    console.log('mic request triggered');
    this.pending = navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log(stream);
        this.stream = stream;
        this.permissionState = 'granted';
        // 监听 stream 失效，自动清除
        stream.getTracks().forEach(t => {
          t.onended = () => { if(this.stream === stream) this.stream = null; };
        });
        return stream;
      })
      .catch(err => {
        this.permissionState = 'denied';
        throw err;
      })
      .finally(() => {
        this.pending = null;
      });

    return this.pending;
  },

  async ensureOrNotify() {
    try {
      await this.ensure();
      return true;
    } catch (e) {
      alert(t('mic_unavailable_alert'));
      showToast('Please allow microphone access once so recording can work normally.');
      return false;
    }
  },

  async preAuthorize({ silent=false } = {}) {
    try {
      await this.syncPermissionState();
      if (this.permissionState === 'granted') return true;
      await this.ensure();
      localStorage.setItem('pte_mic_preauth_granted', '1');
      return true;
    } catch (e) {
      if (!silent) showToast('Microphone permission was not granted yet.');
      return false;
    }
  },

  async preAuthorizeOnEntry() {
    await this.syncPermissionState();
    if (this.permissionState === 'granted') localStorage.setItem('pte_mic_preauth_granted', '1');
  }
};

window.MicAccess = MicAccess;

// Persistent stats
const Stats = {
  _key: 'pte_stats',
  get() {
    try { return JSON.parse(localStorage.getItem(this._key)||'{}'); } catch(e){return {};}
  },
  save(data) { localStorage.setItem(this._key, JSON.stringify(data)); },
  record(type, score, total, meta={}) {
    const d=this.get();
    if(!d[type]) d[type]={attempts:0,totalScore:0,history:[]};
    d[type].attempts++;
    d[type].totalScore+=score;
    d[type].history.push({score,total,date:new Date().toISOString()});
    if(d[type].history.length>30) d[type].history=d[type].history.slice(-30);
    this.save(d);
    if (window.PracticeTracker) {
      PracticeTracker.saveAttempt(type, score, meta).catch(err => {
        console.warn('Supabase attempt save failed:', err?.message || err);
      });
    }
  },
  getAvg(type) {
    const d=this.get(); if(!d[type]||!d[type].attempts) return null;
    return Math.round(d[type].totalScore/d[type].attempts);
  }
};

// ── Countdown Timer ────────────────────────────────────────────────────────
class CountdownTimer {
  constructor(el, seconds, onTick, onEnd) {
    this.el=el; this.seconds=seconds; this.remaining=seconds;
    this.onTick=onTick; this.onEnd=onEnd; this.iv=null;
  }
  start() {
    this._render();
    this.iv = setInterval(()=>{
      this.remaining--;
      this._render();
      if(this.onTick) this.onTick(this.remaining);
      if(this.remaining<=0){ clearInterval(this.iv); if(this.onEnd) this.onEnd(); }
    },1000);
  }
  stop() { clearInterval(this.iv); }
  _render() {
    if(!this.el) return;
    const pct = this.remaining/this.seconds;
    let cls='timer';
    if(pct<0.25) cls+=' danger';
    else if(pct<0.5) cls+=' warning';
    this.el.className=cls;
    this.el.innerHTML=`<span class="timer-dot"></span>${formatTime(this.remaining)}`;
  }
}

// ── Question Audio Playback ────────────────────────────────────────────────
// Pre-warm TTS voices so Chrome has them ready before first playback
let _ttsVoiceCache = [];
if ('speechSynthesis' in window) {
  const _refreshVoices = () => { _ttsVoiceCache = speechSynthesis.getVoices(); };
  _refreshVoices();
  speechSynthesis.addEventListener('voiceschanged', _refreshVoices);
}
function _getEnglishVoice() {
  const voices = _ttsVoiceCache.length ? _ttsVoiceCache : (window.speechSynthesis ? speechSynthesis.getVoices() : []);
  return voices.find(v => /^en[-_]us$/i.test(v.lang || '')) ||
    voices.find(v => /^en[-_]gb$/i.test(v.lang || '')) ||
    voices.find(v => /^en(-|_)/i.test(v.lang || '')) ||
    voices.find(v => /english/i.test(v.name || '')) || null;
}

function getUiText(key, fallback) {
  try {
    return typeof t === 'function' ? t(key) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function getQuestionAudioSource(item) {
  if (!item || typeof item !== 'object') return '';
  const raw = item.audio || item.audioUrl || item.audioSrc || item.source || '';
  if (typeof raw !== 'string') return '';
  const source = raw.trim();
  if (!source) return '';
  return /\.(mp3|wav)(\?.*)?$/i.test(source) ? source : '';
}

function hasSystemVoicePlayback(text='') {
  return !!(String(text || '').trim() && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function');
}

function getPlaybackMode({ source='', fallbackText='' } = {}) {
  if (String(source || '').trim()) return 'audio';
  if (hasSystemVoicePlayback(fallbackText)) return 'tts';
  return 'none';
}

let _activeQuestionAudioPlayer = null;

function stopAllQuestionAudio() {
  try {
    if (_activeQuestionAudioPlayer && typeof _activeQuestionAudioPlayer.stop === 'function') {
      _activeQuestionAudioPlayer.stop();
    }
  } catch (_error) {}
  _activeQuestionAudioPlayer = null;
  try {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  } catch (_error) {}
}

function updateAudioButton(button, { mode='audio', state = 'idle' } = {}) {
  if (!button) return;
  const available = mode !== 'none';
  button.disabled = !available;
  const isPlaying = state === 'playing';
  button.textContent = isPlaying ? '⏸' : '▶';
  const label = isPlaying
    ? getUiText('btn_pause_audio', 'Pause Audio')
    : getUiText('btn_play_audio', 'Play Audio');
  button.setAttribute('aria-label', label);
  button.title = available ? label : getUiText('audio_not_available', 'Audio unavailable.');
}

function createAudioPlayer({ source, fallbackText='', onProgress, onEnd, onStateChange }) {
  const audioSrc = typeof source === 'string' ? source.trim() : '';
  const ttsText = String(fallbackText || '').trim();
  const mode = getPlaybackMode({ source: audioSrc, fallbackText: ttsText });
  let audio = null;
  let utterance = null;
  let timer = null;
  let ttsStartTimeout = null;
  let elapsed = 0;
  let ended = false;
  let ttsCycle = 0;
  const totalMs = Math.max(1200, Math.round((ttsText.split(/\s+/).filter(Boolean).length || 1) * 420));

  function emitState(state) {
    onStateChange && onStateChange(state);
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function clearTtsStartTimeout() {
    clearTimeout(ttsStartTimeout);
    ttsStartTimeout = null;
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      elapsed = Math.min(totalMs, elapsed + 120);
      onProgress && onProgress(Math.min(1, elapsed / totalMs));
    }, 120);
  }

  function teardown() {
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    audio = null;
  }

  function teardownTts() {
    stopTimer();
    clearTtsStartTimeout();
    utterance = null;
  }

  function syncProgress() {
    if (!audio) return;
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
    const pct = duration ? Math.max(0, Math.min(1, audio.currentTime / duration)) : 0;
    onProgress && onProgress(pct);
  }

  function finish(cancelled = false) {
    if (ended) return;
    ended = true;
    if (_activeQuestionAudioPlayer === controller) _activeQuestionAudioPlayer = null;
    stopTimer();
    if (!cancelled) {
      onProgress && onProgress(1);
      emitState('ended');
      onEnd && onEnd();
    } else {
      emitState('idle');
    }
    teardown();
    teardownTts();
  }

  function buildAudio() {
    const el = new Audio(audioSrc);
    el.preload = 'auto';
    el.playbackRate = 1;
    el.defaultPlaybackRate = 1;
    el.addEventListener('timeupdate', syncProgress);
    el.addEventListener('ended', () => finish(false));
    el.addEventListener('error', () => finish(true));
    return el;
  }

  function buildUtterance() {
    const next = new SpeechSynthesisUtterance(ttsText);
    next.rate = 1;
    next.pitch = 1;
    next.volume = 1;
    const englishVoice = _getEnglishVoice();
    if (englishVoice) next.voice = englishVoice;
    const cycle = ++ttsCycle;
    next.onend = () => {
      if (cycle !== ttsCycle) return;
      finish(false);
    };
    next.onerror = () => {
      if (cycle !== ttsCycle) return;
      finish(true);
    };
    return next;
  }

  const controller = {
    available: mode !== 'none',
    mode,
    play() {
      if (mode === 'none') return false;
      if (_activeQuestionAudioPlayer && _activeQuestionAudioPlayer !== this) {
        try { _activeQuestionAudioPlayer.stop(); } catch (_error) {}
      }
      _activeQuestionAudioPlayer = this;
      if (mode === 'tts') {
        if (!('speechSynthesis' in window)) return false;
        const playCycle = ++ttsCycle;
        window.speechSynthesis.cancel();
        teardown();
        teardownTts();
        ended = false;
        elapsed = 0;
        onProgress && onProgress(0);
        emitState('playing');
        ttsStartTimeout = window.setTimeout(() => {
          if (playCycle !== ttsCycle || ended) return;
          if (!('speechSynthesis' in window)) {
            finish(true);
            return;
          }
          window.speechSynthesis.cancel();
          utterance = buildUtterance();
          try {
            window.speechSynthesis.speak(utterance);
            startTimer();
          } catch (_error) {
            finish(true);
          }
        }, 80);
        return true;
      }
      teardown();
      teardownTts();
      ended = false;
      onProgress && onProgress(0);
      audio = buildAudio();
      const started = audio.play();
      if (started && typeof started.catch === 'function') {
        started.catch(() => finish(true));
      }
      emitState('playing');
      return true;
    },
    pause() {
      if (mode === 'tts') {
        if (ttsStartTimeout || !utterance || ended || !window.speechSynthesis || window.speechSynthesis.paused) return;
        window.speechSynthesis.pause();
        stopTimer();
        emitState('paused');
        return;
      }
      if (!audio || ended || audio.paused) return;
      audio.pause();
      emitState('paused');
    },
    resume() {
      if (mode === 'tts') {
        if (ttsStartTimeout || !utterance || ended || !window.speechSynthesis || !window.speechSynthesis.paused) return;
        window.speechSynthesis.resume();
        startTimer();
        emitState('playing');
        return;
      }
      if (!audio || ended || !audio.paused) return;
      const started = audio.play();
      if (started && typeof started.catch === 'function') {
        started.catch(() => finish(true));
      }
      _activeQuestionAudioPlayer = this;
      emitState('playing');
    },
    stop() {
      if (mode === 'tts') {
        ttsCycle += 1;
        clearTtsStartTimeout();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        finish(true);
        onProgress && onProgress(0);
        if (_activeQuestionAudioPlayer === this) _activeQuestionAudioPlayer = null;
        return;
      }
      if (!audio) return;
      finish(true);
      onProgress && onProgress(0);
      if (_activeQuestionAudioPlayer === this) _activeQuestionAudioPlayer = null;
    },
    toggle() {
      if (mode === 'tts') {
        if (ttsStartTimeout || !utterance || ended) return this.play();
        if (window.speechSynthesis && window.speechSynthesis.paused) {
          this.resume();
          return true;
        }
        this.pause();
        return true;
      }
      if (!audio || ended) return this.play();
      if (audio.paused) {
        this.resume();
        return true;
      }
      this.pause();
      return true;
    },
  };
  return controller;
}

window.stopAllQuestionAudio = stopAllQuestionAudio;

// ── Silence Detection ─────────────────────────────────────────────────────
// Monitors microphone audio levels; fires onSilence if no voice detected within timeoutMs.
// Uses voice-frequency band (approx 300Hz–3kHz) to avoid false triggers from background noise.
class SilenceWatcher {
  constructor({ stream, onSpeech, onSilence, timeoutMs = 3500, threshold = 15 }) {
    this._done = false;
    this._onSpeech = onSpeech;
    this._raf = null;
    this._ctx = null;
    this._analyser = null;
    try {
      const ACtx = window.AudioContext || window.webkitAudioContext;
      if (!ACtx || !stream) return;
      this._ctx = new ACtx();
      const src = this._ctx.createMediaStreamSource(stream);
      this._analyser = this._ctx.createAnalyser();
      this._analyser.fftSize = 512;
      this._analyser.smoothingTimeConstant = 0.6;
      src.connect(this._analyser);
      this._data = new Uint8Array(this._analyser.frequencyBinCount);
      this._threshold = threshold;
      this._timeoutId = setTimeout(() => {
        if (this._done) return;
        this._close();
        onSilence && onSilence();
      }, timeoutMs);
      this._poll();
    } catch (_) { /* degrade gracefully if Web Audio unavailable */ }
  }
  _voicePeak() {
    if (!this._analyser) return 0;
    this._analyser.getByteFrequencyData(this._data);
    const len = this._data.length;
    const s = Math.floor(len * 0.08), e = Math.floor(len * 0.45);
    let peak = 0;
    for (let i = s; i < e; i++) if (this._data[i] > peak) peak = this._data[i];
    return peak;
  }
  _poll() {
    if (this._done) return;
    if (this._voicePeak() >= this._threshold) {
      this._close();
      this._onSpeech && this._onSpeech();
      return;
    }
    this._raf = requestAnimationFrame(() => this._poll());
  }
  markSpeechDetected() {
    if (this._done) return;
    this._close();
    this._onSpeech && this._onSpeech();
  }
  _close() {
    this._done = true;
    clearTimeout(this._timeoutId);
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
    if (this._ctx) { try { this._ctx.close(); } catch (_) {} this._ctx = null; }
    this._analyser = null;
  }
  stop() { this._close(); }
}

// ── Speech Recognition ─────────────────────────────────────────────────────
class SpeechRecorder {
  constructor({ onResult, onEnd, onError, onCapture, continuous=false, keepAlive=true, captureAudio=false }) {
    this.onResult=onResult; this.onEnd=onEnd; this.onError=onError;
    this.onCapture=onCapture;
    this.continuous=continuous; this.keepAlive=keepAlive; this.recognition=null; this.isRunning=false;
    this.shouldStop=false; this.finalTranscript=''; this.restartTimer=null;
    this.captureAudio=captureAudio; this.mediaRecorder=null; this.audioChunks=[]; this.audioUrl=''; this.captureStream=null;
    this.recognitionEnded=false; this.captureEnded=true;
  }
  _teardownCapture() {
    if(this.captureStream) {
      this.captureStream.getTracks().forEach(track => track.stop());
      this.captureStream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
  _maybeFinish() {
    if(!this.recognitionEnded || !this.captureEnded) return;
    this.isRunning=false;
    this.onEnd&&this.onEnd({ final:this.finalTranscript.trim(), audioUrl:this.audioUrl });
  }
  _startCapture() {
    this.captureEnded = true;
    if(!this.captureAudio || !window.MediaRecorder || !MicAccess.stream) return;
    try {
      this.captureStream = MicAccess.stream.clone();
      const preferredType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : '';
      this.mediaRecorder = preferredType ? new MediaRecorder(this.captureStream, { mimeType: preferredType }) : new MediaRecorder(this.captureStream);
      this.audioChunks = [];
      this.captureEnded = false;
      this.mediaRecorder.ondataavailable = (e) => {
        if(e.data && e.data.size > 0) this.audioChunks.push(e.data);
      };
      this.mediaRecorder.onstop = () => {
        const mime = this.mediaRecorder && this.mediaRecorder.mimeType ? this.mediaRecorder.mimeType : 'audio/webm';
        if(this.audioChunks.length) {
          if(this.audioUrl) URL.revokeObjectURL(this.audioUrl);
          const blob = new Blob(this.audioChunks, { type: mime });
          this.audioUrl = URL.createObjectURL(blob);
          this.onCapture && this.onCapture({ url:this.audioUrl, blob });
        }
        this.captureEnded = true;
        this._teardownCapture();
        this._maybeFinish();
      };
      this.mediaRecorder.start();
    } catch(e) {
      this.captureEnded = true;
      this._teardownCapture();
    }
  }
  _buildRecognition() {
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    const recognition=new SR();
    recognition.continuous=this.continuous;
    recognition.interimResults=true;
    recognition.lang='en-US';
    recognition.onresult=(e)=>{
      let interim='';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const transcript = e.results[i][0].transcript;
        if(e.results[i].isFinal) this.finalTranscript += transcript + ' ';
        else interim += transcript;
      }
      this.onResult&&this.onResult({final:this.finalTranscript.trim(), interim});
    };
    recognition.onend=()=>{
      this.recognition=null;
      if(this.shouldStop || !this.keepAlive){
        this.recognitionEnded=true;
        this._maybeFinish();
        return;
      }
      this.restartTimer = setTimeout(() => {
        if(this.shouldStop) return;
        try {
          this.recognition = this._buildRecognition();
          this.recognition.start();
          this.isRunning = true;
        } catch (e) {
          this.recognitionEnded = true;
          this.onError&&this.onError('Speech recognition restarted unexpectedly.');
          this._maybeFinish();
        }
      }, 120);
    };
    recognition.onerror=(e)=>{
      if(!this.shouldStop && this.keepAlive && (e.error==='no-speech' || e.error==='aborted')){
        return;
      }
      this.onError&&this.onError(e.error);
    };
    return recognition;
  }
  start() {
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    clearTimeout(this.restartTimer);
    this.shouldStop=false;
    this.finalTranscript='';
    this.recognitionEnded=!SR;
    this.captureEnded=!this.captureAudio;
    this._startCapture();
    if(!SR){
      if (!this.captureAudio) {
        this.onError&&this.onError(getAppLang() === 'zh' ? '当前设备暂不支持语音识别。' : 'Speech recognition is not available on this device.');
        return;
      }
      this.isRunning=true;
      return;
    }
    this.recognition=this._buildRecognition();
    this.recognition.start();
    this.isRunning=true;
  }
  stop() {
    this.shouldStop=true;
    clearTimeout(this.restartTimer);
    if(this.mediaRecorder && this.mediaRecorder.state !== 'inactive') this.mediaRecorder.stop();
    else this.captureEnded = true;
    if(this.recognition) this.recognition.stop();
    else {
      this.recognitionEnded=true;
      this._maybeFinish();
    }
  }
}
