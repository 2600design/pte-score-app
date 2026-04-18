Pages['practice-read-aloud'] = function() {
  const items = DB.readAloud.map((item, index, list) => ({
    id: item.id,
    title: `Question ${index + 1}`,
    content: item.text,
    preview: item.text,
    meta: item.tag || `${t('question_label')} ${index + 1}`,
    isPrediction: /预测/.test(item.tag || ''),
    isNew: index >= Math.max(0, list.length - 3),
    icon: '📖',
  }));

  renderQuestionListPage({
    pageKey: 'practice-read-aloud',
    title: t('ra_title'),
    subtitle: t('ra_subtitle'),
    description: t('question_list_desc_ra'),
    detailPage: 'read-aloud',
    items,
  });
};

Pages['practice-repeat-sentence'] = function() {
  const sourceItems = getQuestionSet(DB.repeatSentence, 'repeatSentence', item => ({
    id: item.id,
    text: item.content,
    tag: `${t('prediction_badge')} · ${item.monthTag}`,
    isPrediction: true,
  }));

  const items = sourceItems.map((item, index, list) => ({
    id: item.id,
    title: `Question ${index + 1}`,
    content: item.text,
    preview: item.text,
    meta: item.tag || `${t('question_label')} ${index + 1}`,
    isPrediction: !!item.isPrediction || /预测/.test(item.tag || ''),
    isNew: index >= Math.max(0, list.length - 3),
    icon: '🔁',
  }));

  renderQuestionListPage({
    pageKey: 'practice-repeat-sentence',
    title: t('rs_title'),
    subtitle: t('rs_subtitle'),
    description: t('question_list_desc_rs'),
    detailPage: 'repeat-sentence',
    items,
  });
};

Pages['practice-describe-image'] = function() {
  const usingPredictionBank = getQuestionSource().source === 'prediction';
  const sourceItems = usingPredictionBank
    ? getQuestionSet(DB.describeImage, 'describeImage', item => ({
        id: item.id,
        title: item.content,
        preview: item.answer || '',
        image: null,
        typeLabel: item.templateType ? getDiTemplateTypeLabel(String(item.templateType).split('_')[0]) : t('prediction_type_describe_image'),
        isPrediction: true,
      }))
    : getDiTemplates().map(item => ({
        id: item.id,
        title: item.title,
        preview: item.description || '',
        image: item.image,
        typeLabel: getDiTemplateTypeLabel(item.type),
        isPrediction: false,
      }));

  const items = sourceItems.map((item, index, list) => ({
    id: item.id,
    title: item.title,
    content: item.preview || item.title,
    preview: item.preview || item.title,
    image: item.image || '',
    meta: `${t('question_label')} ${index + 1}`,
    typeLabel: item.typeLabel,
    isPrediction: !!item.isPrediction,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '🖼️',
  }));

  renderQuestionListPage({
    pageKey: 'practice-describe-image',
    title: t('di_title'),
    subtitle: t('di_subtitle'),
    description: t('question_list_desc_di'),
    detailPage: 'describe-image',
    items,
  });
};

Pages['practice-retell-lecture'] = function() {
  const sourceItems = getQuestionSet(DB.retellLecture, 'retellLecture', item => ({
    id: item.id,
    title: item.content,
    transcript: item.transcript || item.answer || item.content,
    isPrediction: true,
  }));

  const items = sourceItems.map((item, index, list) => ({
    id: item.id,
    title: item.title || `Question ${index + 1}`,
    content: item.transcript,
    preview: item.transcript,
    meta: `${t('question_label')} ${index + 1}`,
    isPrediction: !!item.isPrediction,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '🎙️',
  }));

  renderQuestionListPage({
    pageKey: 'practice-retell-lecture',
    title: t('rl_title'),
    subtitle: t('rl_subtitle'),
    description: t('question_list_desc_rl'),
    detailPage: 'retell-lecture',
    items,
  });
};

Pages['practice-answer-short'] = function() {
  const sourceItems = getQuestionSet(DB.answerShort, 'answerShortQuestion', item => ({
    id: item.id,
    question: item.content,
    answer: item.answer || '',
    isPrediction: true,
  }));

  const items = sourceItems.map((item, index, list) => ({
    id: item.id,
    title: `Question ${index + 1}`,
    content: item.question,
    preview: item.question,
    meta: `${t('question_label')} ${index + 1}`,
    isPrediction: !!item.isPrediction,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '❓',
  }));

  renderQuestionListPage({
    pageKey: 'practice-answer-short',
    title: t('asq_title'),
    subtitle: t('asq_subtitle'),
    description: t('question_list_desc_asq'),
    detailPage: 'answer-short',
    items,
  });
};

Pages['practice-write-dictation'] = function() {
  const sourceItems = getQuestionSet(DB.writeDictation, 'writeFromDictation', item => ({
    id: item.id,
    sentence: item.content,
    isPrediction: true,
  }));

  const items = sourceItems.map((item, index, list) => ({
    id: item.id,
    title: `Question ${index + 1}`,
    content: item.sentence,
    preview: item.sentence,
    meta: `${t('question_label')} ${index + 1}`,
    isPrediction: !!item.isPrediction,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '✏️',
  }));

  renderQuestionListPage({
    pageKey: 'practice-write-dictation',
    title: t('wfd_title'),
    subtitle: t('wfd_subtitle'),
    description: t('question_list_desc_wfd'),
    detailPage: 'write-dictation',
    items,
  });
};

Pages['practice-summarize-written'] = function() {
  const items = DB.summarizeWritten.map((item, index, list) => ({
    id: item.id,
    title: item.title || `Question ${index + 1}`,
    content: item.text,
    preview: item.text,
    meta: `${t('question_label')} ${index + 1}`,
    isPrediction: /预测/.test(item.tag || ''),
    isNew: index >= Math.max(0, list.length - 3),
    icon: '📝',
  }));
  renderQuestionListPage({ pageKey: 'practice-summarize-written', title: t('swt_title'), subtitle: t('swt_subtitle'), description: t('question_list_desc_swt'), detailPage: 'summarize-written', items });
};

Pages['practice-write-essay'] = function() {
  const items = DB.writeEssay.map((item, index, list) => ({
    id: item.id,
    title: item.title || `Question ${index + 1}`,
    content: item.prompt,
    preview: item.prompt,
    meta: `${t('question_label')} ${index + 1}`,
    isPrediction: /预测/.test(item.tag || ''),
    isNew: index >= Math.max(0, list.length - 3),
    icon: '✍️',
  }));
  renderQuestionListPage({ pageKey: 'practice-write-essay', title: t('we_title'), subtitle: t('we_subtitle').replace('${min}', 200).replace('${max}', 300), description: t('question_list_desc_we'), detailPage: 'write-essay', items });
};

Pages['practice-rw-fill-blanks'] = function() {
  const items = DB.rwFillBlanks.map((item, index, list) => ({
    id: item.id,
    title: item.title || `Question ${index + 1}`,
    content: item.parts.join(' ___ '),
    preview: item.parts.join(' ___ '),
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '🔤',
  }));
  renderQuestionListPage({ pageKey: 'practice-rw-fill-blanks', title: t('rwfb_title'), subtitle: t('question_list_subheading'), description: t('question_list_desc_rwfb'), detailPage: 'rw-fill-blanks', items });
};

Pages['practice-mc-single-reading'] = function() {
  const items = DB.mcSingleReading.map((item, index, list) => ({
    id: item.id,
    title: `Question ${index + 1}`,
    content: item.question,
    preview: item.question,
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '🔘',
  }));
  renderQuestionListPage({ pageKey: 'practice-mc-single-reading', title: t('mcsr_title'), subtitle: t('question_list_subheading'), description: t('question_list_desc_mcsr'), detailPage: 'mc-single-reading', items });
};

Pages['practice-mc-multiple-reading'] = function() {
  const items = DB.mcMultipleReading.map((item, index, list) => ({
    id: item.id,
    title: `Question ${index + 1}`,
    content: item.question,
    preview: item.question,
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '☑️',
  }));
  renderQuestionListPage({ pageKey: 'practice-mc-multiple-reading', title: t('mcmr_title'), subtitle: t('question_list_subheading'), description: t('question_list_desc_mcmr'), detailPage: 'mc-multiple-reading', items });
};

Pages['practice-reorder-paragraphs'] = function() {
  const items = DB.reorderParagraphs.map((item, index, list) => ({
    id: item.id,
    title: `Question ${index + 1}`,
    content: item.sentences.map(s => s.text).join(' '),
    preview: item.sentences.map(s => s.text).join(' '),
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '🔀',
  }));
  renderQuestionListPage({ pageKey: 'practice-reorder-paragraphs', title: t('reorder_title'), subtitle: t('question_list_subheading'), description: t('question_list_desc_reorder'), detailPage: 'reorder-paragraphs', items });
};

Pages['practice-r-fill-blanks'] = function() {
  const items = DB.rFillBlanks.map((item, index, list) => ({
    id: item.id,
    title: item.title || `Question ${index + 1}`,
    content: item.fullText,
    preview: item.fullText,
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '📋',
  }));
  renderQuestionListPage({ pageKey: 'practice-r-fill-blanks', title: t('rfb_title'), subtitle: t('question_list_subheading'), description: t('question_list_desc_rfb'), detailPage: 'r-fill-blanks', items });
};

Pages['practice-summarize-spoken'] = function() {
  const items = DB.summarizeSpoken.map((item, index, list) => ({
    id: item.id,
    title: item.title || `Question ${index + 1}`,
    content: item.transcript,
    preview: item.transcript,
    meta: `${t('question_label')} ${index + 1}`,
    isPrediction: /预测/.test(item.tag || ''),
    isNew: index >= Math.max(0, list.length - 3),
    icon: '🎧',
  }));
  renderQuestionListPage({ pageKey: 'practice-summarize-spoken', title: t('sst_title'), subtitle: t('sst_subtitle'), description: t('question_list_desc_sst'), detailPage: 'summarize-spoken', items });
};

Pages['practice-mc-single-listening'] = function() {
  const items = DB.mcSingleListening.map((item, index, list) => ({
    id: item.id,
    title: `Question ${index + 1}`,
    content: item.question,
    preview: item.question,
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '🔘',
  }));
  renderQuestionListPage({ pageKey: 'practice-mc-single-listening', title: t('mcsl_title'), subtitle: t('mcsl_subtitle'), description: t('question_list_desc_mcsl'), detailPage: 'mc-single-listening', items });
};

Pages['practice-mc-multiple-listening'] = function() {
  const items = DB.mcMultipleListening.map((item, index, list) => ({
    id: item.id,
    title: `Question ${index + 1}`,
    content: item.question,
    preview: item.question,
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '☑️',
  }));
  renderQuestionListPage({ pageKey: 'practice-mc-multiple-listening', title: t('mcml_title'), subtitle: t('mcml_subtitle'), description: t('question_list_desc_mcml'), detailPage: 'mc-multiple-listening', items });
};

Pages['practice-fill-blanks-listening'] = function() {
  const items = DB.fillBlanksListening.map((item, index, list) => ({
    id: item.id,
    title: item.title || `Question ${index + 1}`,
    content: item.transcript,
    preview: item.transcript,
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '🎵',
  }));
  renderQuestionListPage({ pageKey: 'practice-fill-blanks-listening', title: t('fbl_title'), subtitle: t('fbl_subtitle'), description: t('question_list_desc_fbl'), detailPage: 'fill-blanks-listening', items });
};

Pages['practice-highlight-summary'] = function() {
  const items = DB.highlightSummary.map((item, index, list) => ({
    id: item.id,
    title: item.title || `Question ${index + 1}`,
    content: item.transcript,
    preview: item.transcript,
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '💡',
  }));
  renderQuestionListPage({ pageKey: 'practice-highlight-summary', title: t('hcs_title'), subtitle: t('hcs_subtitle'), description: t('question_list_desc_hcs'), detailPage: 'highlight-summary', items });
};

Pages['practice-select-missing'] = function() {
  const items = DB.selectMissing.map((item, index, list) => ({
    id: item.id,
    title: item.title || `Question ${index + 1}`,
    content: item.transcript,
    preview: item.transcript,
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '🔍',
  }));
  renderQuestionListPage({ pageKey: 'practice-select-missing', title: t('smw_title'), subtitle: t('smw_subtitle'), description: t('question_list_desc_smw'), detailPage: 'select-missing', items });
};

Pages['practice-highlight-incorrect'] = function() {
  const items = DB.highlightIncorrect.map((item, index, list) => ({
    id: item.id,
    title: item.title || `Question ${index + 1}`,
    content: item.transcript,
    preview: item.transcript,
    meta: `${t('question_label')} ${index + 1}`,
    isNew: index >= Math.max(0, list.length - 3),
    icon: '❌',
  }));
  renderQuestionListPage({ pageKey: 'practice-highlight-incorrect', title: t('hi_title'), subtitle: t('hi_subtitle'), description: t('question_list_desc_hi'), detailPage: 'highlight-incorrect', items });
};
