// ── PTE Scoring Engine ────────────────────────────────────────────────────
// This follows Pearson's publicly described trait structure and point bands
// where they are published. Exact machine scoring is proprietary, so some
// speaking traits remain best-effort local approximations.

const Scorer = {
  officialWeightings: {
    readAloud: { overall: 4, speaking: 9 },
    repeatSentence: { overall: 7, listening: 17, speaking: 16 },
    describeImage: { overall: 15, speaking: 31 },
    retellLecture: { overall: 6, listening: 13, speaking: 13 },
    answerShort: { overall: 2, listening: 4 },
    summarizeWritten: { overall: 7, reading: 23, writing: 28 },
    writeEssay: { overall: 7, writing: 31 },
    summarizeSpoken: { overall: 4, listening: 10, writing: 18 },
    writeDictation: { overall: 5, listening: 13, writing: 23 },
  },

  stopWords: new Set([
    'a','an','the','and','or','but','if','then','than','that','this','these','those','is','are','was','were','be','been',
    'being','of','to','in','on','for','from','with','by','at','as','it','its','into','about','through','over','under',
    'between','within','without','such','can','could','should','would','may','might','will','must','do','does','did',
    'have','has','had','their','there','they','them','he','she','his','her','we','our','you','your','i','my','me',
    'not','no','so','because','while','during','after','before','more','most','less','many','much','some','any','all',
    'also','very','now','new','other','one','two','three','up','out','how','what','when','where','who','why'
  ]),

  normalize(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  },

  tokenize(s) {
    return this.normalize(s).split(' ').filter(Boolean);
  },

  toPTE(raw, max) {
    if (max === 0) return 25;
    if (raw <= 0) return 30;
    const scaled = Math.round(10 + (raw / max) * 80);
    return Math.max(38, scaled);
  },

  gradeColor(pct) {
    if (pct >= 80) return '#22c55e';
    if (pct >= 60) return '#f59e0b';
    return '#ef4444';
  },

  gradeLabel(pte) {
    const isEn = typeof getAppLang === 'function' ? getAppLang() === 'en' : false;
    if (pte >= 79) return isEn ? 'Expert' : '优秀';
    if (pte >= 65) return isEn ? 'Good' : '良好';
    if (pte >= 50) return isEn ? 'Average' : '中等';
    return isEn ? 'Building Up' : '提升中';
  },

  shouldUseCompactSpeakingUI() {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia) return window.matchMedia('(max-width: 1024px)').matches;
    return (window.innerWidth || 0) <= 1024;
  },

  rubricKey(name = '') {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  },

  rubricMetricValue(raw, max) {
    if (!Number.isFinite(raw) || !Number.isFinite(max) || max <= 0) return null;
    return Math.max(0, Math.min(90, Math.round((raw / max) * 90)));
  },

  buildRubricMetrics(result) {
    return (result?.rubric || [])
      .map((item) => ({
        key: this.rubricKey(item.name),
        label: item.name,
        value: this.rubricMetricValue(item.raw, item.max),
        desc: item.desc || '',
      }))
      .filter((item) => typeof item.value === 'number');
  },

  getWeightingLabels() {
    const isEn = typeof getAppLang === 'function' ? getAppLang() === 'en' : false;
    return {
      overall: isEn ? 'Overall' : '总分',
      listening: isEn ? 'Listening' : '听力',
      reading: isEn ? 'Reading' : '阅读',
      speaking: isEn ? 'Speaking' : '口语',
      writing: isEn ? 'Writing' : '写作',
    };
  },

  getOfficialWeighting(questionType) {
    return this.officialWeightings[questionType] || null;
  },

  renderOfficialWeighting(questionType) {
    const weighting = this.getOfficialWeighting(questionType);
    if (!weighting) return '';
    const isEn = typeof getAppLang === 'function' ? getAppLang() === 'en' : false;
    const labels = this.getWeightingLabels();
    const order = ['overall', 'listening', 'reading', 'speaking', 'writing'];
    const chips = order
      .filter(key => typeof weighting[key] === 'number')
      .map(key => `<span class="badge" style="background:rgba(37,99,235,0.08);color:#1d4ed8;border:1px solid rgba(37,99,235,0.14)">${labels[key]} ${weighting[key]}%</span>`)
      .join('');
    return `
<div class="card" style="margin-top:12px">
  <div class="card-title">${isEn ? 'Official Question Weighting' : '官方题型权重'}</div>
  <div style="font-size:13px;color:var(--text-light);line-height:1.7;margin-top:6px">${isEn ? 'Reference weighting based on the official PTE question weighting table for average score contribution.' : '依据 PTE 官方题型权重表，展示该题型对平均考试分数的参考贡献。'}</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">${chips}</div>
</div>`;
  },

  contentScore(response, reference, maxPoints=5) {
    const refWords = this.tokenize(reference);
    const respWords = this.tokenize(response);
    const respSet = {};
    respWords.forEach(w => { respSet[w] = (respSet[w] || 0) + 1; });
    let matched = 0;
    refWords.forEach(w => {
      if (respSet[w] > 0) {
        matched++;
        respSet[w]--;
      }
    });
    const pct = matched / Math.max(refWords.length, 1);
    return { raw: Math.round(pct * maxPoints), max: maxPoints, pct: Math.round(pct * 100), matched, total: refWords.length };
  },

  orderedMatchScore(response, reference) {
    const resp = this.tokenize(response);
    const ref = this.tokenize(reference);
    let refIndex = 0;
    let matched = 0;
    resp.forEach(word => {
      const next = ref.indexOf(word, refIndex);
      if (next !== -1) {
        matched++;
        refIndex = next + 1;
      }
    });
    return {
      matched,
      total: ref.length,
      pct: matched / Math.max(ref.length, 1),
    };
  },

  extractKeywords(text, limit=10) {
    const counts = {};
    this.tokenize(text).forEach(word => {
      if (word.length < 4 || this.stopWords.has(word)) return;
      counts[word] = (counts[word] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
      .slice(0, limit)
      .map(([word]) => word);
  },

  keywordCoverage(response, source, limit=10) {
    const keywords = this.extractKeywords(source, limit);
    const responseSet = new Set(this.tokenize(response));
    const matched = keywords.filter(word => responseSet.has(word));
    return {
      keywords,
      matched,
      coverage: matched.length / Math.max(keywords.length, 1),
    };
  },

  fluencyScore(response, maxPoints=5) {
    const words = this.tokenize(response);
    const wc = words.length;
    if (wc === 0) return { raw: 0, max: maxPoints };
    const sentences = (response.match(/[.!?]+/g) || []).length || 1;
    const avgLen = wc / sentences;
    const unique = new Set(words).size;
    const diversity = unique / Math.max(wc, 1);
    let raw = 0;
    if (wc >= 6) raw++;
    if (wc >= 15) raw++;
    if (avgLen >= 6 && avgLen <= 24) raw++;
    if (diversity >= 0.45) raw++;
    if (diversity >= 0.6) raw++;
    return { raw: Math.min(maxPoints, raw), max: maxPoints };
  },

  pronunciationScore(response, reference, maxPoints=5) {
    const ordered = this.orderedMatchScore(response, reference);
    const pct = ordered.pct;
    let raw = 0;
    if (pct >= 0.9) raw = 5;
    else if (pct >= 0.75) raw = 4;
    else if (pct >= 0.55) raw = 3;
    else if (pct >= 0.35) raw = 2;
    else if (pct >= 0.15) raw = 1;
    return { raw, max: maxPoints };
  },

  diffWords(spoken, reference) {
    const refWords = reference.split(/\s+/);
    const normSpoken = this.tokenize(spoken);
    const spokenSet = {};
    normSpoken.forEach(w => { spokenSet[w] = (spokenSet[w] || 0) + 1; });
    return refWords.map(w => {
      const n = this.normalize(w);
      const found = spokenSet[n] > 0;
      if (found) spokenSet[n]--;
      return { word: w, found };
    });
  },

  readAloud(spoken, reference) {
    const ordered = this.orderedMatchScore(spoken, reference);
    const content = { raw: Math.max(0, Math.round(ordered.pct * 5)), max: 5, matched: ordered.matched, total: ordered.total };
    const fluency = this.fluencyScore(spoken, 5);
    const pronun = this.pronunciationScore(spoken, reference, 5);
    const totalRaw = content.raw + fluency.raw + pronun.raw;
    const totalMax = 15;
    const pte = this.toPTE(totalRaw, totalMax);
    return {
      pte,
      label: this.gradeLabel(pte),
      rubric: [
        { name: 'Content', raw: content.raw, max: 5, desc: `${content.matched}/${content.total} words in sequence` },
        { name: 'Oral Fluency', raw: fluency.raw, max: 5, desc: 'Rhythm, phrasing, pace' },
        { name: 'Pronunciation', raw: pronun.raw, max: 5, desc: 'Speech clarity approximation' },
      ],
      totalRaw,
      totalMax,
    };
  },

  repeatSentence(spoken, reference) {
    const ordered = this.orderedMatchScore(spoken, reference);
    let contentRaw = 0;
    if (ordered.pct >= 0.99) contentRaw = 3;
    else if (ordered.pct >= 0.5) contentRaw = 2;
    else if (ordered.pct > 0.05) contentRaw = 1;
    const fluency = this.fluencyScore(spoken, 5);
    const pronun = this.pronunciationScore(spoken, reference, 5);
    const totalRaw = contentRaw + fluency.raw + pronun.raw;
    const totalMax = 13;
    const pte = this.toPTE(totalRaw, totalMax);
    return {
      pte,
      label: this.gradeLabel(pte),
      rubric: [
        { name: 'Content', raw: contentRaw, max: 3, desc: `${ordered.matched}/${ordered.total} prompt words in order` },
        { name: 'Oral Fluency', raw: fluency.raw, max: 5, desc: 'Rhythm, phrasing' },
        { name: 'Pronunciation', raw: pronun.raw, max: 5, desc: 'Speech clarity approximation' },
      ],
      totalRaw,
      totalMax,
    };
  },

  summarizeWritten(text, sourceText, wordRange=[25,50]) {
    const wc = countWords(text);
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const overlap = this.contentScore(text, sourceText, 2);
    const keyword = this.keywordCoverage(text, sourceText, 10);

    let contentRaw = 0;
    if (keyword.coverage >= 0.45 && overlap.pct >= 18) contentRaw = 1;
    if (keyword.coverage >= 0.65 && overlap.pct >= 28) contentRaw = 2;

    const inRange = wc >= wordRange[0] && wc <= wordRange[1];
    const isOneSentence = sentences === 1;
    const formRaw = (inRange && isOneSentence) ? 1 : 0;

    const avgSentLen = wc / Math.max(sentences, 1);
    const grammarRaw = avgSentLen >= 10 && sentences >= 1 ? 2 : avgSentLen >= 5 ? 1 : 0;

    const tokens = this.tokenize(text);
    const unique = new Set(tokens).size;
    const diversity = unique / Math.max(tokens.length, 1);
    const vocabRaw = diversity > 0.7 ? 2 : diversity > 0.5 ? 1 : 0;

    let totalRaw = contentRaw + formRaw + grammarRaw + vocabRaw;
    if (contentRaw === 0) totalRaw = formRaw;

    const pte = this.toPTE(totalRaw, 7);
    return {
      pte,
      label: this.gradeLabel(pte),
      words: wc,
      inRange,
      isOneSentence,
      rubric: [
        { name: 'Content', raw: contentRaw, max: 2, desc: `Topic keywords matched: ${keyword.matched.length}/${Math.max(keyword.keywords.length,1)}` },
        { name: 'Form', raw: formRaw, max: 1, desc: `One sentence, ${wordRange[0]}–${wordRange[1]} words (yours: ${wc})` },
        { name: 'Grammar', raw: grammarRaw, max: 2, desc: 'Grammatical accuracy' },
        { name: 'Vocabulary', raw: vocabRaw, max: 2, desc: 'Word range and appropriateness' },
      ],
      totalRaw,
      totalMax: 7,
    };
  },

  writeEssay(text, prompt, wordRange=[200,300]) {
    const wc = countWords(text);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 10).length;
    const tokens = this.tokenize(text);
    const unique = new Set(tokens).size;

    const promptOverlap = this.keywordCoverage(text, prompt, 8);
    let contentRaw = 0;
    if (promptOverlap.coverage >= 0.2) contentRaw = 1;
    if (promptOverlap.coverage >= 0.4) contentRaw = 2;
    if (promptOverlap.coverage >= 0.6) contentRaw = 3;

    let formRaw = 0;
    if (wc >= wordRange[0] && wc <= wordRange[1]) formRaw = 2;
    else if (wc >= Math.round(wordRange[0] * 0.8) && wc <= Math.round(wordRange[1] * 1.2)) formRaw = 1;

    const structureRaw = paragraphs >= 3 ? 2 : paragraphs >= 2 ? 1 : 0;
    const avgLen = wc / Math.max(sentences, 1);
    const grammarRaw = avgLen >= 10 && avgLen <= 35 ? 2 : avgLen >= 6 ? 1 : 0;
    const ttr = unique / Math.max(tokens.length, 1);
    const rangeRaw = ttr > 0.55 ? 2 : ttr > 0.4 ? 1 : 0;
    const spellingRaw = wc >= wordRange[0] ? 2 : 1;

    let totalRaw = contentRaw + formRaw + structureRaw + grammarRaw + rangeRaw + spellingRaw;
    if (contentRaw === 0 || formRaw === 0) totalRaw = 0;

    const pte = this.toPTE(totalRaw, 13);
    return {
      pte,
      label: this.gradeLabel(pte),
      words: wc,
      inRange: wc >= wordRange[0] && wc <= wordRange[1],
      rubric: [
        { name: 'Content', raw: contentRaw, max: 3, desc: 'Addresses the assigned topic' },
        { name: 'Form', raw: formRaw, max: 2, desc: `${wordRange[0]}–${wordRange[1]} words (yours: ${wc})` },
        { name: 'Development, structure and coherence', raw: structureRaw, max: 2, desc: `${paragraphs} paragraph(s) detected` },
        { name: 'Grammar', raw: grammarRaw, max: 2, desc: 'Range and grammatical control' },
        { name: 'General linguistic range', raw: rangeRaw, max: 2, desc: 'Range and precision of language' },
        { name: 'Spelling', raw: spellingRaw, max: 2, desc: 'Spelling accuracy' },
      ],
      totalRaw,
      totalMax: 13,
    };
  },

  describeImage(text, promptText='') {
    const tokens = this.tokenize(text);
    const wc = tokens.length;
    const hasNumber = /\b\d+/.test(text);
    const hasTrend = /(increase|decrease|rise|fall|trend|higher|lower|compare|comparison|peak)/i.test(text);
    const hasConclusion = /(overall|in conclusion|to conclude|in summary|this suggests|this shows)/i.test(text);
    const keyword = this.keywordCoverage(text, promptText, 6);
    let contentRaw = 0;
    if (wc >= 20) contentRaw++;
    if (hasNumber || hasTrend) contentRaw++;
    if (hasTrend && hasConclusion) contentRaw++;
    if (keyword.coverage >= 0.3) contentRaw++;
    if (wc >= 45 && hasTrend && hasConclusion) contentRaw++;
    contentRaw = Math.min(5, contentRaw);
    const fluency = this.fluencyScore(text, 5);
    const pronun = this.pronunciationScore(text, promptText || text, 5);
    const totalRaw = contentRaw + fluency.raw + pronun.raw;
    const totalMax = 15;
    const pte = this.toPTE(totalRaw, totalMax);
    return {
      pte,
      label: this.gradeLabel(pte),
      rubric: [
        { name: 'Content', raw: contentRaw, max: 5, desc: 'Coverage of main visual features' },
        { name: 'Oral Fluency', raw: fluency.raw, max: 5, desc: 'Rhythm, phrasing, delivery' },
        { name: 'Pronunciation', raw: pronun.raw, max: 5, desc: 'Speech clarity approximation' },
      ],
      totalRaw,
      totalMax,
    };
  },

  retellLecture(text, sourceText='') {
    const keyword = this.keywordCoverage(text, sourceText, 10);
    let contentRaw = 0;
    if (keyword.coverage >= 0.2) contentRaw = 1;
    if (keyword.coverage >= 0.35) contentRaw = 2;
    if (keyword.coverage >= 0.5) contentRaw = 3;
    if (keyword.coverage >= 0.65) contentRaw = 4;
    if (keyword.coverage >= 0.8) contentRaw = 5;
    const fluency = this.fluencyScore(text, 5);
    const pronun = this.pronunciationScore(text, sourceText, 5);
    const totalRaw = contentRaw + fluency.raw + pronun.raw;
    const totalMax = 15;
    const pte = this.toPTE(totalRaw, totalMax);
    return {
      pte,
      label: this.gradeLabel(pte),
      rubric: [
        { name: 'Content', raw: contentRaw, max: 5, desc: `Lecture keywords matched: ${keyword.matched.length}/${Math.max(keyword.keywords.length,1)}` },
        { name: 'Oral Fluency', raw: fluency.raw, max: 5, desc: 'Rhythm, phrasing, delivery' },
        { name: 'Pronunciation', raw: pronun.raw, max: 5, desc: 'Speech clarity approximation' },
      ],
      totalRaw,
      totalMax,
    };
  },

  writeDictation(typed, original) {
    const origWords = this.tokenize(original);
    const typedWords = this.tokenize(typed);
    const typedMap = {};
    typedWords.forEach(w => { typedMap[w] = (typedMap[w] || 0) + 1; });
    let correct = 0;
    origWords.forEach(w => {
      if (typedMap[w] > 0) {
        correct++;
        typedMap[w]--;
      }
    });
    const pte = this.toPTE(correct, origWords.length);
    return {
      pte,
      label: this.gradeLabel(pte),
      correct,
      total: origWords.length,
      pct: Math.round(correct / Math.max(origWords.length, 1) * 100),
    };
  },

  summarizeSpoken(text, sourceText, wordRange=[50,70]) {
    const wc = countWords(text);
    const tokens = this.tokenize(text);
    const unique = new Set(tokens).size;
    const keyword = this.keywordCoverage(text, sourceText, 10);

    let contentRaw = 0;
    if (keyword.coverage >= 0.35) contentRaw = 1;
    if (keyword.coverage >= 0.55) contentRaw = 2;

    const formRaw = (wc >= wordRange[0] && wc <= wordRange[1]) ? 1 : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3).length;
    const avgLen = wc / Math.max(sentences, 1);
    const grammarRaw = avgLen >= 8 && avgLen <= 30 ? 2 : avgLen >= 5 ? 1 : 0;
    const ttr = unique / Math.max(tokens.length, 1);
    const vocabRaw = ttr > 0.55 ? 2 : ttr > 0.4 ? 1 : 0;
    const spellingRaw = wc >= wordRange[0] ? 2 : 1;

    let totalRaw = contentRaw + formRaw + grammarRaw + vocabRaw + spellingRaw;
    if (contentRaw === 0 || formRaw === 0) totalRaw = 0;

    const pte = this.toPTE(totalRaw, 9);
    return {
      pte,
      label: this.gradeLabel(pte),
      words: wc,
      inRange: wc >= wordRange[0] && wc <= wordRange[1],
      rubric: [
        { name: 'Content', raw: contentRaw, max: 2, desc: `Lecture keywords matched: ${keyword.matched.length}/${Math.max(keyword.keywords.length,1)}` },
        { name: 'Form', raw: formRaw, max: 1, desc: `${wordRange[0]}–${wordRange[1]} words (yours: ${wc})` },
        { name: 'Grammar', raw: grammarRaw, max: 2, desc: 'Accuracy' },
        { name: 'Vocabulary', raw: vocabRaw, max: 2, desc: 'Range' },
        { name: 'Spelling', raw: spellingRaw, max: 2, desc: 'Accuracy' },
      ],
      totalRaw,
      totalMax: 9,
    };
  },

  escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  getRubricPct(result, primaryName, fallbackName='') {
    const item = (result.rubric || []).find(r => r.name === primaryName || r.name === fallbackName);
    if (!item) return 0;
    return Math.round((item.raw / Math.max(item.max, 1)) * 100);
  },

  getSpeakingInsights(result, transcript, reference='') {
    const isEn = typeof getAppLang === 'function' ? getAppLang() === 'en' : false;
    const pronunciation = this.getRubricPct(result, 'Pronunciation');
    const fluency = this.getRubricPct(result, 'Oral Fluency', 'Fluency');
    const content = this.getRubricPct(result, 'Content');
    const words = this.tokenize(transcript);
    const fillerCount = (transcript.match(/\b(um|uh|erm|like)\b/gi) || []).length;
    const repeatedCount = words.reduce((count, word, index) => count + (index > 0 && word === words[index - 1] ? 1 : 0), 0);
    const issues = [];

    if (pronunciation < 70) issues.push(isEn ? 'Pronunciation needs clearer word endings and more consistent stress on key words.' : '发音部分需要更清晰的词尾发音，以及更稳定的关键词重音。');
    if (fluency < 70) issues.push(isEn ? 'Fluency drops in parts of the answer. Try shorter thought groups and fewer pauses.' : '流利度在部分位置有下降，建议用更短的意群并减少停顿。');
    if (content < 70) issues.push(isEn ? 'Content coverage is limited. Include more of the core ideas from the prompt.' : '内容覆盖不够完整，建议把题目的核心信息再多带出一些。');
    if (fillerCount > 1) issues.push(isEn ? 'There are a few filler words. Aim for cleaner transitions instead of “um” or “uh”.' : '有一些语气词，尽量减少 “um” 或 “uh” 这类填充音，让表达更干净。');
    if (repeatedCount > 1) issues.push(isEn ? 'Some words were repeated. Keep your delivery tighter and more direct.' : '有些词出现了重复，表达可以再更紧凑、更直接一些。');
    if (words.length < 6) issues.push(isEn ? 'The response is quite short. Add one more complete idea to sound more complete.' : '回答偏短，可以多补充一个完整的信息点，让内容更完整。');

    const focus = [
      { key: 'pronunciation', score: pronunciation, text: isEn ? 'Focus next on sentence stress and cleaner consonant endings.' : '下一步重点练句子重音和更清晰的辅音词尾。' },
      { key: 'fluency', score: fluency, text: isEn ? 'Focus next on smoother pacing and grouping words into short natural phrases.' : '下一步重点练更平稳的语速，以及把句子分成自然短语来表达。' },
      { key: 'content', score: content, text: isEn ? 'Focus next on covering the main idea first, then add one supporting detail.' : '下一步重点先说清主旨，再补充一个支撑细节。' },
    ].sort((a, b) => a.score - b.score)[0];

    let suggestion = focus.text;
    if (focus.key === 'fluency' && fillerCount > 0) suggestion += isEn ? ' A brief pause is fine, but avoid filling silence with extra sounds.' : ' 短暂停顿没有问题，但尽量不要用额外的填充音去补空白。';
    if (focus.key === 'content' && reference) suggestion += isEn ? ' Before speaking, decide on 2 key points you want to include.' : ' 开口前先想好自己一定要覆盖的 2 个关键信息点。';
    if (focus.key === 'pronunciation') suggestion += isEn ? ' Read one sentence slower first, then repeat it at a natural speed.' : ' 可以先把一句话慢速读清楚，再练到自然语速。';

    return {
      pronunciation,
      fluency,
      content,
      issues: issues.slice(0, 3),
      suggestion,
    };
  },

  renderTranscriptMarkup(transcript, reference='') {
    const refWords = new Set(this.tokenize(reference));
    return (transcript || '')
      .split(/\s+/)
      .filter(Boolean)
      .map((rawWord, index, list) => {
        const clean = this.normalize(rawWord);
        const isFiller = /^(um|uh|erm|like)$/i.test(clean);
        const isRepeat = index > 0 && clean && clean === this.normalize(list[index - 1]);
        const isOffPrompt = reference && clean && !refWords.has(clean);
        const cls = isFiller || isRepeat || isOffPrompt ? 'transcript-chip subtle-error' : 'transcript-chip';
        return `<span class="${cls}">${this.escapeHtml(rawWord)}</span>`;
      })
      .join(' ');
  },

  renderSpeakingResult({ questionTitle, score, transcript, reference='', audioUrl='', retryAction, nextAction }) {
    const isEn = typeof getAppLang === 'function' ? getAppLang() === 'en' : false;
    const insight = this.getSpeakingInsights(score, transcript, reference);
    const issueHtml = insight.issues.map(item => `<li>${this.escapeHtml(item)}</li>`).join('');
    const transcriptHtml = this.renderTranscriptMarkup(transcript, reference);
    return `
<div class="speaking-result-shell">
  <div class="speaking-result-top card">
    <div>
      <div class="eyebrow">${isEn ? 'Speaking Feedback' : '口语反馈'}</div>
      <div class="speaking-result-title">${this.escapeHtml(questionTitle)}</div>
    </div>
    <div class="speaking-result-tools">
      ${audioUrl ? `<audio class="result-audio-player" controls src="${audioUrl}"></audio>` : `<div class="result-audio-empty">${isEn ? 'Recording playback unavailable' : '录音回放暂不可用'}</div>`}
      <button class="btn btn-outline" onclick="${retryAction}">${isEn ? 'Retry' : '重录'}</button>
    </div>
  </div>

  <div class="speaking-score-grid">
    <div class="speaking-score-main card">
      <div class="speaking-score-label">${isEn ? 'Practice Score' : '练习分'}</div>
      <div class="speaking-score-value">${score.pte}</div>
      <div class="speaking-score-note">${isEn ? 'Estimated speaking practice score based on your response.' : '根据你的回答估算出的口语练习分。'}</div>
    </div>
    <div class="speaking-subscore card">
      <div class="speaking-subscore-label">${isEn ? 'Pronunciation' : '发音'}</div>
      <div class="speaking-subscore-value">${insight.pronunciation}</div>
    </div>
    <div class="speaking-subscore card">
      <div class="speaking-subscore-label">${isEn ? 'Fluency' : '流利度'}</div>
      <div class="speaking-subscore-value">${insight.fluency}</div>
    </div>
    <div class="speaking-subscore card">
      <div class="speaking-subscore-label">${isEn ? 'Content' : '内容'}</div>
      <div class="speaking-subscore-value">${insight.content}</div>
    </div>
  </div>

  <div class="card speaking-feedback-card">
    <div class="card-title">${isEn ? 'Transcript' : '转写结果'}</div>
    <div class="transcript-rich">${transcriptHtml || `<span class="transcript-empty">${isEn ? 'No transcript available.' : '暂无转写结果。'}</span>`}</div>
    <div class="recorder-note">${isEn ? 'Subtle highlights show words that may need another look.' : '浅色标记表示这些词可能还需要再检查一下。'}</div>
  </div>

  <div class="speaking-feedback-grid">
    <div class="card speaking-feedback-card">
      <div class="card-title">${isEn ? 'Key Issues' : '主要问题'}</div>
      <ul class="issue-list">${issueHtml || `<li>${isEn ? 'Good baseline attempt. Keep refining clarity and control.' : '这次基础表现不错，继续提升清晰度和控制感会更好。'}</li>`}</ul>
    </div>
    <div class="card speaking-feedback-card">
      <div class="card-title">${isEn ? 'Suggestion' : '建议'}</div>
      <p class="ai-suggestion">${this.escapeHtml(insight.suggestion)}</p>
    </div>
  </div>

  <div class="speaking-result-actions">
    <button class="btn btn-primary" onclick="${retryAction}">${isEn ? 'Retry' : '重录'}</button>
    <button class="btn btn-secondary" onclick="${nextAction}">${isEn ? 'Next Question' : '下一题'}</button>
  </div>
</div>`;
  },

  renderLocalSpeakingResult({ questionType, questionTitle, result, transcript, reference='', audioUrl='', retryAction='', nextAction='', showActions=true, showHeader=true, showWeighting=true }) {
    const isEn = typeof getAppLang === 'function' ? getAppLang() === 'en' : false;
    const insight = this.getSpeakingInsights(result, transcript, reference);
    const isMobile = this.shouldUseCompactSpeakingUI();

    if (isMobile && window.AIScorer) {
      const metrics = (result.rubric || []).map(r => ({
        key: r.name.toLowerCase().replace(/\s+/g, '_'),
        label: r.name,
        value: Math.round((r.raw / Math.max(r.max, 1)) * 90),
        desc: r.desc || '',
      }));
      const bestScore = Math.max(insight.pronunciation, insight.fluency, insight.content);
      const strengthText = bestScore >= insight.pronunciation
        ? (isEn ? 'Good fluency and pronunciation foundation — keep building on it.' : '流利度和发音基础不错，继续巩固。')
        : (isEn ? 'Solid pronunciation — focus on building fluency next.' : '发音基础扎实，下一步专注提升流利度。');
      const transcriptHtml = this.renderTranscriptMarkup(transcript, reference);
      const actions = [
        retryAction ? `<button class="btn btn-primary" onclick="${retryAction}">${isEn ? 'Record Again' : '重新录音'}</button>` : '',
        nextAction ? `<button class="btn btn-secondary" onclick="${nextAction}">${isEn ? 'Next Question' : '下一题'}</button>` : '',
      ].filter(Boolean).join('');
      return `
${AIScorer.renderResultHero({ score: result.pte || 0, title: questionType || (isEn ? 'Speaking Practice' : '口语练习'), subtitle: isEn ? '0–90 PTE Scale' : 'PTE 0–90 分制', audioUrl })}
${AIScorer.renderMetricCards(metrics)}
<div class="card speaking-result-card" style="margin-top:12px">
  <div class="card-title">${isEn ? 'Feedback' : '评分反馈'}</div>
  ${AIScorer.renderTaskFeedbackChips(questionType, { result, insight, transcript, reference })}
  <div class="speaking-feedback-stack">
    ${AIScorer.renderFeedbackBlock('strength', strengthText)}
    ${insight.issues[0] ? AIScorer.renderFeedbackBlock('improve', insight.issues[0]) : ''}
    ${AIScorer.renderFeedbackBlock('suggestion', insight.suggestion)}
  </div>
</div>
<div class="card speaking-result-card" style="margin-top:12px">
  <div class="card-title">${isEn ? 'Transcript Review' : '转写回顾'}</div>
  <div class="transcript-rich">${transcriptHtml || `<span class="transcript-empty">${isEn ? 'No transcript available.' : '暂无转写结果。'}</span>`}</div>
  <div class="recorder-note">${isEn ? 'Local score based on public PTE trait descriptions.' : '该本地评分依据公开的 PTE 评分维度说明生成。'}</div>
</div>
${showActions && actions ? `<div class="speaking-result-actions">${actions}</div>` : ''}`;
    }

    const issueHtml = insight.issues.map(item => `<li>${this.escapeHtml(item)}</li>`).join('');
    const transcriptHtml = this.renderTranscriptMarkup(transcript, reference);
    const actions = [
      retryAction ? `<button class="btn btn-primary" onclick="${retryAction}">${isEn ? 'Record Again' : '重新录音'}</button>` : '',
      nextAction ? `<button class="btn btn-secondary" onclick="${nextAction}">${isEn ? 'Next Question' : '下一题'}</button>` : '',
    ].filter(Boolean).join('');
    return `
${showHeader ? `<div class="card" style="margin-top:12px">
  <div class="card-title">${isEn ? 'Official Practice Result' : '官方规则练习结果'}</div>
  <div style="font-size:13px;color:var(--text-light);line-height:1.7">${this.escapeHtml(questionTitle || '')}</div>
</div>` : ''}
${this.renderPanel(result)}
${showWeighting ? this.renderOfficialWeighting(questionType) : ''}
<div class="card speaking-feedback-card" style="margin-top:12px">
  <div class="card-title">${isEn ? 'Transcript Review' : '转写回顾'}</div>
  <div class="transcript-rich">${transcriptHtml || `<span class="transcript-empty">${isEn ? 'No transcript available.' : '暂无转写结果。'}</span>`}</div>
  <div class="recorder-note">${isEn ? 'This local score follows public PTE trait descriptions and approximate band mapping.' : '该本地评分依据公开的 PTE 评分维度说明和近似分段映射生成。'}</div>
</div>
<div class="speaking-feedback-grid" style="margin-top:12px">
  <div class="card speaking-feedback-card">
    <div class="card-title">${isEn ? 'Key Issues' : '主要问题'}</div>
    ${window.AIScorer ? AIScorer.renderTaskFeedbackChips(questionType, { result, insight, transcript, reference }) : ''}
    <ul class="issue-list">${issueHtml || `<li>${isEn ? 'This attempt is a solid start. Keep polishing clarity and coverage.' : '这次作答已经有不错基础，继续提升清晰度和内容覆盖会更好。'}</li>`}</ul>
  </div>
  <div class="card speaking-feedback-card">
    <div class="card-title">${isEn ? 'Improvement Focus' : '提升建议'}</div>
    <p class="ai-suggestion">${this.escapeHtml(insight.suggestion)}</p>
  </div>
</div>
${showActions && actions ? `<div class="speaking-result-actions">${actions}</div>` : ''}`;
  },

  renderLocalStructuredResult({ questionType, title, result, notesHtml='', retryAction='', nextAction='' }) {
    const isEn = typeof getAppLang === 'function' ? getAppLang() === 'en' : false;
    const actions = [
      retryAction ? `<button class="btn btn-primary" onclick="${retryAction}">${isEn ? 'Try Again' : '重新作答'}</button>` : '',
      nextAction ? `<button class="btn btn-secondary" onclick="${nextAction}">${isEn ? 'Next Question' : '下一题'}</button>` : '',
    ].filter(Boolean).join('');
    if (this.shouldUseCompactSpeakingUI() && window.AIScorer) {
      return `
${AIScorer.renderStructuredResult({
  overall: result.pte ?? 0,
  feedback: result.label || '',
  transcript: '',
}, {
  title: title || (isEn ? 'Practice Result' : '练习结果'),
  subtitle: isEn ? '0–90 PTE Scale' : 'PTE 0–90 分制',
  metrics: this.buildRubricMetrics(result),
})}
${AIScorer.renderTaskFeedbackChips(questionType, { result })}
${this.renderOfficialWeighting(questionType)}
${notesHtml || ''}
${actions ? `<div class="speaking-result-actions">${actions}</div>` : ''}`;
    }
    return `
<div class="card" style="margin-top:12px">
  <div class="card-title">${isEn ? 'Official Practice Result' : '官方规则练习结果'}</div>
  <div style="font-size:13px;color:var(--text-light);line-height:1.7">${this.escapeHtml(title || '')}</div>
</div>
${this.renderPanel(result)}
${window.AIScorer ? AIScorer.renderTaskFeedbackChips(questionType, { result }) : ''}
${this.renderOfficialWeighting(questionType)}
${notesHtml || ''}
${actions ? `<div class="speaking-result-actions">${actions}</div>` : ''}`;
  },

  renderPanel(result) {
    const isEn = typeof getAppLang === 'function' ? getAppLang() === 'en' : false;
    const barsHtml = result.rubric.map(r => {
      const pct = Math.round(r.raw / r.max * 100);
      const fill = this.gradeColor(pct);
      return `<div class="score-bar-row">
  <div class="score-bar-label" style="width:130px;font-size:12.5px">${r.name} <span style="font-weight:400;color:var(--text-light)">${r.raw}/${r.max}</span></div>
  <div class="score-bar-track"><div class="score-bar-fill" style="width:${pct}%;background:${fill}"></div></div>
  <div style="font-size:11px;color:var(--text-light);min-width:120px;padding-left:8px">${r.desc}</div>
</div>`;
    }).join('');

    return `
<div class="score-panel" style="margin-top:14px">
  <div style="display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap">
    <div>
      <div class="score-big" style="color:#fff">${result.pte}</div>
      <div class="score-label">${isEn ? 'PTE Score (10–90)' : 'PTE 分数（10–90）'}</div>
    </div>
    <div style="flex:1"></div>
    <div style="text-align:right">
      <div style="font-size:18px;font-weight:700;color:#fff">${result.label}</div>
      <div style="font-size:11px;opacity:0.7">${result.totalRaw}/${result.totalMax} ${isEn ? 'raw points' : '原始分'}</div>
    </div>
  </div>
</div>
<div class="card" style="margin-top:10px">
  <div style="font-size:12px;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">${isEn ? 'Official Trait Breakdown' : '官方评分维度拆解'}</div>
  ${barsHtml}
</div>`;
  },
};
