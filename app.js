// ── App Router ─────────────────────────────────────────────────────────────
// Pages is declared inline in index.html before page modules load

window.I18N = {
  zh: {
    // Nav
    nav_home: '首页', nav_practice: '练习', nav_progress: '进度', nav_study_plan: '学习计划', nav_study_plan_short: '计划',
    nav_account: '账号', nav_settings: '设置', nav_account_settings: '我的', nav_mock_test: '模考',
    nav_section_learning: '学习', nav_section_account: '账号', nav_section_practice: '练习', nav_section_tools: '工具',
    nav_smart_practice: '智能练习', nav_tools: '工具', nav_prediction_bank: '预测题库', nav_high_frequency: '高频题', nav_mistakes: '错题本', nav_audio_trainer: '语音训练',
    nav_question_bank: '题库', nav_profile: '个人中心', nav_support: 'Support', nav_privacy: 'Privacy',
    nav_practice_history: '练习记录', nav_wrong_answers: '错题本', nav_saved_recordings: '录音记录',
    nav_predicted_questions: '预测题', nav_high_frequency_questions: '高频题',
    nav_pronunciation_training: '发音训练', nav_my_account: '账户设置',
    nav_all_types: '全部题型', nav_speaking: 'Speaking', nav_writing: 'Writing', nav_reading: 'Reading', nav_listening: 'Listening',
    label_home: '主页', label_speaking: '口语', label_writing: '写作', label_reading: '阅读', label_listening: '听力', label_mixed: '综合',
    audioTrainer: '随身听训练', audio_trainer_subtitle: '像播放器一样连续收听 Repeat Sentence 和 Write From Dictation。', audio_trainer_read_aloud: 'Read Aloud', audio_trainer_repeat_sentence: 'Repeat Sentence',
    audio_trainer_current_type: '当前题型', audio_trainer_progress: '进度', audio_trainer_autoplay: '自动播放', audio_trainer_filter: '题型筛选',
    audio_trainer_rs: 'RS', audio_trainer_wfd: 'WFD', audio_trainer_empty: '当前筛选下没有可播放题目。',
    // Theme
    theme_button_dark: '切换到深色模式',
    theme_button_light: '切换到浅色模式',
    // Common
    page_not_found: '页面未找到',
    btn_prev: '上一题', btn_next: '下一题', btn_submit: '提交', btn_submit_answer: '提交答案', btn_submit_essay: '提交作文',
    btn_back_to_list: '返回题目列表',
    btn_re_record: '重新录音', btn_done: '完成', btn_cancel: '取消', btn_skip: '跳过', btn_finish: '完成录音',
    btn_start_recording: '开始录音', btn_play_audio: '播放音频', btn_play_system_voice: '使用系统语音播放', btn_pause_audio: '暂停音频', btn_sign_in: '登录', btn_sign_in_google: '登录', btn_continue_guest: '游客继续',
    btn_continue_practice: '继续练习', btn_my_progress: '我的进度', btn_start_practice: '开始练习', btn_explore_tasks: '探索练习题',
    badge_speaking: '口语', badge_writing: '写作', badge_reading: '阅读', badge_listening: '听力', badge_ai: 'AI 评分',
    word_count_label: '词', words: '词', question_label: '第', question_of: '/',
    tasks_label: '题', questions_label: '题',
    // Status / Recording
    status_beginning: '即将开始，还剩 ${n} 秒', status_recording: '录音中，还剩 ${n} 秒',
    status_play_first: '请先播放音频', status_ready_record: '即将开始录音',
    status_recording_now: '正在录音…', status_describe_now: '正在录音…',
    status_listen_sentence: '听句子',
    result_failed_start: '未检测到有效语音', result_recording_complete: '录音完成', result_no_speech: '未捕获到有效语音',
    result_failed_sub: '未检测到有效语音。录音开始后，你必须在 3 秒内开始作答，否则本次作答将记为 0 分。',
    result_ready_sub: '您的回答已准备好，可在下方评分。',
    result_answer_ready: '您的答案已准备好，可在下方评分。',
    result_description_ready: '您的描述已准备好，可在下方评分。',
    result_no_speech_sub: '请检查麦克风权限是否开启，并确保环境安静后重新录音。',
    // Submission panel messages
    panel_record_or_upload: '录制简短回答，或上传音频文件以获得评分。',
    panel_record_new: '录制新的回答，或上传简短语音文件。',
    panel_uploaded_ready: '上传的文件已准备好，可提交评分。',
    panel_upload_another: '上传另一个文件，或使用上方录音机。',
    panel_recording_ready: '录音已准备好，可提交评分，或上传其他文件。',
    panel_upload_or_record: '上传支持格式的音频文件，或重新录制回答。',
    panel_record_answer: '录制回答，或上传语音文件。',
    panel_study_then_record: '您也可以上传简短语音文件，或点击上方开始录音。',
    // Toast / errors
    toast_no_audio: '请先录音或上传音频再提交。', toast_mic_error: '语音识别错误：', toast_audio_error: '该音频文件无法使用。', audio_not_available: '音频暂不可用。', audio_system_voice_hint: '系统语音效果可能因浏览器或设备不同而略有差异',
    toast_local_record_only: '无 AI 评分模式下，上传音频暂不支持自动评分，请直接使用应用内录音。',
    toast_cancel_msg: '录音已取消，可重新开始。', toast_exit_msg: '已退出录音，可重新开始。',
    toast_rs_cancel: '录音已取消，请重试。', toast_rs_exit: '已退出本次尝试，可重新录音。',
    toast_di_cancel: '录音已取消，请复习图片后重试。', toast_di_exit: '已退出本次尝试，准备好后再试。',
    // Score messages
    score_fail_no_start: '未检测到有效语音。录音开始后，你必须在 3 秒内开始作答，否则本次作答将记为 0 分。',
    score_no_speech: '⚠️ 未检测到语音。请允许麦克风权限后重试。',
    mic_unavailable_alert: '麦克风不可用，请在系统设置中开启权限。',
    score_10_label: '评分：10/90',
    // Read Aloud
    ra_title: 'Read Aloud', ra_subtitle: '朗读文本，考察发音与流利度。',
    ra_instruction: '请朗读下方文本，保持清晰自然。',
    // Repeat Sentence
    rs_title: 'Repeat Sentence', rs_subtitle: '听句复述，考察记忆与表达能力。',
    rs_instruction: '你将听到一个句子。请完全按照你听到的内容复述该句子。你只会听到一次。',
    // Describe Image
    di_title: 'Describe Image', di_subtitle: '描述图像内容，考察组织与表达能力。',
    di_instruction: '请观察图片，并用清晰有条理的语言进行描述。',
    di_prep_locked: '请先观察图片，25 秒结束后才能开始录音',
    di_prep_ready: '观察结束，现在可以开始录音',
    di_template_bank: '模板图片库', di_random_label: '随机模板', di_filter_all: '全部',
    di_type_line: 'Line Graph', di_type_bar: 'Bar Chart', di_type_pie: 'Pie Chart', di_type_process: 'Process Diagram', di_type_map: 'Map',
    di_type_badge: '题型', di_difficulty_badge: '难度', di_randomize_btn: '换一张',
    // Re-tell Lecture
    rl_title: 'Re-tell Lecture', rl_subtitle: '复述讲座内容，考察听力与概括能力。',
    rl_instruction: '你将听到一段讲座。请用自己的话复述主要内容。',
    rl_listen_label: '听讲座',
    rl_status_ready: '听完讲座后，点击麦克风录制复述。',
    rl_status_recording: '🔴 复述讲座内容',
    // Answer Short Question
    asq_title: 'Answer Short Question', asq_subtitle: '简短作答，考察理解与反应能力。',
    asq_instruction: '你将听到一个问题。请简短作答。',
    asq_listen_label: '听问题',
    asq_status_ready: '听完问题后录制你的简短答案。',
    asq_status_recording: '🔴 正在录音 — 简短回答问题',
    // Summarize Written Text
    swt_title: 'Summarize Written Text', swt_subtitle: '阅读文章并写一句总结。',
    swt_instruction: '📌 只写一句话。字数范围：${min}–${max} 词。',
    swt_placeholder: '在此写下你的单句总结……',
    // Write Essay
    we_title: 'Write Essay', we_subtitle: '完成作文写作，考察结构与表达能力。',
    we_instruction: '📌 写 ${min}–${max} 词。结构：引言 → 正文 → 结论。',
    we_tip: '💡 结构提示：引言（2–3 句）→ 第一论点+例子 → 第二论点+例子 → 结论（2–3 句）',
    we_placeholder: '在此写下你的文章……',
    we_prompt_label: '题目',
    // Summarize Spoken Text
    sst_title: 'Summarize Spoken Text', sst_subtitle: '听录音并写出简洁总结。',
    sst_instruction: '🎧 只听一遍，记笔记，然后写总结。字数范围：${min}–${max} 词。',
    sst_notes_placeholder: '快速记录……', sst_summary_placeholder: '在此写下你的总结……',
    // Practice page
    practice_eyebrow: '练习', practice_heading: '练习',
    practice_landing_subtitle: '选择技能并进入对应题型练习。',
    practice_landing_note: '按技能进入题型列表，开始专项练习。',
    practice_landing_modules_copy: '进入题型列表，开始练习。',
    practice_subheading: '选择题型开始练习。',
    practice_focus_title: '练习',
    practice_focus_copy: '进入题型列表，开始练习。',
    practice_speaking_title: '口语练习', practice_speaking_subtitle: '选择题型开始练习。',
    practice_writing_title: '写作练习', practice_writing_subtitle: '选择题型开始练习。',
    practice_reading_title: '阅读练习', practice_reading_subtitle: '选择题型开始练习。',
    practice_listening_title: '听力练习', practice_listening_subtitle: '选择题型开始练习。',
    question_list_heading: '题目列表', question_list_subheading: '进入题型列表，开始练习。',
    question_list_start: '开始练习', question_list_locked: '登录后解锁', question_list_empty: '当前暂无可练习题目。',
    question_list_preview: '免费预览', question_list_pick_prompt: '请选择一道题开始练习',
    question_search_placeholder: '搜索题目关键词', question_filter_all: '全部', question_filter_latest: '最新', question_filter_prediction: '预测题', question_filter_unlocked: '可练习', question_filter_locked: '已锁定',
    question_sort_newest: '最新优先', question_sort_oldest: '最早优先', question_sort_az: 'A-Z',
    question_list_desc_ra: '朗读文本，练习发音与流利度。',
    question_list_desc_rs: '听句复述，练习记忆与表达。',
    question_list_desc_di: '描述图像内容，练习结构化表达。',
    question_list_desc_rl: '复述讲座内容，练习概括与表达。',
    question_list_desc_asq: '简短作答，练习快速理解与回答。',
    question_list_desc_wfd: '听写句子，练习听写准确度。',
    question_list_desc_swt: '阅读文章并写一句总结。',
    question_list_desc_we: '完成作文写作，练习结构与表达。',
    question_list_desc_rwfb: '完成填空，练习语境理解。',
    question_list_desc_mcsr: '单项选择，练习阅读理解。',
    question_list_desc_mcmr: '多项选择，练习信息判断。',
    question_list_desc_reorder: '排序段落，练习篇章逻辑。',
    question_list_desc_rfb: '阅读填空，练习词汇与语境。',
    question_list_desc_sst: '听录音并写出简洁总结。',
    question_list_desc_mcsl: '听录音并选择最佳答案。',
    question_list_desc_mcml: '听录音并选择所有正确答案。',
    question_list_desc_fbl: '听录音并填写缺失单词。',
    question_list_desc_hcs: '选择最符合录音内容的总结。',
    question_list_desc_smw: '选择缺失单词，补全句子。',
    question_list_desc_hi: '找出与录音不一致的单词。',
    practice_auth_note: '登录以保存分数并跨会话追踪进度。',
    practice_questions: '题', practice_tasks: '题',
    practice_speaking_desc: '进入口语题型练习，提升表达与流利度。',
    practice_writing_desc: '进入写作题型练习，强化结构与表达能力。',
    practice_reading_desc: '进入阅读题型练习，提升理解与答题速度。',
    practice_listening_desc: '进入听力题型练习，提升信息捕捉能力。',
    practice_entry_label: '进入该题型',
    practice_recent_score: '最近分数',
    practice_no_score: '未练习',
    practice_free_preview: '免费体验 ${count} 题',
    practice_locked_more: '登录后解锁更多',
    // Home page
    hero_eyebrow: 'PTE 学术考试练习',
    hero_title_guest: 'PTE 练习\n获取结构化反馈',
    hero_subtitle_guest: '练习核心 PTE 题型，带计时、结构化评分和进度追踪。',
    home_title: '学习首页', home_subtitle: '快速进入四大技能练习与学习工具。',
    home_directory_subtitle: '快速进入四大技能练习与学习工具。',
    home_directory_modules_eyebrow: '学习首页',
    home_directory_modules_title: '四大技能',
    home_directory_modules_copy: '快速进入四大技能练习与学习工具。',
    home_directory_smart_eyebrow: '智能练习',
    home_directory_smart_title: '高效刷题区',
    home_directory_smart_copy: '集中练习高频题与重点题型。',
    home_directory_tools_eyebrow: '工具',
    home_directory_tools_title: '考试与学习工具',
    home_directory_tools_copy: '辅助练习与模拟考试入口。',
    home_module_speaking_desc: '进入口语题型练习，提升表达与流利度。',
    home_module_writing_desc: '进入写作题型练习，强化结构与表达能力。',
    home_module_reading_desc: '进入阅读题型练习，提升理解与答题速度。',
    home_module_listening_desc: '进入听力题型练习，提升信息捕捉能力。',
    home_directory_prediction_desc: '按趋势优先练习高价值题目。',
    home_directory_high_frequency_desc: '集中强化常考题型。',
    home_directory_mistakes_desc: '复盘历史错误，针对性提升。',
    home_directory_audio_desc: '进行连续语音练习，提升语感与稳定性。',
    home_directory_mock_desc: '进入完整 Mock Test 流程，按考试节奏练习。',
    home_directory_progress_desc: '查看分数趋势、最近记录和模块表现。',
    home_directory_plan_desc: '打开学习计划，按今天的安排继续练习。',
    home_today_title: '今日进度', home_recent_title: '最近记录', home_quick_title: '快捷入口',
    home_today_goal: '今日目标', home_today_done: '今日完成', home_today_minutes: '最近 7 天练习次数',
    home_recent_empty: '还没有最近记录，先完成一题开始建立学习轨迹。',
    home_quick_resume: '继续最近题型', home_quick_progress: '查看进度', home_quick_plan: '打开学习计划',
    home_quick_practice: '浏览全部题型', home_quick_mock_test: '模拟考试', home_continue_last_task: '继续上次练习', home_today_streak: '连续天数', home_today_types: '已练题型',
    home_card_start: '开始练习', home_card_open: '打开',
    home_header_eyebrow: '学习首页',
    home_focus_subtitle: '把今天最重要的学习动作集中到一个控制中心里。',
    home_goal_complete: '今日目标已完成，继续保持这股节奏。',
    home_goal_remaining: '距离今日目标还差 ${n} 次练习。',
    home_goal_latest: '上次练习：${task}',
    home_goal_empty: '先开始一个题型，系统会在这里帮你续上进度。',
    home_recent_all: '查看全部记录',
    home_shortcuts_title: '学习捷径',
    home_shortcuts_subtitle: '把高频动作整理在一个更轻的操作面板里。',
    home_shortcut_progress_desc: '查看趋势、均分和最近分数变化。',
    home_shortcut_plan_desc: '回到本周学习计划并安排练习节奏。',
    home_shortcut_practice_desc: '从 Speaking / Writing / Reading / Listening 进入。',
    home_shortcut_prediction_desc: '进入预测题库，优先练高回报题目。',
    home_mock_test_desc: '进入完整模拟考试流程，不修改页面内容，只恢复考试入口。',
    home_mock_test_cta: '开始模拟考试',
    hero_welcome: '欢迎回来',
    hero_last_practiced: '你上次练习了',
    hero_start_history: '开始一个任务以建立练习历史。',
    time_minutes_ago: '${n} 分钟前', time_hours_ago: '${n} 小时前', time_days_ago: '${n} 天前',
    stat_day_streak: '天连续', stat_total_attempts: '总练习次数', stat_this_week: '本周练习',
    features_eyebrow: '你能得到什么', features_title1: '结构化评分', features_title2: '考试风格练习', features_title3: '进度追踪',
    features_desc1: '快速获得流利度、发音、语法、内容等维度的分数拆解。',
    features_desc2: '全部 20 种真实 PTE 学术考试题型，带真实格式提示和时限。',
    features_desc3: '查看历史得分，找出薄弱环节，遵循结构化学习计划持续提升。',
    modules_eyebrow: '练习模块', modules_heading: '四大技能，全部题型。',
    modules_subheading: '选择模块查看所含题型。口语、写作和听力支持结构化评分。',
    how_eyebrow: '如何使用', how_step1_num: '01', how_step1_title: '选择题型', how_step1_desc: '按技能或模块浏览题目，每道题均符合真实 PTE 学术考试格式。',
    how_step2_num: '02', how_step2_title: '按指导练习', how_step2_desc: '在计时和准备提示下完成题目，就像真实考试一样。',
    how_step3_num: '03', how_step3_title: '查看结果并追踪进度', how_step3_desc: '查看分数拆解，然后在个人仪表板中追踪进步。',
    teaser_title: '解锁完整练习体验', teaser_desc: '登录以保存分数、查看结构化反馈、建立练习历史，并跨会话追踪进度。',
    speaking_module_desc: '录制回答，快速获得流利度、发音和口语语法评分。',
    writing_module_desc: '总结文章并撰写作文，获得内容、形式和语言使用的结构化反馈。',
    reading_module_desc: '练习所有阅读题型，带答案核对和每题解析。',
    listening_module_desc: '用全长音频剪辑训练听力，涵盖所有听力题型。',
    home_tag_read_aloud: 'Read Aloud', home_tag_repeat_sentence: 'Repeat Sentence', home_tag_describe_image: 'Describe Image',
    home_tag_retell_lecture: 'Re-tell Lecture', home_tag_swt: 'Summarize Written Text', home_tag_write_essay: 'Write Essay',
    home_tag_fill_blanks: '完形填空', home_tag_multiple_choice: '选择题', home_tag_reorder_paragraphs: '段落排序',
    home_tag_summarize_spoken: 'Summarize Spoken Text', home_tag_write_dictation: 'Write From Dictation',
    mod_explore: '浏览模块 →', mod_scored: '评分', sample_preview: '示例结果 · 仅供预览',
    // Settings
    settings_title: '设置', settings_subtitle: '管理练习环境、账号访问及 AI 评分连接。',
    settings_ai_eyebrow: 'AI 评分', settings_ai_title: '由后端管理的评分',
    settings_ai_desc: 'AI 评分现由后端服务处理。模型凭证保存在服务器，不会存储在应用端。',
    settings_backend_api: '后端 API：', settings_access_rule: '访问规则：', settings_access_rule_val: '登录后使用 AI 评分',
    settings_model_key: '模型密钥位置：', settings_model_key_val: '仅限服务器环境变量',
    settings_account_eyebrow: '账号', settings_account_title: '认证状态',
    settings_signed_in_as: '已登录为', settings_scoring_note: '。AI 评分请求将包含您的访问令牌。',
    settings_sign_in_note: '登录以解锁 AI 评分并同步练习历史。',
    btn_logout: '退出登录',
    settings_mic_eyebrow: '麦克风权限', settings_mic_title: '一次性语音权限',
    settings_mic_current: '当前状态：', settings_mic_desc: '为 localhost:3000 一次性允许麦克风访问，减少语音任务的权限弹窗。',
    btn_enable_mic: '启用麦克风', mic_already_enabled: '✓ 麦克风已启用',
    account_settings_title: '账号设置', account_settings_subtitle: '管理账号状态、同步保存和应用设置。',
    app_settings_title: '应用设置', account_settings_language: '语言', account_settings_mic_simple: '麦克风权限（用于口语练习）', mic_status_label: '当前状态',
    settings_coverage_title: 'AI 评分覆盖范围',
    settings_speaking_coverage: '口语 — Read Aloud, Repeat Sentence, Describe Image, Re-tell Lecture',
    settings_speaking_sub: '结构化评分：总分、内容、流利度、发音',
    settings_writing_coverage: '写作 — Write Essay, Summarize Written Text',
    settings_writing_sub: '结构化评分：内容、语法、词汇、拼写',
    settings_listening_coverage: '听力 — Write From Dictation, Summarize Spoken Text',
    settings_listening_sub: '后端 AI 评分，含结构化反馈和转写',
    settings_reading_coverage: '阅读 — 本地自动评分（无需 AI）',
    settings_reading_sub: '客观答案匹配',
    // Progress
    progress_title: '我的进度', progress_subtitle: '追踪你在所有 PTE 题型中的练习表现。',
    progress_chart_title: '分数趋势', progress_chart_empty: '完成练习后，这里会出现你的分数趋势。',
    progress_history_title: '历史记录', progress_history_empty: '还没有练习历史，先去完成一题。',
    progress_focus_title: '重点提升区', progress_focus_empty: '完成几次练习后，我们会在这里提示当前更该优先练的题型。',
    progress_plan_title: '建议学习安排', progress_reset_local: '重置本地进度',
    progress_guest_title: '登录后可同步完整进度', progress_guest_copy: '当前只显示本机记录。登录后可跨设备同步分数与历史。',
    progress_latest_count: '条记录', progress_recent_meta: '最近一次',
    guest_locked_label: '访客模式', guest_feature_locked_title: '登录后解锁完整功能',
    guest_unlock_more_title: '当前为示例体验', guest_unlock_more_copy: '当前开放 ${visible} / ${total} 道示例题。登录后可解锁完整题库、无限练习与结果保存。',
    guest_unlock_more_toast: '登录后可解锁更多题目与完整功能。',
    guest_sign_in_unlock: '登录后解锁更多',
    study_plan_guest_title: '学习计划已锁定', study_plan_guest_copy: '登录后可保存学习计划、同步学习记录，并获得更完整的个性化安排。',
    prediction_bank_title: '🔥 预测题库', prediction_bank_subtitle: '练习高频和最新预测题。',
    prediction_filter_all: '全部', prediction_filter_bank: 'Prediction Bank', prediction_filter_latest: '最新', prediction_filter_high: '高频 🔥',
    prediction_badge: '🔥 Prediction', prediction_high_badge: '🔥 High Frequency', prediction_empty: '当前还没有已激活的预测题。新导入题会先进入 review，确认后才会在这里显示。',
    prediction_month_label: '月份', prediction_latest_label: '最近新增',
    prediction_card_open: '打开预测题', prediction_review_note: '新导入预测题默认进入 review，只有 active 状态才会对用户显示。',
    prediction_type_repeat_sentence: 'Repeat Sentence', prediction_type_write_from_dictation: 'Write From Dictation', prediction_type_answer_short_question: 'Answer Short Question', prediction_type_describe_image: 'Describe Image', prediction_type_retell_lecture: 'Retell Lecture',
    prediction_curated_count: '${count} 道精选题', prediction_type_all: '全部题型', prediction_type_label: '题型',
    prediction_recommended_title: '🔥 推荐练习', prediction_recommended_desc: '优先练这些高权重、高回报题型。',
    prediction_reco_fast_boost: '快速拉分', prediction_reco_di_copy: 'Describe Image 是口语中非常关键的得分项。', prediction_reco_wfd_copy: 'Write From Dictation 对听力和写作准确率都很重要。',
    prediction_start_cta: '开始练习 →', prediction_view_all_cta: '查看全部', prediction_questions_count: '${count} Questions',
    prediction_completed_progress: '${done}/${total} completed', prediction_last_practiced: '上次练习：${time}', prediction_never_practiced: '还没有练习记录',
    prediction_common_exam: '考试中最常见', prediction_continue: '继续上次进度', continue_where_left_off: 'Continue where you left off',
    mistakes_title: '错题本', mistakes_subtitle: '自动收集最近分数低于 60 分的 Speaking 和 Listening 题目，优先复练。', mistakes_empty: '当前还没有进入错题本的题目。先完成几次 Speaking 或 Listening 练习后再回来查看。',
    mistakes_retry: '重新练习', mistakes_score_label: '上次分数', mistakes_time_label: '最近练习', mistakes_mark_mastered: '标记已掌握',
    mistakes_tab_speaking: 'Speaking', mistakes_tab_listening: 'Listening',
    continue_question_label: '继续这道题', continue_open_cta: '继续',
    stats: '统计', total_attempts: '总练习次数', types_practiced: '已练题型',
    of_types: '共 19 种题型', overall_average: '平均分', est_pte_score: '预估 PTE 分数', pts_90: '/ 90 分',
    by_section: '按部分', practiced: '已练习', pts: '分', reset_all_stats: '重置全部数据',
    progress_reset: '进度已重置', all_types: '全部题型',
    // Study Plan
    study_plan_title: '学习计划', study_plan_subtitle: '按顺序完成今天的核心练习。',
    study_plan_card_focus: '本周重点', study_plan_card_load: '当前练习量', study_plan_card_session: '建议单次时长',
    study_plan_open_practice: '打开练习页',
    weekly_focus: '本周重点', best_fast_gain: '更适合快速提分', current_practice_load: '当前练习量',
    total_completed_sessions: '累计完成练习次数', suggested_session: '建议单次时长',
    speaking_listening_block: '2 个口语 + 1 个听力模块', recommended_daily_structure: '推荐每日练习结构',
    plan_step_1: '1. 先做一个口语热身：Read Aloud 或 Repeat Sentence',
    plan_step_2: '2. 接一个高准确率听力任务：Write From Dictation 或 Fill in the Blanks',
    plan_step_3: '3. 最后做一个长题：Summarize Written Text、Essay 或 Re-tell Lecture',
    study_plan_today_tasks: '今日任务', study_plan_task_rs: 'Repeat Sentence（10题）', study_plan_task_wfd: 'Write From Dictation（10题）', study_plan_task_di: 'Describe Image（5题）', study_plan_start_today: '开始今日计划',
    study_plan_task_label: '任务', study_plan_next_step: '下一项任务', study_plan_finish_today: '完成今日计划', study_plan_done_toast: '今日计划已完成',
    back_dashboard: '返回首页', start_speaking_block: '开始口语训练',
    // Account
    account_title: '账号', account_subtitle: '管理登录状态、同步能力与学习记录保存方式。',
    account_status_title: '当前状态', account_signed_in: '已登录', account_signed_out: '未登录',
    account_signed_in_as: '当前登录账号', account_sync_title: '同步与保存',
    account_sync_copy_in: '你的练习记录和进度会自动保存到当前账号。',
    account_sync_copy_out: '登录后，你的练习记录和进度会自动保存到当前账号。',
    account_actions_title: '快捷操作', account_open_progress: '打开我的进度', account_open_settings: '打开设置',
    account_login_hint: '登录后可解锁完整学习记录。',
    // Auth modal
    auth_modal_eyebrow: '账号', auth_modal_title_login: '欢迎回来', auth_modal_title_signup: '创建账号',
    auth_modal_copy_login: '登录以同步练习进度。',
    auth_modal_copy_signup: '用邮箱和密码注册，跨会话保存进度。',
    auth_google_btn: '使用 Google 继续', auth_apple_btn: '使用 Apple 继续', auth_divider: '或',
    auth_forgot_link: '忘记密码？', auth_forgot_title: '重置密码', auth_forgot_copy: '输入邮箱，我们将发送重置链接。',
    auth_forgot_send: '发送重置链接', auth_forgot_sending: '发送中……', auth_forgot_sent: '重置链接已发送，请查收邮件。',
    auth_forgot_back: '返回登录',
    auth_reset_title: '设置新密码', auth_reset_copy: '请输入新密码。',
    auth_new_password_label: '新密码', auth_confirm_password_label: '确认密码',
    auth_reset_save: '保存新密码', auth_reset_saving: '保存中……',
    auth_reset_success: '密码已成功更新。', auth_reset_mismatch: '两次输入的密码不一致。', auth_reset_short: '密码至少需要 6 位。',
    auth_tab_login: '登录', auth_tab_signup: '注册',
    auth_email_label: '邮箱', auth_password_label: '密码',
    auth_btn_login: '登录', auth_btn_signup: '创建账号',
    auth_btn_logging_in: '登录中……', auth_btn_creating: '注册中……',
    auth_logout_toast: '已成功退出登录。', auth_login_btn: '登录', auth_logout_confirm: '确定要退出登录吗？',
    auth_logout_dialog_title: '退出登录？', auth_logout_dialog_copy: '确定要退出登录吗？',
    auth_error_fields: '请输入邮箱和密码。',
    auth_success_verify: '账号已创建，请检查邮箱确认后登录。',
    auth_success_created: '账号创建成功，已为您登录。',
    auth_confirmed_success: '邮箱已确认，注册成功，您现在已登录。',
    auth_confirmed_error: '邮箱确认失败或链接已失效，请重新注册或再次请求确认邮件。',
    auth_avatar_title: '点击退出登录',
    delete_account_btn: '删除账号', delete_account_dialog_title: '删除账号？',
    delete_account_dialog_copy: '此操作永久不可撤销。所有练习记录、AI 评分及录音将被彻底删除。',
    delete_account_confirm: '确认删除', delete_account_deleting: '删除中……',
    delete_account_success: '账号已成功删除。', delete_account_error: '删除账号失败，请重试。',
    // Speaking audio capture panel
    audio_recorded: '录音', audio_uploaded: '上传的音频',
    btn_remove_upload: '移除上传', btn_upload_audio: '上传音频',
    audio_or_recorder: '或使用上方录音功能', audio_no_recorder: '当前设备暂不支持录音',
    btn_submit_ai: '提交评分',
    // AI scorer UI labels (NOT feedback/transcript content)
    score_analyzing: '正在分析您的回答……', score_generating: '正在生成反馈……',
    score_unavailable: 'AI 评分不可用。', score_sign_in_msg: '登录以使用 AI 评分',
    score_breakdown: '分数详情', score_feedback_label: '反馈', score_transcript_label: '转写结果',
    score_key_issues: '主要问题', score_improvements: '如何提升', score_correct_example: '正确示例',
    score_scale: 'PTE 分制 10-90', score_ai_label: 'AI 口语评估',
    score_no_feedback: '暂无反馈。', score_no_issues: '无重大问题。', score_no_improve: '暂无提升建议。',
    score_subscores_title: '分项得分', score_detailed_feedback: '详细反馈',
    score_saved_title: '录音已保存', score_saved_copy: '此评分记录已关联账号，可在进度历史中查看。',
    btn_view_progress: '在进度中查看', score_replay_empty: '录音链接可用时将在此显示回放。',
    score_recent_title: '本题近期录音', score_recent_copy: '显示本题最近的有效录音，便于对比。',
    score_latest: '最新', score_attempt: '第 ', score_save_label: '已保存至进度',
    score_save_signin: '登录以保存结果', btn_try_again: '再试一次',
    practice_score_label: '本地评分', recordings_empty: '暂无可用录音',
    rs_recent_title: '最近录音', rs_result_title: '本次结果',
    rs_status_wait: '请先播放音频', rs_status_wait_sub: '播放结束后将自动开始录音。',
    rs_status_countdown: '即将开始录音', rs_status_countdown_sub: '请准备复述听到的句子。',
    rs_status_recording: '正在录音', rs_status_recording_sub: '请完整复述刚刚听到的句子。',
    rs_status_complete: '录音完成', rs_status_complete_sub: '可提交本地评分或重新录音。',
    rs_status_no_speech: '未捕获到有效语音', rs_status_no_speech_sub: '请检查麦克风权限是否开启，并确保环境安静后重新录音。',
    rs_signin_save: '登录后才可以提交评分并保存录音。', rs_signin_cta: '立即登录',
    rs_transcript_label: '识别文本', rs_reference_label: '参考句子',
    rs_submit_ready: '录音已就绪，可提交本地评分。', rs_record_saved: '录音已保存。',
    score_overall: '总分', score_recognised: '识别转写',
    metric_content: '内容', metric_fluency: '流利度', metric_pronunciation: '发音',
    metric_grammar: '语法', metric_vocabulary: '词汇', metric_spelling: '拼写',
    // Listening pages
    mcsl_title: 'MC Single Answer', mcsl_subtitle: '听录音，选择最佳答案。',
    mcml_title: 'MC Multiple Answer', mcml_subtitle: '听录音，选出所有正确答案。',
    rwfb_title: 'R&W Fill in Blanks', mcsr_title: '阅读单选', mcmr_title: '阅读多选',
    reorder_title: 'Re-order Paragraphs', rfb_title: 'Reading Fill in Blanks',
    fbl_title: 'Fill in the Blanks', fbl_subtitle: '听录音，填写缺失的单词。',
    fbl_instruction: '📌 根据录音填写每个空格中的准确单词。',
    hcs_title: 'Highlight Correct Summary', hcs_subtitle: '听录音，选择最能概括录音内容的段落。',
    hcs_instruction: '📌 选择最能概括所听内容的段落。',
    smw_title: 'Select Missing Word', smw_subtitle: '听不完整的录音，选择完成句子的单词。',
    smw_instruction: '📌 最后一个词缺失，选择你认为能完成句子的词。',
    hi_title: 'Highlight Incorrect Words', hi_subtitle: '听录音，点击与录音不同的文字中的单词。',
    hi_instruction_pre: '📌 点击下方文字中与所听内容不同的单词。文字中共有',
    hi_instruction_suf: '个错误单词。',
    wfd_title: 'Write From Dictation', wfd_subtitle: '听录音，完全按照所听内容打出句子。',
    wfd_audio_label: '仔细听 — 可以重播',
    wfd_instruction: '📌 完全按照所听内容输入，包括标点符号。',
    wfd_placeholder: '在此输入句子……', btn_check_answer: '检查答案',
    wfd_comparison: '逐词对比', wfd_correct_sentence: '正确句子：',
    wfd_legend: '✅ 匹配 &nbsp; ❌ 缺失或错误',
    wfd_question_text: '听录音，完全按照所听内容输入句子。',
    // Shared feedback labels
    answer_correct: '✅ 正确！', answer_incorrect: '❌ 错误。',
    answer_incorrect_highlighted: '❌ 错误，正确答案已高亮。',
    btn_retry: '再试一次', btn_check: '检查',
    score_correct: '正确', score_correct_blanks: '正确填空数',
    score_correct_picks: '正确选择减去错误选择',
    auto_submitted: '时间到，已自动提交。',
    sst_original_transcript: '原始转写',
    // Answer Short Question result labels
    asq_result_title_ok: '已捕获回答', asq_result_sub_ok: '查看下方结果，或再录一次。',
    asq_result_correct: '正确！', asq_result_incorrect: '错误',
    asq_correct_answer: '正确答案', asq_your_answer: '你的答案',
    asq_score_label: '评分', asq_rule_label: '规则',
    asq_no_speech: '（未捕获到语音）',
    asq_cancel_msg: '录音已取消，请重试。', asq_exit_msg: '已退出本次尝试，可重新作答。',
    asq_play_first: '请先播放问题',
    asq_ready_default: '准备好作答 — 简洁清晰地回答',
  },
  en: {
    // Nav
    nav_home: 'Home', nav_practice: 'Practice', nav_progress: 'Progress', nav_study_plan: 'Study Plan', nav_study_plan_short: 'Plan',
    nav_account: 'Account', nav_settings: 'Settings', nav_account_settings: 'My Profile', nav_mock_test: 'Mock Test',
    nav_section_learning: 'Learning', nav_section_account: 'Account', nav_section_practice: 'Practice', nav_section_tools: 'Tools',
    nav_smart_practice: 'Smart Practice', nav_tools: 'Tools', nav_prediction_bank: 'Prediction Bank', nav_high_frequency: 'High Frequency', nav_mistakes: 'Mistakes', nav_audio_trainer: 'Audio Trainer',
    nav_question_bank: 'Question Bank', nav_profile: 'Profile', nav_support: 'Support', nav_privacy: 'Privacy',
    nav_practice_history: 'Practice History', nav_wrong_answers: 'Wrong Answers', nav_saved_recordings: 'Saved Recordings',
    nav_predicted_questions: 'Predicted Questions', nav_high_frequency_questions: 'High-frequency Questions',
    nav_pronunciation_training: 'Pronunciation Training', nav_my_account: 'Account Settings',
    nav_all_types: 'All Types', nav_speaking: 'Speaking', nav_writing: 'Writing', nav_reading: 'Reading', nav_listening: 'Listening',
    label_home: 'Home', label_speaking: 'Speaking', label_writing: 'Writing', label_reading: 'Reading', label_listening: 'Listening', label_mixed: 'Mixed',
    audioTrainer: 'Audio Trainer', audio_trainer_subtitle: 'Train in continuous playlist mode with Repeat Sentence and Write From Dictation.', audio_trainer_read_aloud: 'Read Aloud', audio_trainer_repeat_sentence: 'Repeat Sentence',
    audio_trainer_current_type: 'Current Type', audio_trainer_progress: 'Progress', audio_trainer_autoplay: 'Autoplay', audio_trainer_filter: 'Filter',
    audio_trainer_rs: 'RS', audio_trainer_wfd: 'WFD', audio_trainer_empty: 'No playable items in the current filter.',
    // Theme
    theme_button_dark: 'Switch to dark mode',
    theme_button_light: 'Switch to light mode',
    // Common
    page_not_found: 'Page not found',
    btn_prev: 'Previous', btn_next: 'Next', btn_submit: 'Submit', btn_submit_answer: 'Submit Answer', btn_submit_essay: 'Submit Essay',
    btn_back_to_list: 'Back to Question List',
    btn_re_record: 'Re-record', btn_done: 'Done', btn_cancel: 'Cancel', btn_skip: 'Skip', btn_finish: 'FINISH',
    btn_start_recording: 'Start Recording', btn_play_audio: 'Play Audio', btn_play_system_voice: 'Play with system voice', btn_pause_audio: 'Pause Audio', btn_sign_in: 'Sign in', btn_sign_in_google: 'Sign in', btn_continue_guest: 'Continue as guest',
    btn_continue_practice: 'Continue Practice', btn_my_progress: 'My Progress', btn_start_practice: 'Start Practice', btn_explore_tasks: 'Explore Practice Tasks',
    badge_speaking: 'Speaking', badge_writing: 'Writing', badge_reading: 'Reading', badge_listening: 'Listening', badge_ai: 'AI Scoring',
    word_count_label: 'words', words: 'words', question_label: 'Question', question_of: '/',
    tasks_label: 'tasks', questions_label: 'questions',
    // Status / Recording
    status_beginning: 'Beginning in ${n} seconds', status_recording: 'recording ${n} seconds',
    status_play_first: 'Play the audio to begin', status_ready_record: 'Recording will start shortly',
    status_recording_now: 'Recording...', status_describe_now: 'Recording...',
    status_listen_sentence: 'Listen to the sentence',
    result_failed_start: 'No speech detected', result_recording_complete: 'Recording complete', result_no_speech: 'No valid speech captured',
    result_failed_sub: 'No valid speech was detected. You must start speaking within 3 seconds after recording begins, otherwise this response will receive 0.',
    result_ready_sub: 'Your response is ready for scoring below.',
    result_answer_ready: 'Your answer is ready for scoring below.',
    result_description_ready: 'Your description is ready for scoring below.',
    result_no_speech_sub: 'Check microphone access, make sure the room is quiet, and record again.',
    // Submission panel messages
    panel_record_or_upload: 'Record a short response or upload an audio file to submit for scoring.',
    panel_record_new: 'Record a new answer or upload a short speaking audio file.',
    panel_uploaded_ready: 'Your uploaded file is ready. Submit it when you are ready.',
    panel_upload_another: 'Upload another file or use the recorder above.',
    panel_recording_ready: 'Your recording is ready. Submit it now or upload a different file.',
    panel_upload_or_record: 'Upload a supported audio file or record your answer again.',
    panel_record_answer: 'Record your answer or upload a short speaking audio file.',
    panel_study_then_record: 'You can also upload a short speaking audio file, or tap above to start recording.',
    // Toast / errors
    toast_no_audio: 'Record or upload audio before submitting.', toast_mic_error: 'Speech recognition error: ', toast_audio_error: 'That audio file could not be used.', audio_not_available: 'Audio unavailable.', audio_system_voice_hint: 'System voice may vary by browser or device',
    toast_local_record_only: 'In no-AI scoring mode, uploaded audio cannot be scored automatically yet. Please record directly in the app.',
    toast_cancel_msg: 'Recording cancelled. You can start again.', toast_exit_msg: 'Ready to record again whenever you are.',
    toast_rs_cancel: 'Recording cancelled. Try again.', toast_rs_exit: 'Attempt exited. You can record again.',
    toast_di_cancel: 'Recording cancelled. Review the image and try again.', toast_di_exit: 'Attempt exited. Ready for another try.',
    // Score messages
    score_fail_no_start: 'No valid speech was detected. You must start speaking within 3 seconds after recording begins, otherwise this response will receive 0.',
    score_no_speech: '⚠️ No speech detected. Please allow microphone access and try again.',
    mic_unavailable_alert: 'Microphone unavailable. Please enable access in system settings.',
    score_10_label: 'Score: 10/90',
    // Read Aloud
    ra_title: 'Read Aloud', ra_subtitle: 'Read the text aloud clearly and fluently.',
    ra_instruction: 'Read the text aloud clearly and naturally.',
    // Repeat Sentence
    rs_title: 'Repeat Sentence', rs_subtitle: 'Listen and repeat the sentence accurately.',
    rs_instruction: 'You will hear a sentence. Please repeat the sentence exactly as you hear it. You will hear the sentence only once.',
    // Describe Image
    di_title: 'Describe Image', di_subtitle: 'Describe the image clearly and in order.',
    di_instruction: 'Look at the image and describe the main information clearly.',
    di_prep_locked: 'Study the image first. Recording unlocks after 25 seconds.',
    di_prep_ready: 'Study time finished. You can start recording now.',
    di_template_bank: 'DI Template Bank', di_random_label: 'Random Template', di_filter_all: 'All',
    di_type_line: 'Line Graph', di_type_bar: 'Bar Chart', di_type_pie: 'Pie Chart', di_type_process: 'Process Diagram', di_type_map: 'Map',
    di_type_badge: 'Type', di_difficulty_badge: 'Difficulty', di_randomize_btn: 'Shuffle',
    // Re-tell Lecture
    rl_title: 'Re-tell Lecture', rl_subtitle: 'Retell the lecture in your own words.',
    rl_instruction: 'You will hear a lecture. Retell the main points in your own words.',
    rl_listen_label: 'Listen to the lecture',
    rl_status_ready: 'Listen to the lecture, then press the mic to record your re-tell.',
    rl_status_recording: '🔴 Re-tell the lecture now',
    // Answer Short Question
    asq_title: 'Answer Short Question', asq_subtitle: 'Answer briefly and accurately.',
    asq_instruction: 'You will hear a question. Give a short answer.',
    asq_listen_label: 'Listen to the question',
    asq_status_ready: 'Listen to the question, then record your short answer.',
    asq_status_recording: '🔴 Recording — answer the question briefly',
    // Summarize Written Text
    swt_title: 'Summarize Written Text', swt_subtitle: 'Read the passage and write one summary sentence.',
    swt_instruction: '📌 Write ONE sentence. Range: ${min}–${max} words.',
    swt_placeholder: 'Write your one-sentence summary here...',
    // Write Essay
    we_title: 'Write Essay', we_subtitle: 'Write an essay with clear structure and ideas.',
    we_instruction: '📌 Write ${min}–${max} words. Structure: Introduction → Body → Conclusion.',
    we_tip: '💡 Structure tip: Introduction (2–3 sentences) → Point 1 with example → Point 2 with example → Conclusion (2–3 sentences)',
    we_placeholder: 'Write your essay here...',
    we_prompt_label: 'Prompt',
    // Summarize Spoken Text
    sst_title: 'Summarize Spoken Text', sst_subtitle: 'Listen and write a concise summary.',
    sst_instruction: '🎧 Listen once, take notes, then write your summary. Range: ${min}–${max} words.',
    sst_notes_placeholder: 'Quick notes...', sst_summary_placeholder: 'Write your summary here...',
    // Practice page
    practice_eyebrow: 'Practice', practice_heading: 'Practice',
    practice_landing_subtitle: 'Select a skill to start practicing question types.',
    practice_landing_note: 'Choose a skill to open its question types.',
    practice_landing_modules_copy: 'Start practicing question types.',
    practice_subheading: 'Select a question type to begin.',
    practice_focus_title: 'Practice',
    practice_focus_copy: 'Start practicing question types.',
    practice_speaking_title: 'Speaking Practice', practice_speaking_subtitle: 'Select a question type to begin.',
    practice_writing_title: 'Writing Practice', practice_writing_subtitle: 'Select a question type to begin.',
    practice_reading_title: 'Reading Practice', practice_reading_subtitle: 'Select a question type to begin.',
    practice_listening_title: 'Listening Practice', practice_listening_subtitle: 'Select a question type to begin.',
    question_list_heading: 'Question List', question_list_subheading: 'Start practicing question types.',
    question_list_start: 'Start Practice', question_list_locked: 'Sign in to unlock', question_list_empty: 'There are no practice questions here yet.',
    question_list_preview: 'Free Preview', question_list_pick_prompt: 'Choose a question to begin',
    question_search_placeholder: 'Search questions', question_filter_all: 'All', question_filter_latest: 'Latest', question_filter_prediction: 'Prediction', question_filter_unlocked: 'Unlocked', question_filter_locked: 'Locked',
    question_sort_newest: 'Newest', question_sort_oldest: 'Oldest', question_sort_az: 'A-Z',
    question_list_desc_ra: 'Read the text aloud clearly and fluently.',
    question_list_desc_rs: 'Listen and repeat the sentence accurately.',
    question_list_desc_di: 'Describe the image clearly and in order.',
    question_list_desc_rl: 'Retell the lecture in your own words.',
    question_list_desc_asq: 'Answer the question briefly and accurately.',
    question_list_desc_wfd: 'Listen and write the sentence exactly.',
    question_list_desc_swt: 'Read the passage and write one summary sentence.',
    question_list_desc_we: 'Write an essay with clear structure and ideas.',
    question_list_desc_rwfb: 'Complete the blanks using context clues.',
    question_list_desc_mcsr: 'Choose the best answer from the passage.',
    question_list_desc_mcmr: 'Select all correct answers from the passage.',
    question_list_desc_reorder: 'Reorder the paragraphs into a logical sequence.',
    question_list_desc_rfb: 'Fill the blanks using reading context.',
    question_list_desc_sst: 'Listen and write a concise summary.',
    question_list_desc_mcsl: 'Listen and choose the best answer.',
    question_list_desc_mcml: 'Listen and select all correct answers.',
    question_list_desc_fbl: 'Listen and fill in the missing words.',
    question_list_desc_hcs: 'Choose the summary that best matches the audio.',
    question_list_desc_smw: 'Select the missing word to complete the audio.',
    question_list_desc_hi: 'Identify words that differ from the audio.',
    practice_auth_note: 'Sign in to save your scores and track progress across sessions.',
    practice_questions: 'questions', practice_tasks: 'tasks',
    practice_speaking_desc: 'Practice speaking tasks to improve fluency and delivery.',
    practice_writing_desc: 'Practice writing tasks to improve structure and clarity.',
    practice_reading_desc: 'Practice reading tasks to improve comprehension and speed.',
    practice_listening_desc: 'Practice listening tasks to improve accuracy and focus.',
    practice_entry_label: 'Open task',
    practice_recent_score: 'Recent score',
    practice_no_score: 'Not started',
    practice_free_preview: '${count} free sample questions',
    practice_locked_more: 'Sign in to unlock more',
    // Home page
    hero_eyebrow: 'PTE Academic Practice',
    hero_title_guest: 'PTE Practice\nwith Structured Feedback',
    hero_subtitle_guest: 'Practice core PTE tasks with timed flows, structured scoring, and progress tracking built for consistent study.',
    home_title: 'Study Dashboard', home_subtitle: 'Quick access to skill practice and study tools.',
    home_directory_subtitle: 'Quick access to skill practice and study tools.',
    home_directory_modules_eyebrow: 'Study Dashboard',
    home_directory_modules_title: 'Four Skills',
    home_directory_modules_copy: 'Quick access to skill practice and study tools.',
    home_directory_smart_eyebrow: 'Smart Practice',
    home_directory_smart_title: 'Smart Practice',
    home_directory_smart_copy: 'Focus on high-frequency and key questions.',
    home_directory_tools_eyebrow: 'Tools',
    home_directory_tools_title: 'Tools',
    home_directory_tools_copy: 'Access mock tests and study tools.',
    home_module_speaking_desc: 'Practice speaking tasks to improve fluency and delivery.',
    home_module_writing_desc: 'Practice writing tasks to improve structure and clarity.',
    home_module_reading_desc: 'Practice reading tasks to improve comprehension and speed.',
    home_module_listening_desc: 'Practice listening tasks to improve accuracy and focus.',
    home_directory_prediction_desc: 'Practice predicted high-value questions.',
    home_directory_high_frequency_desc: 'Focus on frequently tested questions.',
    home_directory_mistakes_desc: 'Review mistakes and improve efficiently.',
    home_directory_audio_desc: 'Train continuous speaking for better consistency.',
    home_directory_mock_desc: 'Open the full Mock Test flow and practice with exam rhythm.',
    home_directory_progress_desc: 'Check score trends, recent records, and module performance.',
    home_directory_plan_desc: 'Open your study plan and continue with today’s schedule.',
    home_today_title: 'Today', home_recent_title: 'Recent Records', home_quick_title: 'Quick Access',
    home_today_goal: 'Today goal', home_today_done: 'Completed today', home_today_minutes: 'Attempts in last 7 days',
    home_recent_empty: 'No recent records yet. Finish one task to start building your study trail.',
    home_quick_resume: 'Resume latest task', home_quick_progress: 'View progress', home_quick_plan: 'Open study plan',
    home_quick_practice: 'Browse all tasks', home_quick_mock_test: 'Mock Test', home_continue_last_task: 'Continue Last Task', home_today_streak: 'Streak', home_today_types: 'Types tried',
    home_card_start: 'Start', home_card_open: 'Open',
    home_header_eyebrow: 'Study Dashboard',
    home_focus_subtitle: 'Keep today’s most important study actions in one control center.',
    home_goal_complete: 'Today’s goal is done. Keep the momentum going.',
    home_goal_remaining: 'You are ${n} practice block(s) away from today’s goal.',
    home_goal_latest: 'Last practiced: ${task}',
    home_goal_empty: 'Start one task and we will keep your next step ready here.',
    home_recent_all: 'View all records',
    home_shortcuts_title: 'Study Shortcuts',
    home_shortcuts_subtitle: 'A lighter action rail for the things you open most often.',
    home_shortcut_progress_desc: 'Check trends, averages, and your latest score changes.',
    home_shortcut_plan_desc: 'Jump back into this week’s plan and shape your study rhythm.',
    home_shortcut_practice_desc: 'Open the full task library across all four skills.',
    home_shortcut_prediction_desc: 'Open the prediction bank and start with high-impact sets.',
    home_mock_test_desc: 'Open the full mock exam flow without changing the existing page content.',
    home_mock_test_cta: 'Start Mock Test',
    hero_welcome: 'Welcome back',
    hero_last_practiced: 'You last practiced',
    hero_start_history: 'Start a task to build your practice history.',
    time_minutes_ago: '${n}m ago', time_hours_ago: '${n}h ago', time_days_ago: '${n}d ago',
    stat_day_streak: 'day streak', stat_total_attempts: 'total attempts', stat_this_week: 'this week',
    features_eyebrow: 'What you get', features_title1: 'Structured Scoring', features_title2: 'Exam-style Practice', features_title3: 'Progress Tracking',
    features_desc1: 'Get fast score breakdowns for fluency, pronunciation, grammar, content, and more in supported tasks.',
    features_desc2: 'All 20 question types from the actual PTE Academic exam, with real-format prompts and time limits.',
    features_desc3: 'See your scores over time, identify weak areas, and follow a structured study plan to improve.',
    modules_eyebrow: 'Practice modules', modules_heading: 'Four skills. All question types.',
    modules_subheading: 'Choose a module to see the tasks it covers. Supported speaking, writing, and listening tasks include structured scoring.',
    how_eyebrow: 'How it works', how_step1_num: '01', how_step1_title: 'Choose a task', how_step1_desc: 'Browse tasks by skill or module. Each question matches the actual PTE Academic format.',
    how_step2_num: '02', how_step2_title: 'Practice with guidance', how_step2_desc: 'Work through the question with timing and preparation prompts, just like the real exam.',
    how_step3_num: '03', how_step3_title: 'Review results and track progress', how_step3_desc: 'See your score breakdown, then follow your improvement in your personal dashboard.',
    teaser_title: 'Unlock your full practice experience', teaser_desc: 'Sign in to save your scores, view structured feedback, build practice history, and track progress across sessions.',
    speaking_module_desc: 'Record your answers and get scored on fluency, pronunciation, and oral grammar in seconds.',
    writing_module_desc: 'Summarize texts and write essays with structured feedback on content, form, and language use.',
    reading_module_desc: 'Practice all reading task types with answer checking and explanation for each question.',
    listening_module_desc: 'Train your ear with full-length audio clips and all listening task formats from the exam.',
    home_tag_read_aloud: 'Read Aloud', home_tag_repeat_sentence: 'Repeat Sentence', home_tag_describe_image: 'Describe Image',
    home_tag_retell_lecture: 'Re-tell Lecture', home_tag_swt: 'Summarize Written Text', home_tag_write_essay: 'Write Essay',
    home_tag_fill_blanks: 'Fill in Blanks', home_tag_multiple_choice: 'Multiple Choice', home_tag_reorder_paragraphs: 'Re-order Paragraphs',
    home_tag_summarize_spoken: 'Summarize Spoken Text', home_tag_write_dictation: 'Write From Dictation',
    mod_explore: 'Explore module →', mod_scored: 'Scored', sample_preview: 'Sample result · Preview only',
    // Settings
    settings_title: 'Settings', settings_subtitle: 'Manage your practice environment, account access, and AI scoring connection.',
    settings_ai_eyebrow: 'AI Scoring', settings_ai_title: 'Backend-managed scoring',
    settings_ai_desc: 'AI scoring is now handled by your backend service. Model credentials stay on the server and are never stored on the app.',
    settings_backend_api: 'Backend API:', settings_access_rule: 'Access rule:', settings_access_rule_val: 'Sign in to use AI scoring',
    settings_model_key: 'Model key location:', settings_model_key_val: 'Server environment variables only',
    settings_account_eyebrow: 'Account', settings_account_title: 'Authentication status',
    settings_signed_in_as: 'Signed in as', settings_scoring_note: '. AI scoring requests will include your access token.',
    settings_sign_in_note: 'Sign in to unlock AI scoring and sync your practice history.',
    btn_logout: 'Log out',
    settings_mic_eyebrow: 'Microphone Access', settings_mic_title: 'One-time speaking permission',
    settings_mic_current: 'Current status:', settings_mic_desc: 'Allow microphone access once for localhost:3000 so speaking tasks can start with fewer permission prompts.',
    btn_enable_mic: 'Enable Microphone', mic_already_enabled: '✓ Microphone already enabled',
    account_settings_title: 'Account Settings', account_settings_subtitle: 'Manage account status, sync, and app preferences.',
    app_settings_title: 'App Settings', account_settings_language: 'Language', account_settings_mic_simple: 'Microphone access (for speaking practice)', mic_status_label: 'Current status',
    settings_coverage_title: 'What AI Scoring covers',
    settings_speaking_coverage: 'Speaking — Read Aloud, Repeat Sentence, Describe Image, Re-tell Lecture',
    settings_speaking_sub: 'Structured scores for Overall, Content, Fluency, and Pronunciation',
    settings_writing_coverage: 'Writing — Write Essay, Summarize Written Text',
    settings_writing_sub: 'Structured scores for Content, Grammar, Vocabulary, and Spelling',
    settings_listening_coverage: 'Listening — Write From Dictation, Summarize Spoken Text',
    settings_listening_sub: 'Backend AI scoring with structured feedback and transcript return',
    settings_reading_coverage: 'Reading — Auto-scored locally (no AI needed)',
    settings_reading_sub: 'Objective answer matching',
    // Progress
    progress_title: 'My Progress', progress_subtitle: 'Track your performance across all PTE question types.',
    progress_chart_title: 'Score Trend', progress_chart_empty: 'Your score trend will appear here after you complete some tasks.',
    progress_history_title: 'History List', progress_history_empty: 'No history yet. Complete a task to start tracking.',
    progress_focus_title: 'Focus Areas', progress_focus_empty: 'We will suggest focus areas here once you have enough attempts.',
    progress_plan_title: 'Suggested Study Flow', progress_reset_local: 'Reset local progress',
    progress_guest_title: 'Sign in to sync full progress', progress_guest_copy: 'You are currently viewing device-only data. Sign in to sync scores and history across devices.',
    progress_latest_count: 'records', progress_recent_meta: 'Most recent',
    guest_locked_label: 'Guest mode', guest_feature_locked_title: 'Sign in to unlock the full experience',
    guest_unlock_more_title: 'Preview access only',
    guest_unlock_more_copy: '${visible} / ${total} sample questions are currently open. Sign in to unlock the full bank, unlimited practice, and saved results.',
    guest_unlock_more_toast: 'Sign in to unlock more questions and full features.',
    guest_sign_in_unlock: 'Sign in to unlock more',
    study_plan_guest_title: 'Study plan is locked', study_plan_guest_copy: 'Sign in to save your study plan, sync learning records, and unlock personalised planning.',
    prediction_bank_title: '🔥 Prediction Bank', prediction_bank_subtitle: 'Practice high-frequency and predicted questions.',
    prediction_filter_all: 'All', prediction_filter_bank: 'Prediction Bank', prediction_filter_latest: 'Latest', prediction_filter_high: 'High Frequency 🔥',
    prediction_badge: '🔥 Prediction', prediction_high_badge: '🔥 High Frequency', prediction_empty: 'There are no active prediction questions yet. Newly imported items stay in review until manually activated.',
    prediction_month_label: 'Month', prediction_latest_label: 'Latest added',
    prediction_card_open: 'Open prediction set', prediction_review_note: 'Newly imported prediction items default to review and only appear here once marked active.',
    prediction_type_repeat_sentence: 'Repeat Sentence', prediction_type_write_from_dictation: 'Write From Dictation', prediction_type_answer_short_question: 'Answer Short Question', prediction_type_describe_image: 'Describe Image', prediction_type_retell_lecture: 'Retell Lecture',
    prediction_curated_count: '${count} curated questions', prediction_type_all: 'All', prediction_type_label: 'Question Type',
    prediction_recommended_title: '🔥 Recommended Practice', prediction_recommended_desc: 'Start with the highest-impact prediction sets first.',
    prediction_reco_fast_boost: 'Boost your score quickly', prediction_reco_di_copy: 'Describe Image is one of the most important speaking items for score lift.', prediction_reco_wfd_copy: 'Write From Dictation strongly affects listening and writing accuracy.',
    prediction_start_cta: 'Start Practice →', prediction_view_all_cta: 'View All', prediction_questions_count: '${count} Questions',
    prediction_completed_progress: '${done}/${total} completed', prediction_last_practiced: 'Last practiced: ${time}', prediction_never_practiced: 'No practice yet',
    prediction_common_exam: 'Most common in exam', prediction_continue: 'Continue where you left off', continue_where_left_off: 'Continue where you left off',
    mistakes_title: 'Mistakes', mistakes_subtitle: 'Automatically collect recent Speaking and Listening items scored below 60 for quick review.', mistakes_empty: 'No mistake items yet. Complete a few Speaking or Listening tasks and come back here.',
    mistakes_retry: 'Practice Again', mistakes_score_label: 'Last score', mistakes_time_label: 'Last practiced', mistakes_mark_mastered: 'Mark Mastered',
    mistakes_tab_speaking: 'Speaking', mistakes_tab_listening: 'Listening',
    continue_question_label: 'Resume this question', continue_open_cta: 'Continue',
    stats: 'Stats', total_attempts: 'Total Attempts', types_practiced: 'Types Practiced',
    of_types: 'of 19 types', overall_average: 'Overall Average', est_pte_score: 'Est. PTE Score', pts_90: '/ 90 pts',
    by_section: 'By Section', practiced: 'practiced', pts: 'pts', reset_all_stats: 'Reset All Stats',
    progress_reset: 'Progress reset', all_types: 'All Types',
    // Study Plan
    study_plan_title: 'Study Plan', study_plan_subtitle: 'Complete today’s core practice in order.',
    study_plan_card_focus: 'Weekly focus', study_plan_card_load: 'Current load', study_plan_card_session: 'Suggested session',
    study_plan_open_practice: 'Open practice',
    weekly_focus: 'Weekly Focus', best_fast_gain: 'Best for fast score gain', current_practice_load: 'Current Practice Load',
    total_completed_sessions: 'Total completed sessions', suggested_session: 'Suggested Session',
    speaking_listening_block: '2 speaking + 1 listening block', recommended_daily_structure: 'Recommended Daily Structure',
    plan_step_1: '1. Warm up with one speaking item: Read Aloud or Repeat Sentence',
    plan_step_2: '2. Do one high-accuracy listening task: Write From Dictation or Fill in the Blanks',
    plan_step_3: '3. Finish with one longer task: Summarize Written Text, Essay, or Re-tell Lecture',
    study_plan_today_tasks: 'Today Tasks', study_plan_task_rs: 'Repeat Sentence (10 questions)', study_plan_task_wfd: 'Write From Dictation (10 questions)', study_plan_task_di: 'Describe Image (5 questions)', study_plan_start_today: 'Start Today Plan',
    study_plan_task_label: 'Task', study_plan_next_step: 'Next Task', study_plan_finish_today: 'Finish Today Plan', study_plan_done_toast: 'Today plan completed',
    back_dashboard: 'Back to Dashboard', start_speaking_block: 'Start Speaking Block',
    // Account
    account_title: 'Account', account_subtitle: 'Manage sign-in status, sync capability, and how your study records are saved.',
    account_status_title: 'Current Status', account_signed_in: 'Signed in', account_signed_out: 'Signed out',
    account_signed_in_as: 'Signed in as', account_sync_title: 'Sync & Storage',
    account_sync_copy_in: 'Your practice history and progress are automatically saved to this account.',
    account_sync_copy_out: 'After you sign in, your practice history and progress are automatically saved to this account.',
    account_actions_title: 'Quick Actions', account_open_progress: 'Open My Progress', account_open_settings: 'Open Settings',
    account_login_hint: 'Sign in to unlock full study history.',
    // Auth modal
    auth_modal_eyebrow: 'Account', auth_modal_title_login: 'Welcome back', auth_modal_title_signup: 'Create your account',
    auth_modal_copy_login: 'Log in to sync your practice progress.',
    auth_modal_copy_signup: 'Sign up with email and password to save progress across sessions.',
    auth_google_btn: 'Continue with Google', auth_apple_btn: 'Continue with Apple', auth_divider: 'or',
    auth_forgot_link: 'Forgot password?', auth_forgot_title: 'Reset your password', auth_forgot_copy: 'Enter your email and we\'ll send you a reset link.',
    auth_forgot_send: 'Send reset link', auth_forgot_sending: 'Sending...', auth_forgot_sent: 'Reset link sent! Check your email.',
    auth_forgot_back: 'Back to login',
    auth_reset_title: 'Set new password', auth_reset_copy: 'Enter your new password below.',
    auth_new_password_label: 'New password', auth_confirm_password_label: 'Confirm password',
    auth_reset_save: 'Save new password', auth_reset_saving: 'Saving...',
    auth_reset_success: 'Password updated successfully.', auth_reset_mismatch: 'Passwords do not match.', auth_reset_short: 'Password must be at least 6 characters.',
    auth_tab_login: 'Log in', auth_tab_signup: 'Sign up',
    auth_email_label: 'Email', auth_password_label: 'Password',
    auth_btn_login: 'Log in', auth_btn_signup: 'Create account',
    auth_btn_logging_in: 'Logging in...', auth_btn_creating: 'Creating account...',
    auth_logout_toast: 'Logged out successfully.', auth_login_btn: 'Log in', auth_logout_confirm: 'Are you sure you want to log out?',
    auth_logout_dialog_title: 'Log out?', auth_logout_dialog_copy: 'Are you sure you want to log out?',
    auth_error_fields: 'Please enter both email and password.',
    auth_success_verify: 'Account created. Check your email to confirm your account, then log in.',
    auth_success_created: 'Account created successfully. You are now logged in.',
    auth_confirmed_success: 'Email confirmed. Your account is ready and you are now logged in.',
    auth_confirmed_error: 'Email confirmation failed or the link has expired. Please sign up again or request a new confirmation email.',
    auth_avatar_title: 'Click to log out',
    delete_account_btn: 'Delete Account', delete_account_dialog_title: 'Delete Account?',
    delete_account_dialog_copy: 'This is permanent and cannot be undone. All your practice history, scores, and recordings will be deleted.',
    delete_account_confirm: 'Delete', delete_account_deleting: 'Deleting...',
    delete_account_success: 'Account deleted successfully.', delete_account_error: 'Failed to delete account. Please try again.',
    // Speaking audio capture panel
    audio_recorded: 'Recorded audio', audio_uploaded: 'Uploaded audio',
    btn_remove_upload: 'Remove upload', btn_upload_audio: 'Upload audio',
    audio_or_recorder: 'or use the recorder above', audio_no_recorder: 'Recording is not available on this device',
    btn_submit_ai: 'Submit for Scoring',
    // AI scorer UI labels
    score_analyzing: 'Analyzing your response...', score_generating: 'Generating feedback...',
    score_unavailable: 'AI scoring unavailable.', score_sign_in_msg: 'Sign in to use AI scoring',
    score_breakdown: 'Score breakdown', score_feedback_label: 'Feedback', score_transcript_label: 'Transcript',
    score_key_issues: 'Key issues', score_improvements: 'How to improve', score_correct_example: 'Correct example',
    score_scale: 'PTE scale 10-90', score_ai_label: 'AI speaking evaluation',
    score_no_feedback: 'No feedback returned.', score_no_issues: 'No major issues highlighted.', score_no_improve: 'No improvement suggestions returned.',
    score_subscores_title: 'Sub-scores', score_detailed_feedback: 'Detailed Feedback',
    score_saved_title: 'Recording saved', score_saved_copy: 'This scored attempt is now attached to your account and ready for progress history.',
    btn_view_progress: 'View in My Progress', score_replay_empty: 'Replay will appear here when a recording URL is available.',
    score_recent_title: 'Recent recordings for this question', score_recent_copy: 'Recent valid recordings for this question appear here for quick review.',
    score_latest: 'Latest', score_attempt: 'Attempt ', score_save_label: 'Saved to progress',
    score_save_signin: 'Sign in to save result', btn_try_again: 'Try again',
    practice_score_label: 'Practice Score', recordings_empty: 'No recordings yet',
    rs_recent_title: 'Recent Recordings', rs_result_title: 'This Attempt',
    rs_status_wait: 'Play the audio to begin', rs_status_wait_sub: 'Recording will start after playback ends.',
    rs_status_countdown: 'Recording starts soon', rs_status_countdown_sub: 'Get ready to repeat the sentence clearly.',
    rs_status_recording: 'Recording...', rs_status_recording_sub: 'Repeat the sentence exactly as you heard it.',
    rs_status_complete: 'Recording complete', rs_status_complete_sub: 'Submit for a practice score or record again.',
    rs_status_no_speech: 'No valid speech captured', rs_status_no_speech_sub: 'Please check that microphone access is enabled and try recording again in a quiet environment.',
    rs_signin_save: 'Please sign in before submitting a score or saving recordings.', rs_signin_cta: 'Sign in',
    rs_transcript_label: 'Recognised Transcript', rs_reference_label: 'Reference Sentence',
    rs_submit_ready: 'Your recording is ready for a practice score.', rs_record_saved: 'This recording has been saved.',
    score_overall: 'Overall Score', score_recognised: 'Recognised transcript',
    metric_content: 'Content', metric_fluency: 'Fluency', metric_pronunciation: 'Pronunciation',
    metric_grammar: 'Grammar', metric_vocabulary: 'Vocabulary', metric_spelling: 'Spelling',
    // Listening pages
    mcsl_title: 'MC Single Answer', mcsl_subtitle: 'Listen to the recording and choose the best answer.',
    mcml_title: 'MC Multiple Answer', mcml_subtitle: 'Listen and select ALL correct answers.',
    rwfb_title: 'R&W Fill in Blanks', mcsr_title: 'MC Single Answer', mcmr_title: 'MC Multiple Answer',
    reorder_title: 'Re-order Paragraphs', rfb_title: 'Reading Fill in Blanks',
    fbl_title: 'Fill in the Blanks', fbl_subtitle: 'Listen and type the missing words.',
    fbl_instruction: '📌 Fill in each blank with the exact word from the recording.',
    hcs_title: 'Highlight Correct Summary', hcs_subtitle: 'Listen and choose the paragraph that best summarizes the recording.',
    hcs_instruction: '📌 Choose the paragraph that best summarizes what you heard.',
    smw_title: 'Select Missing Word', smw_subtitle: 'Listen to an incomplete recording and select the word that completes it.',
    smw_instruction: '📌 The last word is missing. Select what you think completes the sentence.',
    hi_title: 'Highlight Incorrect Words', hi_subtitle: 'Listen and click on the words in the text that are different from the recording.',
    hi_instruction_pre: '📌 Click words in the text below that differ from what you heard. The text contains',
    hi_instruction_suf: 'incorrect words.',
    wfd_title: 'Write From Dictation', wfd_subtitle: 'Listen and type the sentence exactly as you hear it.',
    wfd_audio_label: 'Listen carefully — you can replay',
    wfd_instruction: '📌 Type exactly what you hear, including punctuation.',
    wfd_placeholder: 'Type the sentence here...', btn_check_answer: 'Check Answer',
    wfd_comparison: 'Word-by-word comparison', wfd_correct_sentence: 'Correct sentence:',
    wfd_legend: '✅ Matched &nbsp; ❌ Missing or wrong',
    wfd_question_text: 'Listen and type the sentence exactly as you hear it.',
    // Shared feedback labels
    answer_correct: '✅ Correct!', answer_incorrect: '❌ Incorrect.',
    answer_incorrect_highlighted: '❌ Incorrect. Correct answer highlighted.',
    btn_retry: 'Try again', btn_check: 'Check',
    score_correct: 'Correct', score_correct_blanks: 'Correct blanks',
    score_correct_picks: 'Correct picks minus incorrect picks',
    auto_submitted: 'Auto-submitted when time ran out.',
    sst_original_transcript: 'Original transcript',
    // Answer Short Question
    asq_result_title_ok: 'Answer captured', asq_result_sub_ok: 'Check the result below or record one more time.',
    asq_result_correct: 'Correct!', asq_result_incorrect: 'Incorrect',
    asq_correct_answer: 'Correct answer', asq_your_answer: 'Your answer',
    asq_score_label: 'Score', asq_rule_label: 'Rule',
    asq_no_speech: '(no speech)', asq_cancel_msg: 'Recording cancelled. Try again.',
    asq_exit_msg: 'Attempt exited. You can answer again.',
    asq_play_first: 'Play the question first',
    asq_ready_default: 'Ready to answer — keep it short and clear',
  }
};

function t(key) {
  const lang = getAppLang();
  return (window.I18N[lang] && window.I18N[lang][key]) || (window.I18N.en && window.I18N.en[key]) || key;
}

function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  const lang = getAppLang();
  const zh = document.getElementById('sidebar-lang-zh');
  const en = document.getElementById('sidebar-lang-en');
  if (zh) zh.classList.toggle('active', lang === 'zh');
  if (en) en.classList.toggle('active', lang === 'en');
}

const NAV_GROUP_STORAGE_KEY = 'pte_nav_groups';
const MISTAKES_DISMISSED_KEY = 'pte_mistakes_mastered';

const PAGE_PATHS = {
  home: '/',
  practice: '/practice',
  progress: '/progress',
  'study-plan': '/study-plan',
  'account-settings': '/account-settings',
  support: '/support',
  privacy: '/privacy',
  'mock-test': '/mock-test',
  'mock-results': '/mock-test/results',
  'mock-review': '/mock-test/review',
  'tools-prediction-bank': '/tools/prediction-bank',
  'tools-high-frequency': '/tools/high-frequency',
  'tools-mistakes': '/tools/mistakes',
  'tools-audio-trainer': '/tools/audio-trainer',
  'smart-practice-prediction-bank': '/smart-practice/prediction-bank',
  'smart-practice-high-frequency': '/smart-practice/high-frequency',
  'smart-practice-mistakes': '/smart-practice/mistakes',
  'smart-practice-audio-trainer': '/smart-practice/audio-trainer',
  'practice-all': '/practice/all',
  'practice-speaking': '/practice/speaking',
  'practice-writing': '/practice/writing',
  'practice-reading': '/practice/reading',
  'practice-listening': '/practice/listening',
};

const PRACTICE_SKILL_PAGES = {
  speaking: ['practice-read-aloud', 'practice-repeat-sentence', 'practice-describe-image', 'practice-retell-lecture', 'practice-answer-short', 'read-aloud', 'repeat-sentence', 'describe-image', 'retell-lecture', 'answer-short'],
  writing: ['practice-summarize-written', 'practice-write-essay', 'summarize-written', 'write-essay'],
  reading: ['practice-rw-fill-blanks', 'practice-mc-single-reading', 'practice-mc-multiple-reading', 'practice-reorder-paragraphs', 'practice-r-fill-blanks', 'rw-fill-blanks', 'mc-single-reading', 'mc-multiple-reading', 'reorder-paragraphs', 'r-fill-blanks'],
  listening: ['practice-summarize-spoken', 'practice-mc-single-listening', 'practice-mc-multiple-listening', 'practice-fill-blanks-listening', 'practice-highlight-summary', 'practice-select-missing', 'practice-highlight-incorrect', 'practice-write-dictation', 'summarize-spoken', 'mc-single-listening', 'mc-multiple-listening', 'fill-blanks-listening', 'highlight-summary', 'select-missing', 'highlight-incorrect', 'write-dictation'],
};

const SIDEBAR_GROUPS = [
  {
    key: 'home-block',
    items: [
      { key: 'home', icon: '🏠', labelKey: 'nav_home' },
    ],
    separator: true,
  },
  {
    key: 'practice',
    type: 'group',
    icon: '🎯',
    labelKey: 'nav_practice',
    targetPage: 'practice-all',
    children: [
      { key: 'practice-speaking', labelKey: 'nav_speaking' },
      { key: 'practice-writing', labelKey: 'nav_writing' },
      { key: 'practice-reading', labelKey: 'nav_reading' },
      { key: 'practice-listening', labelKey: 'nav_listening' },
    ],
    separator: false,
  },
  {
    key: 'mock-block',
    items: [
      { key: 'mock-test', icon: '✏️', labelKey: 'nav_mock_test' },
    ],
    separator: true,
  },
  {
    key: 'progress-group',
    type: 'group',
    icon: '📊',
    labelKey: 'nav_progress',
    targetPage: 'progress',
    children: [
      { key: 'progress-history', labelKey: 'nav_practice_history', targetPage: 'progress' },
      { key: 'progress-wrong-answers', labelKey: 'nav_wrong_answers', targetPage: 'tools-mistakes' },
    ],
    separator: true,
  },
  {
    key: 'question-bank',
    type: 'group',
    icon: '📚',
    labelKey: 'nav_question_bank',
    targetPage: 'tools-prediction-bank',
    children: [
      { key: 'question-bank-predicted', labelKey: 'nav_predicted_questions', targetPage: 'tools-prediction-bank', emphasis: true },
      { key: 'question-bank-high-frequency', labelKey: 'nav_high_frequency_questions', targetPage: 'tools-high-frequency' },
    ],
    separator: true,
  },
  {
    key: 'tools',
    type: 'group',
    icon: '🛠️',
    labelKey: 'nav_tools',
    targetPage: 'tools-audio-trainer',
    children: [
      { key: 'tools-pronunciation', labelKey: 'nav_pronunciation_training', targetPage: 'tools-audio-trainer' },
    ],
    separator: true,
  },
  {
    key: 'profile',
    type: 'group',
    icon: '👤',
    labelKey: 'nav_profile',
    targetPage: 'account-settings',
    children: [
      { key: 'profile-account', labelKey: 'nav_my_account', targetPage: 'account-settings' },
      { key: 'profile-support', labelKey: 'nav_support', targetPage: 'support' },
      { key: 'profile-privacy', labelKey: 'nav_privacy', targetPage: 'privacy' },
    ],
  },
];

function normalizeRoutePath(path = '') {
  const clean = String(path || '/').replace(/\/+$/, '') || '/';
  return clean === '' ? '/' : clean;
}

function resolveNavigationPage(page = 'home') {
  if (page === 'smart-practice-prediction-bank') return 'tools-prediction-bank';
  if (page === 'smart-practice-high-frequency') return 'tools-high-frequency';
  if (page === 'smart-practice-mistakes') return 'tools-mistakes';
  if (page === 'smart-practice-audio-trainer') return 'tools-audio-trainer';
  if (!page) return 'home';
  return page;
}

function getPageFromPath(pathname = window.location.pathname) {
  const target = normalizeRoutePath(pathname);
  const match = Object.entries(PAGE_PATHS).find(([, path]) => normalizeRoutePath(path) === target);
  return match ? match[0] : '';
}

function getPathForPage(page = '') {
  return PAGE_PATHS[resolveNavigationPage(page)] || '';
}

function getSidebarActiveItem(page = '') {
  const current = resolveNavigationPage(page || window.__currentPage || sessionStorage.getItem('pte_page') || 'home');
  const isMockQuestionPage = PRACTICE_SKILL_PAGES.speaking.includes(current)
    || PRACTICE_SKILL_PAGES.writing.includes(current)
    || PRACTICE_SKILL_PAGES.reading.includes(current)
    || PRACTICE_SKILL_PAGES.listening.includes(current)
    || current === 'question-list';
  if (current === 'question-list') {
    return getSidebarActiveItem(getQuestionTargetPage() || 'practice-all');
  }
  if (current === 'mock-results' || current === 'mock-review') return 'mock-test';
  if (typeof isMockSessionActive === 'function' && isMockSessionActive() && isMockQuestionPage) {
    return 'mock-test';
  }
  if (current === 'practice') return 'practice';
  if (current === 'progress') return 'progress-history';
  if (current === 'tools-mistakes') return 'progress-wrong-answers';
  if (current === 'tools-prediction-bank') return 'question-bank-predicted';
  if (current === 'tools-high-frequency') return 'question-bank-high-frequency';
  if (current === 'tools-audio-trainer' || current === 'audio-trainer') return 'tools-pronunciation';
  if (current === 'account-settings' || current === 'account') return 'profile-account';
  if (current === 'support') return 'profile-support';
  if (current === 'privacy') return 'profile-privacy';
  if (current === 'settings') return 'profile-account';
  if (PAGE_PATHS[current]) return current;
  if (PRACTICE_SKILL_PAGES.speaking.includes(current)) return 'practice-speaking';
  if (PRACTICE_SKILL_PAGES.writing.includes(current)) return 'practice-writing';
  if (PRACTICE_SKILL_PAGES.reading.includes(current)) return 'practice-reading';
  if (PRACTICE_SKILL_PAGES.listening.includes(current)) return 'practice-listening';
  if (getQuestionSource().source === 'prediction') {
    return getPredictionHighOnly() ? 'question-bank-high-frequency' : 'question-bank-predicted';
  }
  return current;
}

function getPageSection(page = '') {
  const activeItem = getSidebarActiveItem(page);
  if (String(activeItem).startsWith('practice-') || activeItem === 'practice') return 'practice';
  if (String(activeItem).startsWith('progress-')) return 'progress-group';
  if (String(activeItem).startsWith('question-bank-')) return 'question-bank';
  if (String(activeItem).startsWith('tools-')) return 'tools';
  if (String(activeItem).startsWith('profile-')) return 'profile';
  return activeItem;
}

function getStoredNavGroups() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(NAV_GROUP_STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_error) {
    return {};
  }
}

function setStoredNavGroups(nextState = {}) {
  sessionStorage.setItem(NAV_GROUP_STORAGE_KEY, JSON.stringify(nextState));
}

function getDismissedMistakes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MISTAKES_DISMISSED_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function buildMistakeKey(item = {}) {
  return `${item.question_type || ''}::${item.question_id || item.id || ''}`;
}

function setDismissedMistakes(items = []) {
  localStorage.setItem(MISTAKES_DISMISSED_KEY, JSON.stringify(items));
}

function markMistakeMastered(questionType = '', questionId = '') {
  const current = getDismissedMistakes();
  const nextKey = `${questionType || ''}::${questionId || ''}`;
  if (!nextKey || current.includes(nextKey)) return;
  setDismissedMistakes([...current, nextKey]);
}

function resolveMistakeRetryRoute(questionType = '', questionId = '') {
  const routeMap = {
    readAloud: { page: 'read-aloud', fallback: 'practice-speaking' },
    repeatSentence: { page: 'repeat-sentence', fallback: 'practice-speaking' },
    describeImage: { page: 'describe-image', fallback: 'practice-speaking' },
    retellLecture: { page: 'retell-lecture', fallback: 'practice-speaking' },
    answerShort: { page: 'answer-short', fallback: 'practice-speaking' },
    summarizeSpoken: { page: 'summarize-spoken', fallback: 'practice-listening' },
    mcSingleListening: { page: 'mc-single-listening', fallback: 'practice-listening' },
    mcMultipleListening: { page: 'mc-multiple-listening', fallback: 'practice-listening' },
    fillBlanksListening: { page: 'fill-blanks-listening', fallback: 'practice-listening' },
    highlightSummary: { page: 'highlight-summary', fallback: 'practice-listening' },
    selectMissing: { page: 'select-missing', fallback: 'practice-listening' },
    highlightIncorrect: { page: 'highlight-incorrect', fallback: 'practice-listening' },
    writeDictation: { page: 'write-dictation', fallback: 'practice-listening' },
  };
  const route = routeMap[questionType] || null;
  if (!route) return { page: 'practice-all', questionId: '' };
  return { ...route, questionId: questionId || '' };
}

function setNavGroupOpen(groupKey, isOpen) {
  const nextState = { ...getStoredNavGroups(), [groupKey]: !!isOpen };
  setStoredNavGroups(nextState);
  renderSidebarNav(window.__currentPage || sessionStorage.getItem('pte_page') || 'home');
}

function renderSidebarNav(page = '') {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  const activeItem = getSidebarActiveItem(page);
  const activeGroup = getPageSection(page);
  const storedGroups = getStoredNavGroups();

  nav.innerHTML = SIDEBAR_GROUPS.map(section => {
    if (section.type === 'label') {
      return `<div class="nav-section nav-section-label"><div class="nav-label">${t(section.labelKey)}</div></div>`;
    }

    if (Array.isArray(section.items)) {
      return `<div class="nav-section">${
        section.items.map(item => `
<button class="nav-item ${activeItem === item.key ? 'active' : ''}" type="button" data-page="${item.key}" onclick="navigate('${item.key}')">
  <span class="nav-icon">${item.icon}</span>
  <span class="nav-item-label">${t(item.labelKey)}</span>
  <span class="nav-item-end" aria-hidden="true"></span>
</button>`).join('')
      }${section.separator ? `<div class="nav-divider" aria-hidden="true"></div>` : ''}</div>`;
    }

    const hasStoredState = Object.prototype.hasOwnProperty.call(storedGroups, section.key);
    const isOpen = hasStoredState ? !!storedGroups[section.key] : activeGroup === section.key;
    return `
<div class="nav-section nav-tree-section ${isOpen ? 'is-open' : ''} ${activeGroup === section.key ? 'is-active' : ''}">
  <div class="nav-group-toggle ${activeGroup === section.key ? 'active' : ''}">
    <button class="nav-group-link" type="button" onclick="setNavGroupOpen('${section.key}', true);navigate('${section.targetPage || section.key}')">
      <span class="nav-group-main">
        <span class="nav-icon">${section.icon}</span>
        <span class="nav-group-label">${t(section.labelKey)}</span>
      </span>
    </button>
    <button class="nav-group-caret-btn" type="button" onclick="setNavGroupOpen('${section.key}', ${!isOpen})" aria-label="${t(section.labelKey)}">
      <span class="nav-group-caret">${isOpen ? '▾' : '▸'}</span>
    </button>
  </div>
  <div class="nav-group-items">
    ${section.children.map(item => `
<button class="nav-item nav-subitem ${item.emphasis ? 'nav-item-emphasis' : ''} ${activeItem === item.key ? 'active' : ''}" type="button" data-page="${item.key}" onclick="${(item.targetPage || item.key) === 'tools-prediction-bank' ? `window.__practicePredictionFilter=false;setPredictionHighOnly(false);navigate('${item.targetPage || item.key}')` : (item.targetPage || item.key) === 'tools-high-frequency' ? `window.__practicePredictionFilter='high';setPredictionHighOnly(true);navigate('${item.targetPage || item.key}')` : `navigate('${item.targetPage || item.key}')`}">
  <span class="nav-item-label">${t(item.labelKey)}</span>
  ${item.emphasis ? `<span class="nav-mini-badge">HOT</span>` : ''}
</button>`).join('')}
  </div>
</div>${section.separator ? `<div class="nav-divider" aria-hidden="true"></div>` : ''}`;
  }).join('') + `<div class="nav-section"><div class="nav-divider" aria-hidden="true"></div></div>`;
}

function renderMobileHeaderControls(page = '') {
  const slot = document.getElementById('mobile-lang-slot');
  if (!slot) return;
  const currentPage = resolveNavigationPage(page || window.__currentPage || sessionStorage.getItem('pte_page') || 'home');
  if (currentPage !== 'home') {
    slot.innerHTML = '';
    return;
  }
  const currentLang = getAppLang();
  slot.innerHTML = `
    <button class="theme-toggle-btn mobile-lang-btn" type="button" onclick="setAppLang('${currentLang === 'zh' ? 'en' : 'zh'}')" aria-label="Switch language">
      ${currentLang === 'zh' ? '中' : 'EN'}
    </button>
  `;
}

function runPageCleanup() {
  if (typeof window.__pageCleanup === 'function') {
    try {
      window.__pageCleanup();
    } catch (_error) {}
  }
  if (typeof window.stopAllQuestionAudio === 'function') {
    try {
      window.stopAllQuestionAudio();
    } catch (_error) {}
  }
  window.__pageCleanup = null;
}

function setPageCleanup(cleanup) {
  window.__pageCleanup = typeof cleanup === 'function' ? cleanup : null;
}

function getPageLayout(page) {
  if (page === 'home') return 'dashboard';
  if (page === 'practice' || page === 'practice-all' || page === 'practice-speaking' || page === 'practice-writing' || page === 'practice-reading' || page === 'practice-listening' || page === 'tools-prediction-bank' || page === 'tools-high-frequency' || page === 'tools-mistakes' || page === 'tools-audio-trainer' || page === 'progress' || page === 'study-plan' || page === 'account-settings' || page === 'settings' || page === 'support' || page === 'privacy' || page === 'account' || page === 'mock-test' || page === 'mock-results' || page === 'mock-review' || page === 'audio-trainer' || page === 'question-list') return 'wide';
  if (String(page || '').startsWith('practice-')) return 'wide';
  return 'focus';
}

function setPageLayout(mode = 'wide') {
  const container = document.getElementById('page-container');
  if (!container) return;
  container.className = '';
  container.classList.add('page-layout', `page-layout-${mode}`);
}

function navigate(page, options = {}) {
  const targetPage = resolveNavigationPage(page);
  const isMockQuestionPage = PRACTICE_SKILL_PAGES.speaking.includes(targetPage)
    || PRACTICE_SKILL_PAGES.writing.includes(targetPage)
    || PRACTICE_SKILL_PAGES.reading.includes(targetPage)
    || PRACTICE_SKILL_PAGES.listening.includes(targetPage);
  runPageCleanup();
  window.__currentPage = targetPage;

  renderSidebarNav(targetPage);
  renderMobileHeaderControls(targetPage);

  const section = getPageSection(targetPage);
  const bottomSection = section === 'tools' ? 'practice' : section;

  // Update bottom nav active tab
  $$('.bottom-tab').forEach(el => {
    el.classList.toggle('active', el.dataset.section === bottomSection);
  });

  // Close drawer on mobile
  if (window.innerWidth <= 640) closeDrawer();

  // Render page
  setPageLayout(getPageLayout(targetPage));
  const fn = Pages[targetPage];
  if (fn) {
    fn();
  } else {
    $('#page-container').innerHTML = `<div class="empty-state"><div class="empty-icon">🚧</div><p>${t('page_not_found')}: "${targetPage}".</p></div>`;
  }
  applyCurrentMockLinearNavigation(targetPage);

  // Inject back button into non-speaking question pages
  const pageHeader = $('#page-container .page-header');
  if (pageHeader && !pageHeader.querySelector('.page-back-btn')) {
    const backTarget = (typeof isMockSessionActive === 'function' && isMockSessionActive() && isMockQuestionPage)
      ? 'mock-test'
      : targetPage === 'support' || targetPage === 'privacy'
        ? 'account-settings'
        : 'practice';
    const backBtn = document.createElement('button');
    backBtn.className = 'page-back-btn';
    backBtn.setAttribute('aria-label', backTarget === 'mock-test' ? 'Back to mock test' : backTarget === 'account-settings' ? 'Back to profile' : 'Back to practice');
    backBtn.onclick = () => navigate(backTarget);
    backBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back`;
    $('#page-container').insertBefore(backBtn, $('#page-container').firstChild);
  }

  const nextPath = getPathForPage(targetPage);
  if (!options.skipHistory && nextPath) {
    const method = options.replace ? 'replaceState' : 'pushState';
    if (normalizeRoutePath(window.location.pathname) !== normalizeRoutePath(nextPath)) {
      window.history[method]({}, '', nextPath);
    } else if (options.replace) {
      window.history.replaceState({}, '', nextPath);
    }
  }

  // Store current page
  sessionStorage.setItem('pte_page', targetPage);
  // Scroll to top
  document.getElementById('main').scrollTop = 0;
}

function refreshCurrentPage() {
  runPageCleanup();
  const currentPage = resolveNavigationPage(sessionStorage.getItem('pte_page') || 'home');
  window.__currentPage = currentPage;
  setPageLayout(getPageLayout(currentPage));
  renderSidebarNav(currentPage);
  renderMobileHeaderControls(currentPage);
  const fn = Pages[currentPage];
  if (fn) fn();
  applyCurrentMockLinearNavigation(currentPage);
}

function toggleDrawer() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('drawer-overlay');
  const isOpen = sidebar.classList.toggle('drawer-open');
  overlay.classList.toggle('visible', isOpen);
}

function closeDrawer() {
  document.getElementById('sidebar').classList.remove('drawer-open');
  document.getElementById('drawer-overlay').classList.remove('visible');
}

function getAppLang() {
  return localStorage.getItem('pte_lang') || 'en';
}

const GUEST_FREE_QUESTION_LIMIT = 2;
const QUESTION_SOURCE_KEY = 'pte_question_source';
const QUESTION_LATEST_ONLY_KEY = 'pte_prediction_latest_only';
const QUESTION_TARGET_PAGE_KEY = 'pte_question_target_page';
const QUESTION_SELECTED_ID_KEY = 'pte_question_selected_id';
const PAGE_UI_STATE_KEY = 'pte_page_ui_state_v1';
const MOCK_SESSION_KEY = 'pte_mock_session_v2';
const MOCK_SESSION_LEGACY_KEY = 'pte_mock_session_v1';
const MOCK_BANK_BASE_PATH = '/data/mock-banks';
const MOCK_TOTAL_DURATION_SECONDS = 2 * 60 * 60;
const MOCK_SECTION_LABELS = {
  speakingWriting: 'Speaking & Writing',
  reading: 'Reading',
  listening: 'Listening',
};
const MOCK_SECTION_DURATIONS = {
  speakingWriting: 65 * 60,
  reading: 32 * 60,
  listening: 45 * 60,
};
const MOCK_PLAN_BLUEPRINT = [
  { questionType: 'readAloud', page: 'practice-read-aloud', detailPage: 'read-aloud', count: 5, title: 'Read Aloud', section: 'speakingWriting', sectionLabel: MOCK_SECTION_LABELS.speakingWriting },
  { questionType: 'repeatSentence', page: 'practice-repeat-sentence', detailPage: 'repeat-sentence', count: 4, title: 'Repeat Sentence', section: 'speakingWriting', sectionLabel: MOCK_SECTION_LABELS.speakingWriting },
  { questionType: 'describeImage', page: 'practice-describe-image', detailPage: 'describe-image', count: 3, title: 'Describe Image', section: 'speakingWriting', sectionLabel: MOCK_SECTION_LABELS.speakingWriting },
  { questionType: 'retellLecture', page: 'practice-retell-lecture', detailPage: 'retell-lecture', count: 2, title: 'Re-tell Lecture', section: 'speakingWriting', sectionLabel: MOCK_SECTION_LABELS.speakingWriting },
  { questionType: 'answerShort', page: 'practice-answer-short', detailPage: 'answer-short', count: 5, title: 'Answer Short Question', section: 'speakingWriting', sectionLabel: MOCK_SECTION_LABELS.speakingWriting },
  { questionType: 'summarizeWritten', page: 'practice-summarize-written', detailPage: 'summarize-written', count: 2, title: 'Summarize Written Text', section: 'speakingWriting', sectionLabel: MOCK_SECTION_LABELS.speakingWriting },
  { questionType: 'writeEssay', page: 'practice-write-essay', detailPage: 'write-essay', count: 1, title: 'Write Essay', section: 'speakingWriting', sectionLabel: MOCK_SECTION_LABELS.speakingWriting },
  { questionType: 'rwFillBlanks', page: 'practice-rw-fill-blanks', detailPage: 'rw-fill-blanks', count: 5, title: 'Reading & Writing Fill in the Blanks', section: 'reading', sectionLabel: MOCK_SECTION_LABELS.reading },
  { questionType: 'mcMultipleReading', page: 'practice-mc-multiple-reading', detailPage: 'mc-multiple-reading', count: 2, title: 'Multiple Choice Multiple Answers', section: 'reading', sectionLabel: MOCK_SECTION_LABELS.reading },
  { questionType: 'reorderParagraphs', page: 'practice-reorder-paragraphs', detailPage: 'reorder-paragraphs', count: 3, title: 'Re-order Paragraphs', section: 'reading', sectionLabel: MOCK_SECTION_LABELS.reading },
  { questionType: 'rFillBlanks', page: 'practice-r-fill-blanks', detailPage: 'r-fill-blanks', count: 4, title: 'Fill in the Blanks', section: 'reading', sectionLabel: MOCK_SECTION_LABELS.reading },
  { questionType: 'mcSingleReading', page: 'practice-mc-single-reading', detailPage: 'mc-single-reading', count: 2, title: 'Multiple Choice Single Answer', section: 'reading', sectionLabel: MOCK_SECTION_LABELS.reading },
  { questionType: 'summarizeSpoken', page: 'practice-summarize-spoken', detailPage: 'summarize-spoken', count: 2, title: 'Summarize Spoken Text', section: 'listening', sectionLabel: MOCK_SECTION_LABELS.listening },
  { questionType: 'mcMultipleListening', page: 'practice-mc-multiple-listening', detailPage: 'mc-multiple-listening', count: 2, title: 'Multiple Choice Multiple Answers', section: 'listening', sectionLabel: MOCK_SECTION_LABELS.listening },
  { questionType: 'fillBlanksListening', page: 'practice-fill-blanks-listening', detailPage: 'fill-blanks-listening', count: 4, title: 'Fill in the Blanks', section: 'listening', sectionLabel: MOCK_SECTION_LABELS.listening },
  { questionType: 'highlightSummary', page: 'practice-highlight-summary', detailPage: 'highlight-summary', count: 2, title: 'Highlight Correct Summary', section: 'listening', sectionLabel: MOCK_SECTION_LABELS.listening },
  { questionType: 'mcSingleListening', page: 'practice-mc-single-listening', detailPage: 'mc-single-listening', count: 2, title: 'Multiple Choice Single Answer', section: 'listening', sectionLabel: MOCK_SECTION_LABELS.listening },
  { questionType: 'selectMissing', page: 'practice-select-missing', detailPage: 'select-missing', count: 2, title: 'Select Missing Word', section: 'listening', sectionLabel: MOCK_SECTION_LABELS.listening },
  { questionType: 'highlightIncorrect', page: 'practice-highlight-incorrect', detailPage: 'highlight-incorrect', count: 2, title: 'Highlight Incorrect Words', section: 'listening', sectionLabel: MOCK_SECTION_LABELS.listening },
  { questionType: 'writeDictation', page: 'practice-write-dictation', detailPage: 'write-dictation', count: 4, title: 'Write From Dictation', section: 'listening', sectionLabel: MOCK_SECTION_LABELS.listening },
];
const MOCK_BANK_CACHE = {};
const MOCK_BANK_OVERRIDES = {
  fillBlanksListening: [
    {
      id: 'fbl3',
      title: 'Urban Water Supply',
      transcript: 'Cities depend on complex water supply systems to deliver clean drinking water to homes and businesses. Water is usually collected from reservoirs, rivers, or underground sources, then treated to remove harmful bacteria and impurities. After treatment, it is pumped through a network of pipes and storage facilities. Regular monitoring is essential to maintain safety, efficiency, and long-term reliability.',
      blanks: [
        { before: 'Water is usually collected from ', key: 'reservoirs', after: ', rivers, or underground sources' },
        { before: 'then treated to remove harmful bacteria and ', key: 'impurities', after: '.' },
        { before: 'it is pumped through a network of pipes and ', key: 'storage facilities', after: '.' },
        { before: 'Regular monitoring is essential to maintain safety, efficiency, and long-term ', key: 'reliability', after: '.' }
      ]
    },
    {
      id: 'fbl4',
      title: 'Marine Ecosystems',
      transcript: 'Marine ecosystems support an enormous variety of life and provide important benefits to human societies. Coral reefs, mangroves, and seagrass beds offer habitats for fish and other species, while also protecting coastlines from erosion. However, pollution, overfishing, and rising ocean temperatures are placing these environments under increasing pressure. Conservation efforts therefore focus on restoration, regulation, and public awareness.',
      blanks: [
        { before: 'Marine ecosystems support an enormous variety of life and provide important ', key: 'benefits', after: ' to human societies.' },
        { before: 'offer ', key: 'habitats', after: ' for fish and other species' },
        { before: 'protecting coastlines from ', key: 'erosion', after: '.' },
        { before: 'Conservation efforts therefore focus on restoration, regulation, and public ', key: 'awareness', after: '.' }
      ]
    }
  ]
};

function isGuestUser() {
  return !(window.AppAuth && AppAuth.isLoggedIn && AppAuth.isLoggedIn());
}

function getAccessibleQuestions(questions) {
  if (!Array.isArray(questions)) return [];
  if (isMockSessionActive()) return questions;
  return isGuestUser() ? questions.slice(0, Math.min(GUEST_FREE_QUESTION_LIMIT, questions.length)) : questions;
}

function hasLockedQuestions(totalCount) {
  return isGuestUser() && totalCount > GUEST_FREE_QUESTION_LIMIT;
}

function openLoginPrompt(messageKey = 'guest_unlock_more_toast') {
  if (window.showToast) showToast(t(messageKey));
  if (window.AuthUI) AuthUI.open('login');
}

function renderGuestPracticeUpsell(totalCount, visibleCount) {
  if (!hasLockedQuestions(totalCount)) return '';
  return `
<div class="card" style="margin-top:14px;border:1px dashed var(--border);background:var(--surface)">
  <div class="card-title" style="margin-bottom:8px">${t('guest_unlock_more_title')}</div>
  <p style="font-size:13px;color:var(--text-light);line-height:1.7;margin-bottom:12px">
    ${t('guest_unlock_more_copy').replace('${visible}', visibleCount).replace('${total}', totalCount)}
  </p>
  <div class="btn-group">
    <button class="btn btn-primary" onclick="openLoginPrompt()">${t('guest_sign_in_unlock')}</button>
  </div>
</div>`;
}

function renderProtectedFeatureGate(titleKey, copyKey) {
  return `
<div class="page-header">
  <h1>${t(titleKey)}</h1>
  <p>${t(copyKey)}</p>
</div>
<div class="card protected-gate-card">
  <div class="eyebrow">${t('guest_locked_label')}</div>
  <div class="card-title" style="margin-bottom:10px">${t('guest_feature_locked_title')}</div>
  <p style="font-size:13.5px;color:var(--text-light);line-height:1.7;margin-bottom:16px">${t(copyKey)}</p>
  <div class="btn-group">
    <button class="btn btn-primary" onclick="openLoginPrompt()">${t('btn_sign_in')}</button>
    <button class="btn btn-outline" onclick="navigate('practice-all')">${t('nav_practice')}</button>
  </div>
</div>`;
}

function getPredictionBankRaw() {
  return window.PREDICTION_BANK || {
    repeatSentence: [],
    writeFromDictation: [],
    answerShortQuestion: [],
    describeImage: [],
    retellLecture: [],
  };
}

function getMockSetsRaw() {
  return window.PTE_MOCK_SETS || {};
}

function getMockSession() {
  try {
    const raw = sessionStorage.getItem(MOCK_SESSION_KEY)
      || localStorage.getItem(MOCK_SESSION_KEY)
      || sessionStorage.getItem(MOCK_SESSION_LEGACY_KEY)
      || 'null';
    const session = JSON.parse(raw);
    if (!session || !session.mockId) return null;
    return session;
  } catch (_error) {
    return null;
  }
}

function isMockSessionActive() {
  const session = getMockSession();
  return !!session && session.status === 'in_progress';
}

function persistMockSession(session) {
  if (!session) return;
  const serialized = JSON.stringify(session);
  sessionStorage.setItem(MOCK_SESSION_KEY, serialized);
  localStorage.setItem(MOCK_SESSION_KEY, serialized);
  sessionStorage.removeItem(MOCK_SESSION_LEGACY_KEY);
}

function getMockBlueprint(mode = 'full') {
  const full = MOCK_PLAN_BLUEPRINT.map(step => ({ ...step }));
  const speaking = full.slice(0, 5);
  const writing = full.slice(5, 7);
  const reading = full.slice(7, 12);
  const listening = full.slice(12);
  const mini = [
    { ...full[0], count: 1 },
    { ...full[5], count: 1 },
    { ...full[7], count: 1 },
    { ...full[12], count: 1 },
  ];
  return ({
    full,
    speaking,
    writing,
    reading,
    listening,
    mini,
  })[mode] || full;
}

function cloneJsonSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function shuffleMockList(items = []) {
  const list = Array.isArray(items) ? items.slice() : [];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

async function loadMockBank(questionType = '') {
  if (!questionType) return [];
  if (Array.isArray(MOCK_BANK_CACHE[questionType])) return MOCK_BANK_CACHE[questionType];
  const baseBank = Array.isArray(DB?.[questionType]) ? cloneJsonSafe(DB[questionType]) : [];
  const overrideBank = Array.isArray(MOCK_BANK_OVERRIDES[questionType]) ? cloneJsonSafe(MOCK_BANK_OVERRIDES[questionType]) : [];
  if (baseBank.length || overrideBank.length) {
    MOCK_BANK_CACHE[questionType] = [...baseBank, ...overrideBank];
    return MOCK_BANK_CACHE[questionType];
  }
  try {
    const response = await fetch(`${MOCK_BANK_BASE_PATH}/${questionType}.json`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to load ${questionType}`);
    const payload = await response.json();
    MOCK_BANK_CACHE[questionType] = Array.isArray(payload) ? payload : [];
    return MOCK_BANK_CACHE[questionType];
  } catch (_error) {
    MOCK_BANK_CACHE[questionType] = [];
    return MOCK_BANK_CACHE[questionType];
  }
}

async function buildMockSelections(steps = []) {
  const selections = {};
  for (const step of steps) {
    const bank = await loadMockBank(step.questionType);
    const sampled = shuffleMockList(bank).slice(0, Math.min(step.count, bank.length)).map(cloneJsonSafe);
    selections[step.questionType] = sampled;
  }
  return selections;
}

function getMockTotalQuestions(steps = []) {
  return (Array.isArray(steps) ? steps : []).reduce((sum, step) => sum + (Number(step?.count) || 0), 0);
}

function getMockDurationSeconds(mode = 'full', steps = []) {
  if (mode === 'full') return MOCK_TOTAL_DURATION_SECONDS;
  const usedSections = [...new Set((steps || []).map(step => step.section).filter(Boolean))];
  return usedSections.reduce((sum, section) => sum + (MOCK_SECTION_DURATIONS[section] || 0), 0) || (30 * 60);
}

async function startMockSession(mockId = 'full_mock_1', mode = 'full') {
  const steps = getMockBlueprint(mode);
  const selections = await buildMockSelections(steps);
  const totalQuestions = Object.values(selections).reduce((sum, items) => sum + (Array.isArray(items) ? items.length : 0), 0);
  const startedAt = new Date();
  const durationSeconds = getMockDurationSeconds(mode, steps);
  const session = {
    mockId: String(mockId),
    mode: String(mode || 'full'),
    title: String(getMockSetsRaw()?.[mockId]?.title || 'PTE Full Mock Test'),
    status: 'in_progress',
    startedAt: startedAt.toISOString(),
    updatedAt: startedAt.toISOString(),
    durationSeconds,
    endsAt: new Date(startedAt.getTime() + durationSeconds * 1000).toISOString(),
    steps,
    selections,
    totalQuestions,
    responses: {},
    currentPage: steps[0]?.detailPage || 'mock-test',
    currentQuestionId: '',
  };
  persistMockSession(session);
  setQuestionSource('mock', false);
  setQuestionTargetPage('');
  setSelectedQuestionId('');
  return session;
}

function clearMockSession() {
  sessionStorage.removeItem(MOCK_SESSION_KEY);
  sessionStorage.removeItem(MOCK_SESSION_LEGACY_KEY);
  localStorage.removeItem(MOCK_SESSION_KEY);
}

function getMockQuestionSet(questionType, fallbackQuestions = []) {
  const session = getMockSession();
  const { source } = getQuestionSource();
  if (!session || source !== 'mock' || session.status !== 'in_progress') return fallbackQuestions;
  if (!getTodayPlanState()) return fallbackQuestions;
  const items = session?.selections?.[questionType];
  return Array.isArray(items) && items.length ? items : fallbackQuestions;
}

function updateMockSession(partial = {}) {
  const session = getMockSession();
  if (!session) return null;
  const nextSession = {
    ...session,
    ...partial,
    updatedAt: new Date().toISOString(),
  };
  persistMockSession(nextSession);
  return nextSession;
}

function syncMockCurrentLocation(page = '', questionId = '') {
  const session = getMockSession();
  if (!session || session.status !== 'in_progress') return;
  updateMockSession({
    currentPage: page || session.currentPage,
    currentQuestionId: questionId || session.currentQuestionId || '',
  });
}

function getMockResponseEntry(questionId = '') {
  const session = getMockSession();
  if (!session || !questionId) return null;
  return session.responses?.[questionId] || null;
}

function inferMockCorrectAnswer(questionType, question) {
  if (!question) return '';
  if (questionType === 'repeatSentence') return question.text || '';
  if (questionType === 'answerShort') return question.answer || '';
  if (questionType === 'rwFillBlanks') return (question.blanks || []).map(item => item.answer).join(', ');
  if (questionType === 'mcSingleReading' || questionType === 'mcSingleListening') return question.options?.[question.answer] || '';
  if (questionType === 'mcMultipleReading' || questionType === 'mcMultipleListening') return (question.answers || []).map(index => question.options?.[index]).filter(Boolean).join(', ');
  if (questionType === 'reorderParagraphs') return (question.correctOrder || []).map(id => question.sentences?.find(item => item.id === id)?.text).filter(Boolean).join(' / ');
  if (questionType === 'rFillBlanks') return (question.blanks || []).map(item => item.word).join(', ');
  if (questionType === 'fillBlanksListening') return (question.blanks || []).map(item => item.key).join(', ');
  if (questionType === 'highlightSummary') return question.summaries?.[question.answer] || '';
  if (questionType === 'selectMissing') return question.options?.[question.answer] || '';
  if (questionType === 'highlightIncorrect') return (question.incorrectIndices || []).map(index => question.textWords?.[index]).filter(Boolean).join(', ');
  if (questionType === 'writeDictation') return question.sentence || '';
  return '';
}

function serializeMockInputs(container) {
  const values = {};
  if (!container) return values;
  container.querySelectorAll('input, textarea, select').forEach((field, index) => {
    const key = field.id || field.name || `field_${index}`;
    if (!key) return;
    if (field.type === 'checkbox' || field.type === 'radio') {
      values[key] = !!field.checked;
      return;
    }
    values[key] = field.value;
  });
  return values;
}

function deriveMockDraftSummary(container) {
  if (!container) return '';
  const parts = [];
  container.querySelectorAll('textarea, select, input[type=\"text\"], input[type=\"search\"], input[type=\"number\"]').forEach(field => {
    const value = String(field.value || '').trim();
    if (value) parts.push(value);
  });
  container.querySelectorAll('input[type=\"radio\"]:checked, input[type=\"checkbox\"]:checked').forEach(field => {
    const label = field.closest('label');
    const text = label ? String(label.textContent || '').trim() : String(field.value || '').trim();
    if (text) parts.push(text);
  });
  return parts.join(' | ').trim().slice(0, 400);
}

function restoreMockDraftInputs(container, values = {}) {
  if (!container || !values || typeof values !== 'object') return;
  container.querySelectorAll('input, textarea, select').forEach((field, index) => {
    const key = field.id || field.name || `field_${index}`;
    if (!Object.prototype.hasOwnProperty.call(values, key)) return;
    if (field.type === 'checkbox' || field.type === 'radio') {
      field.checked = !!values[key];
      return;
    }
    field.value = values[key];
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function saveMockDraft(meta = {}) {
  const session = getMockSession();
  if (!session || session.status !== 'in_progress') return;
  const questionId = meta?.question?.id || meta?.questionId || '';
  if (!questionId) return;
  const container = document.getElementById('page-container');
  const fields = meta.fields || serializeMockInputs(container);
  const summary = meta.summary != null ? meta.summary : deriveMockDraftSummary(container);
  const previous = session.responses?.[questionId] || {};
  const nextResponse = {
    ...previous,
    questionId,
    questionType: meta.questionType || previous.questionType || '',
    title: meta.title || previous.title || '',
    section: meta.section || previous.section || '',
    sectionLabel: meta.sectionLabel || previous.sectionLabel || '',
    promptText: meta.promptText || previous.promptText || '',
    correctAnswer: meta.correctAnswer != null ? meta.correctAnswer : (previous.correctAnswer || inferMockCorrectAnswer(meta.questionType, meta.question)),
    answered: typeof meta.answered === 'boolean' ? meta.answered : previous.answered || !!summary,
    draft: {
      fields,
      summary,
    },
    updatedAt: new Date().toISOString(),
  };
  updateMockSession({
    responses: {
      ...(session.responses || {}),
      [questionId]: nextResponse,
    },
  });
}

function bindMockDraftPersistence(meta = {}) {
  const session = getMockSession();
  if (!session || session.status !== 'in_progress' || !meta?.question?.id) return;
  const container = document.getElementById('page-container');
  const existing = getMockResponseEntry(meta.question.id);
  if (existing?.draft?.fields) {
    restoreMockDraftInputs(container, existing.draft.fields);
  }
  const persist = () => saveMockDraft(meta);
  container?.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', persist);
    field.addEventListener('change', persist);
  });
  saveMockDraft({
    ...meta,
    answered: existing?.answered || false,
  });
}

function getMockCurrentProgress(pageKey = '', qIndex = 0) {
  const session = getMockSession();
  const state = getTodayPlanState();
  if (!session || !state) return null;
  const step = state.steps[state.currentStep];
  if (!step || step.page !== pageKey) return null;
  const totalQuestions = getMockTotalQuestions(state.steps);
  const overallBase = state.steps.slice(0, state.currentStep).reduce((sum, item) => sum + (Number(item?.count) || 0), 0);
  const sectionSteps = state.steps.filter(item => item.section === step.section);
  const sectionBase = state.steps
    .slice(0, state.currentStep)
    .filter(item => item.section === step.section)
    .reduce((sum, item) => sum + (Number(item?.count) || 0), 0);
  const remainingMs = Math.max(0, new Date(session.endsAt || 0).getTime() - Date.now());
  return {
    totalQuestions,
    overallCurrent: overallBase + qIndex + 1,
    overallPercent: totalQuestions ? ((overallBase + qIndex + 1) / totalQuestions) * 100 : 0,
    sectionCurrent: sectionBase + qIndex + 1,
    sectionTotal: sectionSteps.reduce((sum, item) => sum + (Number(item?.count) || 0), 0),
    sectionPercent: sectionSteps.length ? ((sectionBase + qIndex + 1) / sectionSteps.reduce((sum, item) => sum + (Number(item?.count) || 0), 0)) * 100 : 0,
    sectionLabel: step.sectionLabel || MOCK_SECTION_LABELS[step.section] || '',
    stepTitle: step.title || '',
    remainingMs,
  };
}

function renderMockProgressHeader(pageKey = '', qIndex = 0) {
  const progress = getMockCurrentProgress(pageKey, qIndex);
  if (!progress) return '';
  return `
<div class="mock-progress-shell" id="mock-progress-shell">
  <div class="mock-progress-top">
    <div>
      <div class="mock-progress-label">${progress.sectionLabel}</div>
      <div class="mock-progress-meta">Question ${progress.overallCurrent} / ${progress.totalQuestions} · ${progress.stepTitle}</div>
    </div>
    <div class="mock-progress-timer" id="mock-session-timer">${formatTime(Math.ceil(progress.remainingMs / 1000))}</div>
  </div>
  <div class="mock-progress-grid">
    <div class="mock-progress-card">
      <div class="mock-progress-card-label">Overall Progress</div>
      <div class="mock-progress-card-value">${progress.overallCurrent} / ${progress.totalQuestions}</div>
      <div class="mock-progress-bar"><span style="width:${Math.max(0, Math.min(100, progress.overallPercent))}%"></span></div>
    </div>
    <div class="mock-progress-card">
      <div class="mock-progress-card-label">Section Progress</div>
      <div class="mock-progress-card-value">${progress.sectionCurrent} / ${progress.sectionTotal}</div>
      <div class="mock-progress-bar section"><span style="width:${Math.max(0, Math.min(100, progress.sectionPercent))}%"></span></div>
    </div>
  </div>
</div>`;
}

function mountMockProgressHeader(meta = {}) {
  const session = getMockSession();
  if (!session || session.status !== 'in_progress' || !meta?.pageKey) return;
  const container = document.getElementById('page-container');
  const pageHeader = container?.querySelector('.page-header');
  if (!container || !pageHeader) return;
  syncMockCurrentLocation(window.__currentPage || meta.detailPage || '', meta?.question?.id || '');
  const wrapper = document.createElement('div');
  wrapper.innerHTML = renderMockProgressHeader(meta.pageKey, meta.qIndex || 0);
  const node = wrapper.firstElementChild;
  if (!node) return;
  pageHeader.insertAdjacentElement('afterend', node);
  const timerEl = node.querySelector('#mock-session-timer');
  if (timerEl) {
    const tick = () => {
      const current = getMockSession();
      if (!current || current.status !== 'in_progress') return;
      const remaining = Math.max(0, new Date(current.endsAt || 0).getTime() - Date.now());
      timerEl.textContent = formatTime(Math.ceil(remaining / 1000));
      if (remaining <= 0) {
        updateMockSession({ status: 'completed', completedAt: new Date().toISOString(), currentPage: 'mock-results' });
        clearTodayPlan();
        navigate('mock-results');
      }
    };
    tick();
    const iv = setInterval(tick, 1000);
    const previousCleanup = window.__pageCleanup;
    setPageCleanup(() => {
      clearInterval(iv);
      if (typeof previousCleanup === 'function') {
        try {
          previousCleanup();
        } catch (_error) {}
      }
    });
  }
  applyMockLinearNavigation(meta.pageKey, meta.qIndex || 0, Number(meta.totalQuestions || 0), MOCK_PAGE_NEXT_ACTIONS[meta.pageKey] || '');
}

function collectMockSectionStats(sectionKey = '') {
  const session = getMockSession();
  if (!session) return null;
  const steps = (session.steps || []).filter(step => step.section === sectionKey);
  const total = steps.reduce((sum, step) => sum + (Number(step.count) || 0), 0);
  const questionIds = steps.flatMap(step => (session.selections?.[step.questionType] || []).map(item => item.id));
  const responses = questionIds.map(id => session.responses?.[id]).filter(Boolean);
  const answered = responses.filter(item => item.answered).length;
  const scored = responses.filter(item => typeof item.score === 'number');
  const averageScore = scored.length ? Math.round(scored.reduce((sum, item) => sum + item.score, 0) / scored.length) : null;
  return {
    key: sectionKey,
    label: MOCK_SECTION_LABELS[sectionKey] || sectionKey,
    total,
    answered,
    unanswered: Math.max(0, total - answered),
    averageScore,
  };
}

function getMockReviewItems() {
  const session = getMockSession();
  if (!session) return [];
  let overallNumber = 0;
  return (session.steps || []).flatMap(step => {
    return (session.selections?.[step.questionType] || []).map(question => {
      overallNumber += 1;
      const response = session.responses?.[question.id] || {};
      return {
        overallNumber,
        section: step.section,
        sectionLabel: step.sectionLabel || MOCK_SECTION_LABELS[step.section] || '',
        title: step.title,
        questionType: step.questionType,
        question,
        response,
      };
    });
  });
}

function finalizeMockSession() {
  const session = getMockSession();
  if (!session) return null;
  const completed = {
    ...session,
    status: 'completed',
    completedAt: new Date().toISOString(),
    currentPage: 'mock-results',
  };
  persistMockSession(completed);
  return completed;
}

function getPredictionBankActive(type, latestOnly = false, highOnly = false) {
  const bank = getPredictionBankRaw();
  let items = Array.isArray(bank[type]) ? bank[type].filter(item => item && item.status === 'active') : [];
  if (highOnly) items = items.filter(item => item.frequency === 'high');
  if (!latestOnly || !items.length) return items;
  const latestMonth = items.map(item => item.monthTag).sort().slice(-1)[0];
  return items.filter(item => item.monthTag === latestMonth);
}

function setQuestionSource(source = 'default', latestOnly = false) {
  sessionStorage.setItem(QUESTION_SOURCE_KEY, source);
  sessionStorage.setItem(QUESTION_LATEST_ONLY_KEY, latestOnly ? '1' : '0');
}

function getQuestionSource() {
  return {
    source: sessionStorage.getItem(QUESTION_SOURCE_KEY) || 'default',
    latestOnly: sessionStorage.getItem(QUESTION_LATEST_ONLY_KEY) === '1',
  };
}

function loadPageUiStateMap() {
  try {
    return JSON.parse(sessionStorage.getItem(PAGE_UI_STATE_KEY) || '{}') || {};
  } catch (_error) {
    return {};
  }
}

function savePageUiState(page, questionKey, payload) {
  if (!page || !questionKey || !payload) return;
  const map = loadPageUiStateMap();
  if (!map[page]) map[page] = {};
  map[page][questionKey] = payload;
  sessionStorage.setItem(PAGE_UI_STATE_KEY, JSON.stringify(map));
}

function getPageUiState(page, questionKey) {
  if (!page || !questionKey) return null;
  const map = loadPageUiStateMap();
  return map[page]?.[questionKey] || null;
}

function clearPageUiState(page, questionKey) {
  if (!page || !questionKey) return;
  const map = loadPageUiStateMap();
  if (!map[page]?.[questionKey]) return;
  delete map[page][questionKey];
  if (!Object.keys(map[page]).length) delete map[page];
  sessionStorage.setItem(PAGE_UI_STATE_KEY, JSON.stringify(map));
}

function setQuestionTargetPage(page = '') {
  sessionStorage.setItem(QUESTION_TARGET_PAGE_KEY, page);
}

function getQuestionTargetPage() {
  return sessionStorage.getItem(QUESTION_TARGET_PAGE_KEY) || '';
}

function setSelectedQuestionId(id = '') {
  if (!id) {
    sessionStorage.removeItem(QUESTION_SELECTED_ID_KEY);
    return;
  }
  sessionStorage.setItem(QUESTION_SELECTED_ID_KEY, String(id));
}

function getSelectedQuestionId() {
  return sessionStorage.getItem(QUESTION_SELECTED_ID_KEY) || '';
}

function getInitialQuestionIndex(questions) {
  const selectedId = getSelectedQuestionId();
  if (!selectedId || !Array.isArray(questions)) return 0;
  const index = questions.findIndex(item => String(item?.id || '') === selectedId);
  return index >= 0 ? index : 0;
}

const TODAY_PLAN_STORAGE_KEY = 'pte_today_plan_state';

function getTodayPlanState() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(TODAY_PLAN_STORAGE_KEY) || 'null');
    if (!parsed || !Array.isArray(parsed.steps)) return null;
    return {
      currentStep: Math.max(0, Number(parsed.currentStep) || 0),
      steps: parsed.steps.filter(step => step && step.page && step.detailPage),
    };
  } catch (error) {
    return null;
  }
}

function saveTodayPlanState(state) {
  if (!state || !Array.isArray(state.steps) || !state.steps.length) {
    sessionStorage.removeItem(TODAY_PLAN_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(TODAY_PLAN_STORAGE_KEY, JSON.stringify(state));
}

function clearTodayPlan() {
  sessionStorage.removeItem(TODAY_PLAN_STORAGE_KEY);
}

function startTodayPlan(steps = []) {
  const normalized = steps
    .map(step => ({
      page: String(step?.page || ''),
      detailPage: String(step?.detailPage || ''),
      count: Math.max(1, Number(step?.count) || 1),
      title: String(step?.title || ''),
      questionType: String(step?.questionType || ''),
      section: String(step?.section || ''),
      sectionLabel: String(step?.sectionLabel || ''),
    }))
    .filter(step => step.page && step.detailPage);
  if (!normalized.length) {
    clearTodayPlan();
    return;
  }
  saveTodayPlanState({ currentStep: 0, steps: normalized });
  setQuestionSource(isMockSessionActive() ? 'mock' : 'default', false);
  setQuestionTargetPage('');
  setSelectedQuestionId('');
  navigate(normalized[0].detailPage);
}

function getTodayPlanStepForPage(page = '') {
  const state = getTodayPlanState();
  if (!state) return null;
  const step = state.steps[state.currentStep];
  if (!step || step.page !== page) return null;
  return {
    ...step,
    stepIndex: state.currentStep,
    totalSteps: state.steps.length,
  };
}

function getTodayPlanQuestions(page = '', questions = []) {
  const step = getTodayPlanStepForPage(page);
  if (!step || !Array.isArray(questions)) return questions;
  return questions.slice(0, Math.max(1, Math.min(step.count, questions.length)));
}

function renderTodayPlanAction(page = '') {
  const step = getTodayPlanStepForPage(page);
  if (!step) return '';
  const isLastStep = step.stepIndex >= step.totalSteps - 1;
  const action = isLastStep ? 'TodayPlan_complete()' : 'TodayPlan_nextStep()';
  const label = isLastStep ? t('study_plan_finish_today') : t('study_plan_next_step');
  const mockClass = isMockStepPage(page) ? ' mock-linear-next' : '';
  return `<button class="btn btn-primary${mockClass}" onclick="${action}">${label}</button>`;
}

function getTodayPlanNextAction(page = '') {
  const step = getTodayPlanStepForPage(page);
  if (!step) return '';
  return step.stepIndex >= step.totalSteps - 1 ? 'TodayPlan_complete()' : 'TodayPlan_nextStep()';
}

const MOCK_PAGE_NEXT_ACTIONS = {
  'practice-read-aloud': 'RA_next()',
  'practice-repeat-sentence': 'RS_next()',
  'practice-describe-image': 'DI_next()',
  'practice-retell-lecture': 'RL_next()',
  'practice-answer-short': 'ASQ_next()',
  'practice-summarize-written': 'SWT_next()',
  'practice-write-essay': 'WE_next()',
  'practice-rw-fill-blanks': 'RWFIB_next()',
  'practice-mc-multiple-reading': 'MCMR_next()',
  'practice-reorder-paragraphs': 'ROP_next()',
  'practice-r-fill-blanks': 'RFIB_next()',
  'practice-mc-single-reading': 'MCSR_next()',
  'practice-summarize-spoken': 'SST_next()',
  'practice-mc-multiple-listening': 'MCML_next()',
  'practice-fill-blanks-listening': 'FBL_next()',
  'practice-highlight-summary': 'HCS_next()',
  'practice-mc-single-listening': 'MCSL_next()',
  'practice-select-missing': 'SMW_next()',
  'practice-highlight-incorrect': 'HI_next()',
  'practice-write-dictation': 'WFD_next()',
};

function isMockStepPage(page = '') {
  return isMockSessionActive() && !!getTodayPlanStepForPage(page);
}

function getMockLinearNextAction(page = '', qIndex = 0, totalQuestions = 0, questionNextAction = '') {
  if (!isMockStepPage(page)) return questionNextAction || '';
  const total = Math.max(1, Number(totalQuestions) || 1);
  if (qIndex < total - 1) return questionNextAction || MOCK_PAGE_NEXT_ACTIONS[page] || '';
  return getTodayPlanNextAction(page) || questionNextAction || '';
}

function getMockLinearNextLabel(page = '', qIndex = 0, totalQuestions = 0) {
  if (!isMockStepPage(page)) return t('btn_next');
  const total = Math.max(1, Number(totalQuestions) || 1);
  if (qIndex < total - 1) return t('btn_next');
  const step = getTodayPlanStepForPage(page);
  return step && step.stepIndex >= step.totalSteps - 1 ? t('study_plan_finish_today') : t('study_plan_next_step');
}

function renderMockLinearNextButton(page = '', qIndex = 0, totalQuestions = 0, questionNextAction = '', className = 'btn btn-primary') {
  const action = getMockLinearNextAction(page, qIndex, totalQuestions, questionNextAction);
  const label = getMockLinearNextLabel(page, qIndex, totalQuestions);
  return `<button class="${className} mock-linear-next" onclick="${action}" ${action ? '' : 'disabled'}>${label}</button>`;
}

function applyMockLinearNavigation(page = '', qIndex = 0, totalQuestions = 0, questionNextAction = '') {
  if (!isMockStepPage(page)) return;
  const container = document.getElementById('page-container');
  if (!container) return;
  const nextAction = questionNextAction || MOCK_PAGE_NEXT_ACTIONS[page] || '';
  const session = getMockSession();
  const step = getTodayPlanStepForPage(page);
  const selectionTotal = Array.isArray(session?.selections?.[step?.questionType]) ? session.selections[step.questionType].length : 0;
  const effectiveTotal = Number(totalQuestions) || selectionTotal || Number(step?.count) || 1;
  const linearAction = getMockLinearNextAction(page, qIndex, effectiveTotal, nextAction);
  const linearLabel = getMockLinearNextLabel(page, qIndex, effectiveTotal);
  container.querySelectorAll('button').forEach(button => {
    const onclick = button.getAttribute('onclick') || '';
    if (/_prev\(\)/.test(onclick)) {
      button.remove();
      return;
    }
    if ((nextAction && onclick === nextAction) || onclick === 'TodayPlan_nextStep()' || onclick === 'TodayPlan_complete()') {
      button.disabled = !linearAction;
      if (onclick === 'TodayPlan_nextStep()' || onclick === 'TodayPlan_complete()') {
        button.disabled = false;
      } else {
        if (linearAction) button.setAttribute('onclick', linearAction);
        button.textContent = linearLabel;
      }
      button.classList.add('mock-linear-next');
      const nav = button.closest('.btn-group, .result-actions, .speaking-result-actions, .speaking-exam-footer');
      nav?.classList.add('mock-linear-nav');
    }
  });
}

function applyCurrentMockLinearNavigation(page = '') {
  if (!isMockSessionActive()) return;
  const session = getMockSession();
  const state = getTodayPlanState();
  if (!session || !state) return;
  const step = state.steps[state.currentStep];
  if (!step || step.detailPage !== page) return;
  const selections = Array.isArray(session.selections?.[step.questionType]) ? session.selections[step.questionType] : [];
  const currentId = session.currentQuestionId || getSelectedQuestionId();
  const foundIndex = selections.findIndex(item => String(item?.id || '') === String(currentId || ''));
  const qIndex = foundIndex >= 0 ? foundIndex : 0;
  applyMockLinearNavigation(step.page, qIndex, selections.length || step.count || 1, MOCK_PAGE_NEXT_ACTIONS[step.page] || '');
}

let mockLinearNavScheduled = false;

function scheduleCurrentMockLinearNavigation(page = '') {
  if (!isMockSessionActive()) return;
  if (mockLinearNavScheduled) return;
  mockLinearNavScheduled = true;
  requestAnimationFrame(() => {
    mockLinearNavScheduled = false;
    applyCurrentMockLinearNavigation(page || window.__currentPage || sessionStorage.getItem('pte_page') || '');
  });
}

function goToNextTodayPlanStep() {
  const state = getTodayPlanState();
  if (!state) return false;
  const nextStepIndex = state.currentStep + 1;
  if (nextStepIndex >= state.steps.length) {
    completeTodayPlan();
    return true;
  }
  state.currentStep = nextStepIndex;
  saveTodayPlanState(state);
  setQuestionSource(isMockSessionActive() ? 'mock' : 'default', false);
  setQuestionTargetPage('');
  setSelectedQuestionId('');
  navigate(state.steps[nextStepIndex].detailPage);
  return true;
}

function completeTodayPlan() {
  const mockSession = getMockSession();
  clearTodayPlan();
  setSelectedQuestionId('');
  if (mockSession && (mockSession.status === 'in_progress' || mockSession.status === 'completed')) {
    finalizeMockSession();
    navigate('mock-results');
    showToast(getAppLang() === 'zh' ? '模考已完成，结果已生成。' : 'Mock test completed. Your results are ready.');
    return;
  }
  navigate('study-plan');
  showToast(t('study_plan_done_toast'));
}

function syncSelectedQuestion(question) {
  if (question?.id) {
    setSelectedQuestionId(question.id);
    syncMockCurrentLocation(window.__currentPage || '', question.id);
    scheduleCurrentMockLinearNavigation(window.__currentPage || '');
  }
}

function openQuestionSet(page, source = 'default', latestOnly = false) {
  if (source !== 'mock') {
    clearMockSession();
    clearTodayPlan();
  }
  setQuestionSource(source, latestOnly);
  setQuestionTargetPage('');
  setSelectedQuestionId('');
  navigate(page);
}

function openQuestionList(page, source = 'default', latestOnly = false) {
  if (source !== 'mock') {
    clearMockSession();
    clearTodayPlan();
  }
  setQuestionSource(source, latestOnly);
  setQuestionTargetPage(page);
  setSelectedQuestionId('');
  navigate('question-list');
}

function openQuestionFromList(id) {
  const page = getQuestionTargetPage();
  if (!page) {
    navigate('practice-all');
    return;
  }
  setSelectedQuestionId(id);
  navigate(page);
}

function backToQuestionList(fallbackPage = 'practice') {
  const targetPage = getQuestionTargetPage();
  if (targetPage) {
    navigate('question-list');
    return;
  }
  navigate(fallbackPage || 'practice');
}

function getQuestionSet(defaultQuestions, predictionType, mapPrediction) {
  const { source, latestOnly } = getQuestionSource();
  if (source !== 'prediction') return defaultQuestions;
  const highOnly = sessionStorage.getItem('pte_prediction_high_only') === '1';
  const items = getPredictionBankActive(predictionType, latestOnly, highOnly);
  if (!items.length) return defaultQuestions;
  return items.map(mapPrediction);
}

function setPredictionHighOnly(enabled) {
  sessionStorage.setItem('pte_prediction_high_only', enabled ? '1' : '0');
}

function getPredictionHighOnly() {
  return sessionStorage.getItem('pte_prediction_high_only') === '1';
}

function getDiTemplates() {
  return Array.isArray(window.DI_TEMPLATES) ? window.DI_TEMPLATES.slice() : [];
}

function getDiTemplateTypeLabel(type) {
  const labels = {
    line: t('di_type_line'),
    bar: t('di_type_bar'),
    pie: t('di_type_pie'),
    process: t('di_type_process'),
    map: t('di_type_map'),
  };
  return labels[type] || type;
}

function shuffleList(items) {
  const list = Array.isArray(items) ? items.slice() : [];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function getPredictionDescribeImageTemplate(templateType = 'bar_chart', title = '') {
  const safeTitle = String(title || '').replace(/[&<>"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s]));
  const templates = {
    line_population: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><line x1="40" y1="168" x2="295" y2="168" stroke="#cbd5e1"/><line x1="40" y1="35" x2="40" y2="168" stroke="#cbd5e1"/><polyline points="55,145 90,135 125,125 160,115 195,103 230,90 265,78 290,70" fill="none" stroke="#3b82f6" stroke-width="3"/><g fill="#3b82f6"><circle cx="55" cy="145" r="3"/><circle cx="90" cy="135" r="3"/><circle cx="125" cy="125" r="3"/><circle cx="160" cy="115" r="3"/><circle cx="195" cy="103" r="3"/><circle cx="230" cy="90" r="3"/><circle cx="265" cy="78" r="3"/><circle cx="290" cy="70" r="3"/></g></svg>`,
    line_temperature: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><line x1="40" y1="168" x2="295" y2="168" stroke="#cbd5e1"/><line x1="40" y1="35" x2="40" y2="168" stroke="#cbd5e1"/><polyline points="55,150 82,144 110,138 138,130 166,122 194,113 222,103 250,92 278,82" fill="none" stroke="#ef4444" stroke-width="3"/><g fill="#ef4444"><circle cx="55" cy="150" r="3"/><circle cx="82" cy="144" r="3"/><circle cx="110" cy="138" r="3"/><circle cx="138" cy="130" r="3"/><circle cx="166" cy="122" r="3"/><circle cx="194" cy="113" r="3"/><circle cx="222" cy="103" r="3"/><circle cx="250" cy="92" r="3"/><circle cx="278" cy="82" r="3"/></g></svg>`,
    line_sales: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><line x1="40" y1="168" x2="295" y2="168" stroke="#cbd5e1"/><line x1="40" y1="35" x2="40" y2="168" stroke="#cbd5e1"/><polyline points="70,128 130,118 195,102 270,92" fill="none" stroke="#22c55e" stroke-width="3"/><g fill="#22c55e"><circle cx="70" cy="128" r="4"/><circle cx="130" cy="118" r="4"/><circle cx="195" cy="102" r="4"/><circle cx="270" cy="92" r="4"/></g><text x="70" y="184" text-anchor="middle" font-size="9" fill="#6b7280">Q1</text><text x="130" y="184" text-anchor="middle" font-size="9" fill="#6b7280">Q2</text><text x="195" y="184" text-anchor="middle" font-size="9" fill="#6b7280">Q3</text><text x="270" y="184" text-anchor="middle" font-size="9" fill="#6b7280">Q4</text></svg>`,
    bar_age_group: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><line x1="40" y1="168" x2="295" y2="168" stroke="#cbd5e1"/><rect x="58" y="120" width="26" height="48" fill="#60a5fa"/><rect x="106" y="98" width="26" height="70" fill="#3b82f6"/><rect x="154" y="110" width="26" height="58" fill="#60a5fa"/><rect x="202" y="126" width="26" height="42" fill="#3b82f6"/><rect x="250" y="142" width="26" height="26" fill="#60a5fa"/></svg>`,
    bar_books: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><line x1="40" y1="168" x2="295" y2="168" stroke="#cbd5e1"/><rect x="58" y="80" width="24" height="88" fill="#8b5cf6"/><rect x="106" y="105" width="24" height="63" fill="#a78bfa"/><rect x="154" y="118" width="24" height="50" fill="#8b5cf6"/><rect x="202" y="140" width="24" height="28" fill="#a78bfa"/><rect x="250" y="150" width="24" height="18" fill="#8b5cf6"/></svg>`,
    bar_profit: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><line x1="40" y1="168" x2="295" y2="168" stroke="#cbd5e1"/><rect x="70" y="116" width="28" height="52" fill="#fb923c"/><rect x="130" y="104" width="28" height="64" fill="#fb923c"/><rect x="190" y="96" width="28" height="72" fill="#fb923c"/><rect x="250" y="110" width="28" height="58" fill="#fb923c"/></svg>`,
    pie_smartphone: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><circle cx="120" cy="108" r="58" fill="#e5e7eb"/><path d="M120 108 L120 50 A58 58 0 0 1 172 83 Z" fill="#60a5fa"/><path d="M120 108 L172 83 A58 58 0 0 1 162 150 Z" fill="#fb923c"/><path d="M120 108 L162 150 A58 58 0 0 1 84 154 Z" fill="#4ade80"/><path d="M120 108 L84 154 A58 58 0 0 1 70 84 Z" fill="#f87171"/><path d="M120 108 L70 84 A58 58 0 0 1 120 50 Z" fill="#a78bfa"/></svg>`,
    pie_budget: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><circle cx="120" cy="108" r="58" fill="#e5e7eb"/><path d="M120 108 L120 50 A58 58 0 0 1 175 88 Z" fill="#60a5fa"/><path d="M120 108 L175 88 A58 58 0 0 1 157 155 Z" fill="#4ade80"/><path d="M120 108 L157 155 A58 58 0 0 1 98 162 Z" fill="#fbbf24"/><path d="M120 108 L98 162 A58 58 0 0 1 64 116 Z" fill="#f87171"/><path d="M120 108 L64 116 A58 58 0 0 1 120 50 Z" fill="#a78bfa"/></svg>`,
    pie_energy: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><circle cx="120" cy="108" r="58" fill="#e5e7eb"/><path d="M120 108 L120 50 A58 58 0 0 1 176 93 Z" fill="#60a5fa"/><path d="M120 108 L176 93 A58 58 0 0 1 154 154 Z" fill="#fb923c"/><path d="M120 108 L154 154 A58 58 0 0 1 91 159 Z" fill="#4ade80"/><path d="M120 108 L91 159 A58 58 0 0 1 66 113 Z" fill="#f87171"/><path d="M120 108 L66 113 A58 58 0 0 1 120 50 Z" fill="#a78bfa"/></svg>`,
    process_recycling: `<svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px"><rect width="340" height="210" fill="#fff"/><text x="170" y="20" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><rect x="18" y="68" width="54" height="36" rx="8" fill="#dcfce7" stroke="#22c55e"/><rect x="92" y="68" width="54" height="36" rx="8" fill="#dbeafe" stroke="#3b82f6"/><rect x="166" y="68" width="54" height="36" rx="8" fill="#e5e7eb" stroke="#94a3b8"/><rect x="240" y="68" width="54" height="36" rx="8" fill="#dcfce7" stroke="#22c55e"/><rect x="129" y="138" width="82" height="36" rx="8" fill="#eff6ff" stroke="#2563eb"/><path d="M72 86 H92 M146 86 H166 M220 86 H240 M267 104 V124 H170" stroke="#64748b" stroke-width="2" fill="none"/></svg>`,
    process_manufacturing: `<svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px"><rect width="340" height="210" fill="#fff"/><text x="170" y="20" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><rect x="18" y="68" width="54" height="36" rx="8" fill="#e5e7eb" stroke="#94a3b8"/><rect x="92" y="68" width="54" height="36" rx="8" fill="#dbeafe" stroke="#3b82f6"/><rect x="166" y="68" width="54" height="36" rx="8" fill="#fee2e2" stroke="#ef4444"/><rect x="240" y="68" width="54" height="36" rx="8" fill="#fef3c7" stroke="#f59e0b"/><rect x="129" y="138" width="82" height="36" rx="8" fill="#dcfce7" stroke="#22c55e"/><path d="M72 86 H92 M146 86 H166 M220 86 H240 M267 104 V124 H170" stroke="#64748b" stroke-width="2" fill="none"/></svg>`,
    process_water: `<svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px"><rect width="340" height="210" fill="#fff"/><text x="170" y="20" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><rect x="18" y="68" width="54" height="36" rx="8" fill="#dbeafe" stroke="#60a5fa"/><rect x="92" y="68" width="54" height="36" rx="8" fill="#e0f2fe" stroke="#38bdf8"/><rect x="166" y="68" width="54" height="36" rx="8" fill="#cffafe" stroke="#06b6d4"/><rect x="240" y="68" width="54" height="36" rx="8" fill="#e0f2fe" stroke="#38bdf8"/><rect x="129" y="138" width="82" height="36" rx="8" fill="#dbeafe" stroke="#2563eb"/><path d="M72 86 H92 M146 86 H166 M220 86 H240 M267 104 V124 H170" stroke="#64748b" stroke-width="2" fill="none"/></svg>`,
    map_migration: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><path d="M35 95 C55 65, 95 65, 120 85 C150 60, 190 60, 220 86 C245 80, 280 88, 295 103" fill="#dbeafe" stroke="#bfdbfe"/><path d="M60 100 C85 82, 112 86, 132 98" fill="none" stroke="#f97316" stroke-width="2"/><path d="M145 102 C172 84, 205 88, 228 103" fill="none" stroke="#f97316" stroke-width="2"/><path d="M100 120 C138 136, 205 136, 254 120" fill="none" stroke="#f97316" stroke-width="2"/></svg>`,
    map_density: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><path d="M35 95 C55 65, 95 65, 120 85 C150 60, 190 60, 220 86 C245 80, 280 88, 295 103" fill="#d9f99d" stroke="#bef264"/><circle cx="70" cy="98" r="12" fill="#fcd34d"/><circle cx="160" cy="90" r="14" fill="#86efac"/><circle cx="235" cy="104" r="16" fill="#4ade80"/></svg>`,
    map_exports: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><path d="M35 95 C55 65, 95 65, 120 85 C150 60, 190 60, 220 86 C245 80, 280 88, 295 103" fill="#e0f2fe" stroke="#bae6fd"/><circle cx="65" cy="96" r="10" fill="#60a5fa"/><circle cx="118" cy="112" r="10" fill="#f59e0b"/><circle cx="190" cy="94" r="10" fill="#22c55e"/><circle cx="252" cy="108" r="10" fill="#ef4444"/></svg>`,
    bar_chart: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><line x1="40" y1="168" x2="295" y2="168" stroke="#cbd5e1"/><rect x="60" y="125" width="28" height="43" fill="#2563eb" rx="2"/><rect x="118" y="100" width="28" height="68" fill="#1d4ed8" rx="2"/><rect x="176" y="82" width="28" height="86" fill="#3b82f6" rx="2"/><rect x="234" y="60" width="28" height="108" fill="#60a5fa" rx="2"/></svg>`,
    line_chart: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><line x1="40" y1="168" x2="295" y2="168" stroke="#cbd5e1"/><line x1="40" y1="35" x2="40" y2="168" stroke="#cbd5e1"/><polyline points="40,145 95,130 150,105 205,112 260,78 290,68" fill="none" stroke="#2563eb" stroke-width="3"/></svg>`,
    pie_chart: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><circle cx="120" cy="108" r="58" fill="#e5e7eb"/><path d="M120 108 L120 50 A58 58 0 0 1 172 83 Z" fill="#60a5fa"/><path d="M120 108 L172 83 A58 58 0 0 1 162 150 Z" fill="#fb923c"/><path d="M120 108 L162 150 A58 58 0 0 1 84 154 Z" fill="#4ade80"/><path d="M120 108 L84 154 A58 58 0 0 1 120 50 Z" fill="#a78bfa"/></svg>`,
    process: `<svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px"><rect width="340" height="210" fill="#fff"/><text x="170" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><rect x="25" y="60" width="70" height="38" rx="8" fill="#eff6ff" stroke="#2563eb"/><rect x="135" y="60" width="70" height="38" rx="8" fill="#eff6ff" stroke="#2563eb"/><rect x="245" y="60" width="70" height="38" rx="8" fill="#eff6ff" stroke="#2563eb"/><rect x="135" y="140" width="70" height="38" rx="8" fill="#dbeafe" stroke="#1d4ed8"/><path d="M95 79 H135 M205 79 H245 M280 98 V125 H205" stroke="#2563eb" stroke-width="2" fill="none"/></svg>`,
    table: `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="210" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><rect x="35" y="42" width="250" height="140" fill="#fff" stroke="#d1d5db"/><line x1="35" y1="72" x2="285" y2="72" stroke="#d1d5db"/><line x1="150" y1="42" x2="150" y2="182" stroke="#d1d5db"/><line x1="35" y1="102" x2="285" y2="102" stroke="#e5e7eb"/><line x1="35" y1="132" x2="285" y2="132" stroke="#e5e7eb"/><line x1="35" y1="162" x2="285" y2="162" stroke="#e5e7eb"/></svg>`,
    map: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px"><rect width="320" height="200" fill="#fff"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">${safeTitle}</text><path d="M35 95 C55 65, 95 65, 120 85 C150 60, 190 60, 220 86 C245 80, 280 88, 295 103" fill="#dbeafe" stroke="#bfdbfe"/></svg>`,
  };
  return templates[templateType] || templates.bar_chart;
}

function setAppLang(lang) {
  const next = lang === 'en' ? 'en' : 'zh';
  localStorage.setItem('pte_lang', next);
  document.documentElement.lang = next === 'en' ? 'en' : 'zh';
  applyStaticI18n();
  renderSidebarNav(window.__currentPage || sessionStorage.getItem('pte_page') || 'home');
  renderMobileHeaderControls(window.__currentPage || sessionStorage.getItem('pte_page') || 'home');
  const theme = getCurrentTheme();
  applyTheme(theme);
  const currentPage = sessionStorage.getItem('pte_page') || 'home';
  const fn = Pages[currentPage];
  if (fn) fn();
}

Pages['practice-all'] = function() {
  window.__practiceCategory = 'all';
  window.__practiceTab = 'all';
  window.renderPracticeDirectoryPage();
};

Pages['practice'] = Pages['practice-all'];

Pages['practice-speaking'] = function() {
  window.__practiceCategory = 'speaking';
  window.__practiceTab = 'all';
  window.renderPracticeDirectoryPage();
};

Pages['practice-writing'] = function() {
  window.__practiceCategory = 'writing';
  window.__practiceTab = 'all';
  window.renderPracticeDirectoryPage();
};

Pages['practice-reading'] = function() {
  window.__practiceCategory = 'reading';
  window.__practiceTab = 'all';
  window.renderPracticeDirectoryPage();
};

Pages['practice-listening'] = function() {
  window.__practiceCategory = 'listening';
  window.__practiceTab = 'all';
  window.renderPracticeDirectoryPage();
};

Pages['tools-prediction-bank'] = function() {
  window.__practiceCategory = 'prediction';
  window.__practiceTab = 'prediction';
  if (window.__practicePredictionFilter !== 'latest') {
    window.__practicePredictionFilter = false;
  }
  setPredictionHighOnly(false);
  window.renderPracticeDirectoryPage();
};

Pages['smart-practice-prediction-bank'] = Pages['tools-prediction-bank'];

Pages['tools-high-frequency'] = function() {
  window.__practiceCategory = 'prediction';
  window.__practiceTab = 'prediction';
  window.__practicePredictionFilter = 'high';
  setPredictionHighOnly(true);
  window.renderPracticeDirectoryPage();
};

Pages['smart-practice-high-frequency'] = Pages['tools-high-frequency'];

Pages['tools-mistakes'] = function() {
  if (isGuestUser()) {
    $('#page-container').innerHTML = renderProtectedFeatureGate('progress_guest_title', 'progress_guest_copy');
    return;
  }
  const activeTab = window.__mistakesTab === 'listening' ? 'listening' : 'speaking';
  const typeMeta = {
    readAloud: { label: t('ra_title'), bucket: 'speaking', icon: '📖' },
    repeatSentence: { label: t('rs_title'), bucket: 'speaking', icon: '🔁' },
    describeImage: { label: t('di_title'), bucket: 'speaking', icon: '🖼️' },
    retellLecture: { label: t('rl_title'), bucket: 'speaking', icon: '🎙️' },
    answerShort: { label: t('asq_title'), bucket: 'speaking', icon: '❓' },
    summarizeSpoken: { label: t('sst_title'), bucket: 'listening', icon: '🎧' },
    mcSingleListening: { label: t('mcsl_title'), bucket: 'listening', icon: '🔘' },
    mcMultipleListening: { label: t('mcml_title'), bucket: 'listening', icon: '☑️' },
    fillBlanksListening: { label: t('fbl_title'), bucket: 'listening', icon: '🎵' },
    highlightSummary: { label: t('hcs_title'), bucket: 'listening', icon: '💡' },
    selectMissing: { label: t('smw_title'), bucket: 'listening', icon: '🔍' },
    highlightIncorrect: { label: t('hi_title'), bucket: 'listening', icon: '❌' },
    writeDictation: { label: t('wfd_title'), bucket: 'listening', icon: '✏️' },
  };

  const relTime = (dateStr) => {
    const mins = Math.max(1, Math.round((Date.now() - new Date(dateStr).getTime()) / 60000));
    if (mins < 60) return t('time_minutes_ago').replace('${n}', mins);
    if (mins < 1440) return t('time_hours_ago').replace('${n}', Math.round(mins / 60));
    return t('time_days_ago').replace('${n}', Math.round(mins / 1440));
  };

  const renderMistakes = (attempts = []) => {
    const dismissed = new Set(getDismissedMistakes());
    const latestByQuestion = new Map();

    attempts.forEach(item => {
      const questionType = item.question_type || '';
      const meta = typeMeta[questionType];
      if (!meta || typeof item.score !== 'number' || item.score >= 60) return;
      const key = buildMistakeKey(item);
      if (!item.question_id || dismissed.has(key)) return;
      if (!latestByQuestion.has(key)) {
        latestByQuestion.set(key, {
          ...item,
          mistakeKey: key,
          displayType: meta.label,
          bucket: meta.bucket,
          icon: meta.icon,
        });
      }
    });

    const visibleItems = Array.from(latestByQuestion.values())
      .filter(item => item.bucket === activeTab)
      .sort((a, b) => new Date(b.completed_at || 0) - new Date(a.completed_at || 0));

    $('#page-container').innerHTML = `
<div class="practice-page">
  <div class="page-header">
    <h1>${t('mistakes_title')}</h1>
    <p>${t('mistakes_subtitle')}</p>
  </div>
  <div class="prediction-filter-bar" style="margin-bottom:16px">
    <button class="btn ${activeTab === 'speaking' ? 'btn-primary' : 'btn-outline'}" onclick="Mistakes_setTab('speaking')">${t('mistakes_tab_speaking')}</button>
    <button class="btn ${activeTab === 'listening' ? 'btn-primary' : 'btn-outline'}" onclick="Mistakes_setTab('listening')">${t('mistakes_tab_listening')}</button>
  </div>
  ${visibleItems.length ? `<div class="practice-tasks-grid" style="grid-template-columns:1fr;gap:14px">${
      visibleItems.map(item => `
<div class="practice-task-card" style="flex-direction:column;align-items:stretch;gap:12px">
  <div style="display:flex;align-items:center;gap:10px">
    <div class="practice-task-icon">${item.icon}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <div class="practice-task-name">${item.displayType}</div>
        <div style="color:${Scorer.gradeColor(item.score)};font-size:22px;font-weight:700;flex-shrink:0;line-height:1">${item.score}</div>
      </div>
      <div style="font-size:11px;color:var(--text-light);margin-top:2px">${t('mistakes_time_label')}: ${relTime(item.completed_at)}</div>
    </div>
  </div>
  <div style="font-size:13px;color:var(--text);line-height:1.55;white-space:normal">${item.question_text || '—'}</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <button class="btn btn-primary" type="button" onclick="Mistakes_retry('${item.question_type}','${String(item.question_id).replace(/'/g, "\\'")}')">${t('mistakes_retry')}</button>
    <button class="btn btn-outline" type="button" onclick="Mistakes_master('${item.question_type}','${String(item.question_id).replace(/'/g, "\\'")}')">${t('mistakes_mark_mastered')}</button>
  </div>
</div>`).join('')
    }</div>` : `<div class="prog-empty"><div class="prog-empty-icon">📝</div><div class="prog-empty-desc">${t('mistakes_empty')}</div></div>`}
</div>`;

    window.Mistakes_setTab = function(tab) {
      window.__mistakesTab = tab === 'listening' ? 'listening' : 'speaking';
      Pages['tools-mistakes']();
    };

    window.Mistakes_master = function(questionType, questionId) {
      markMistakeMastered(questionType, questionId);
      if (window.showToast) showToast(t('mistakes_mark_mastered'));
      Pages['tools-mistakes']();
    };

    window.Mistakes_retry = function(questionType, questionId) {
      const target = resolveMistakeRetryRoute(questionType, questionId);
      setQuestionTargetPage(target.page);
      setSelectedQuestionId(target.questionId);
      navigate(target.page);
    };
  };

  $('#page-container').innerHTML = `
<div class="practice-page">
  <div class="page-header">
    <h1>${t('mistakes_title')}</h1>
    <p>${t('mistakes_subtitle')}</p>
  </div>
  <div class="prog-empty"><div class="spinner"></div><div class="prog-empty-desc" style="margin-top:12px">${t('score_generating')}</div></div>
</div>`;

  PracticeTracker.fetchAttempts(400)
    .then(renderMistakes)
    .catch(() => {
      renderMistakes([]);
    });
};

Pages['smart-practice-mistakes'] = Pages['tools-mistakes'];

// ── Theme ──────────────────────────────────────────────────────────────────
const DATA_THEMES = ['blue-light', 'deep-dark'];
const BODY_THEME_MAP = {
  'blue-light': 'pte-official',
  'deep-dark': 'dark',
};
const LEGACY_THEME_MAP = {
  light: 'blue-light',
  'pte-official': 'blue-light',
  dark: 'deep-dark',
  pink: 'blue-light',
  'black-pink': 'deep-dark',
  grey: 'blue-light',
  ocean: 'blue-light',
  forest: 'blue-light',
  lavender: 'blue-light',
};
const BODY_THEMES = ['light', 'pte-official', 'dark', 'ocean', 'grey', 'forest', 'lavender'];

function normalizeTheme(theme) {
  const key = String(theme || '').trim();
  if (DATA_THEMES.includes(key)) return key;
  return LEGACY_THEME_MAP[key] || 'blue-light';
}

function getCurrentTheme() {
  return normalizeTheme(document.documentElement.dataset.theme || localStorage.getItem('pte_theme'));
}

function getThemeToggleIcon(theme) {
  const isDark = normalizeTheme(theme) === 'deep-dark';
  return isDark
    ? `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.25" fill="none" stroke="currentColor" stroke-width="1.9"></circle><path d="M12 2.75v2.1M12 19.15v2.1M21.25 12h-2.1M4.85 12h-2.1M18.54 5.46l-1.49 1.49M6.95 17.05l-1.49 1.49M18.54 18.54l-1.49-1.49M6.95 6.95L5.46 5.46" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path></svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14.9A7.9 7.9 0 1 1 11.1 5a6.2 6.2 0 0 0 7.9 9.9Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
}

function syncThemeButtons() {
  const currentTheme = getCurrentTheme();
  const isDark = currentTheme === 'deep-dark';
  [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')]
    .forEach(btn => {
      if (!btn) return;
      btn.innerHTML = getThemeToggleIcon(currentTheme);
      const label = t(isDark ? 'theme_button_light' : 'theme_button_dark');
      btn.title = label;
      btn.setAttribute('aria-label', label);
      btn.dataset.themeTarget = isDark ? 'light' : 'dark';
    });
}

function applyTheme(theme) {
  const nextTheme = normalizeTheme(theme);
  const bodyTheme = BODY_THEME_MAP[nextTheme] || 'pte-official';
  document.documentElement.dataset.theme = nextTheme;
  document.body.classList.remove(...BODY_THEMES);
  if (bodyTheme !== 'light') document.body.classList.add(bodyTheme);
  localStorage.setItem('pte_theme', nextTheme);
  syncThemeButtons();
}

function toggleTheme() {
  applyTheme(getCurrentTheme() === 'deep-dark' ? 'blue-light' : 'deep-dark');
}

function isNativeIPad() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
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
}

function isTabletLikeDevice() {
  if (isNativeIPad()) return true;
  if (typeof window === 'undefined') return false;
  const minViewport = Math.min(window.innerWidth || 0, window.innerHeight || 0);
  const hasTouch = (navigator.maxTouchPoints || 0) > 1;
  const hasCoarsePointer = typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches;
  return minViewport >= 768 && (hasTouch || hasCoarsePointer);
}

function syncTabletSidebarButton() {
  const btn = document.getElementById('sidebar-collapse-btn');
  if (!btn) return;
  const collapsed = document.body.classList.contains('tablet-sidebar-collapsed');
  btn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  btn.setAttribute('title', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  btn.classList.toggle('is-collapsed', collapsed);
  btn.innerHTML = collapsed
    ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
}

function syncAdaptiveLayout() {
  const nativeIPad = isNativeIPad();
  const isTablet = nativeIPad || isTabletLikeDevice();
  const isHandset = !nativeIPad && !isTablet && (window.innerWidth || 0) <= 640;
  const shouldCollapse = isTablet && localStorage.getItem('pte_tablet_sidebar') === 'collapsed';
  document.body.classList.toggle('is-native-ipad', nativeIPad);
  document.body.classList.toggle('is-tablet-app', isTablet);
  document.body.classList.toggle('is-handset-app', isHandset);
  document.body.classList.toggle('is-desktop-app', !isTablet && !isHandset);
  document.body.classList.toggle('tablet-sidebar-collapsed', shouldCollapse);
  if (!isTablet) {
    document.body.classList.remove('tablet-sidebar-collapsed');
  }
  if (nativeIPad && window.Capacitor && !window.__nativeIPadDebugLogged) {
    window.__nativeIPadDebugLogged = true;
    console.log({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints,
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
      innerWidth: window.innerWidth,
      isNativeIPad: nativeIPad
    });
  }
  syncTabletSidebarButton();
}

function toggleTabletSidebar() {
  if (!isTabletLikeDevice()) return;
  const nextCollapsed = !document.body.classList.contains('tablet-sidebar-collapsed');
  document.body.classList.toggle('tablet-sidebar-collapsed', nextCollapsed);
  localStorage.setItem('pte_tablet_sidebar', nextCollapsed ? 'collapsed' : 'expanded');
  syncTabletSidebarButton();
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  if(window.MicAccess) MicAccess.syncPermissionState();

  // Apply saved theme
  const savedTheme = localStorage.getItem('pte_theme');
  const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'deep-dark' : 'blue-light');
  applyTheme(initialTheme);
  syncAdaptiveLayout();
  document.documentElement.lang = getAppLang() === 'en' ? 'en' : 'zh';
  applyStaticI18n();

  renderSidebarNav();

  if (window.AuthUI) {
    AuthUI.ensureModal();
    AuthUI.renderTriggers();
  }
  if (window.AppAuth) await AppAuth.init();
  if (window.AuthUI) AuthUI.renderTriggers();

  // Restore page from URL or session
  const routed = getPageFromPath(window.location.pathname);
  const saved = sessionStorage.getItem('pte_page') || 'home';
  navigate(routed || saved, { replace: true });

});

window.addEventListener('popstate', () => {
  const routed = getPageFromPath(window.location.pathname) || 'home';
  navigate(routed, { skipHistory: true });
});

window.addEventListener('resize', syncAdaptiveLayout);

window.requestMicPreauth = async function(redirectPage = '') {
  if (!window.MicAccess) return false;
  const ok = await MicAccess.preAuthorize();
  await MicAccess.syncPermissionState();
  if (ok) showToast('Microphone is ready for speaking practice.');
  const currentPage = redirectPage || sessionStorage.getItem('pte_page') || 'home';
  const fn = Pages[currentPage];
  if (fn) fn();
  return ok;
};

window.setPageCleanup = setPageCleanup;
window.setPageLayout = setPageLayout;
window.isGuestUser = isGuestUser;
window.getAccessibleQuestions = getAccessibleQuestions;
window.hasLockedQuestions = hasLockedQuestions;
window.renderGuestPracticeUpsell = renderGuestPracticeUpsell;
window.renderProtectedFeatureGate = renderProtectedFeatureGate;
window.openLoginPrompt = openLoginPrompt;
window.setNavGroupOpen = setNavGroupOpen;
window.isNativeIPad = isNativeIPad;
window.isTabletLikeDevice = isTabletLikeDevice;
window.toggleTabletSidebar = toggleTabletSidebar;
window.getPredictionBankRaw = getPredictionBankRaw;
window.getPredictionBankActive = getPredictionBankActive;
window.getMockSession = getMockSession;
window.isMockSessionActive = isMockSessionActive;
window.startMockSession = startMockSession;
window.clearMockSession = clearMockSession;
window.getMockQuestionSet = getMockQuestionSet;
window.getMockBlueprint = getMockBlueprint;
window.getMockCurrentProgress = getMockCurrentProgress;
window.renderMockProgressHeader = renderMockProgressHeader;
window.mountMockProgressHeader = mountMockProgressHeader;
window.bindMockDraftPersistence = bindMockDraftPersistence;
window.saveMockDraft = saveMockDraft;
window.getMockReviewItems = getMockReviewItems;
window.collectMockSectionStats = collectMockSectionStats;
window.finalizeMockSession = finalizeMockSession;
window.syncMockCurrentLocation = syncMockCurrentLocation;
window.updateMockSession = updateMockSession;
window.getQuestionSet = getQuestionSet;
window.getQuestionTargetPage = getQuestionTargetPage;
window.getInitialQuestionIndex = getInitialQuestionIndex;
window.getTodayPlanQuestions = getTodayPlanQuestions;
window.renderTodayPlanAction = renderTodayPlanAction;
window.getTodayPlanNextAction = getTodayPlanNextAction;
window.startTodayPlan = startTodayPlan;
window.TodayPlan_nextStep = goToNextTodayPlanStep;
window.TodayPlan_complete = completeTodayPlan;
window.syncSelectedQuestion = syncSelectedQuestion;
window.openQuestionList = openQuestionList;
window.backToQuestionList = backToQuestionList;
window.openQuestionFromList = openQuestionFromList;
window.openQuestionSet = openQuestionSet;
window.savePageUiState = savePageUiState;
window.getPageUiState = getPageUiState;
window.clearPageUiState = clearPageUiState;
window.setPredictionHighOnly = setPredictionHighOnly;
window.getPredictionHighOnly = getPredictionHighOnly;
window.getPredictionDescribeImageTemplate = getPredictionDescribeImageTemplate;
window.toggleTheme = toggleTheme;
