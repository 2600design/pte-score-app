const DB = {
  readAloud: [
    // ★ High-frequency real exam questions
    { id:'ra1', tag:'★ 高频真题', text:"Climate change represents one of the most significant challenges facing humanity in the twenty-first century. Rising temperatures, melting ice caps, and increasingly frequent extreme weather events are all consequences of greenhouse gas emissions produced by human activity. Scientists around the world agree that immediate action is necessary to prevent catastrophic environmental damage." },
    { id:'ra2', tag:'★ 高频真题', text:"The development of artificial intelligence has transformed numerous industries, from healthcare to transportation. Machine learning algorithms can now diagnose diseases with remarkable accuracy, optimize supply chains, and even compose music. However, questions about ethics, privacy, and the future of employment remain central to public debate." },
    { id:'ra3', tag:'★ 高频真题', text:"Renewable energy sources such as solar and wind power are playing an increasingly important role in the global energy mix. As the cost of solar panels continues to fall and battery storage technology improves, many countries are accelerating their transition away from fossil fuels toward cleaner alternatives." },
    { id:'ra4', tag:'真题', text:"The human brain remains one of the most complex structures in the known universe. Containing approximately eighty-six billion neurons, each connected to thousands of others, it processes sensory information, regulates bodily functions, and generates consciousness. Neuroscientists continue to unravel its mysteries using advanced imaging technologies." },
    { id:'ra5', tag:'真题', text:"Urbanization is one of the defining trends of the modern era. More than half of the world's population now lives in cities, a proportion expected to rise to two-thirds by two thousand and fifty. This rapid shift brings significant challenges related to housing, transportation, public health, and environmental sustainability." },
    { id:'ra6', tag:'★ 高频真题', text:"The Great Barrier Reef, located off the coast of Queensland in northeastern Australia, is the world's largest coral reef system. It stretches over two thousand three hundred kilometres and is home to an extraordinary diversity of marine life. However, rising ocean temperatures caused by climate change have led to repeated mass coral bleaching events, threatening its long-term survival." },
    { id:'ra7', tag:'★ 高频真题', text:"Vaccines work by training the immune system to recognise and combat specific pathogens. When a person receives a vaccine, their immune system responds by producing antibodies. These antibodies remain in the body, providing protection if the person is later exposed to the actual disease. Vaccination has been one of the most effective public health interventions in history." },
    { id:'ra8', tag:'预测题', text:"The global food system faces the dual challenge of feeding a growing population while reducing its environmental footprint. Agriculture accounts for roughly a quarter of global greenhouse gas emissions, consumes seventy percent of the world's fresh water, and is the leading driver of biodiversity loss. Transforming food production systems is therefore essential to achieving sustainability goals." },
    { id:'ra9', tag:'预测题', text:"Space exploration has entered a new era defined by commercial enterprise and international collaboration. Private companies are now capable of launching satellites, supplying the International Space Station, and developing vehicles for human spaceflight. Meanwhile, space agencies around the world are collaborating on missions to the Moon and Mars, opening possibilities that once seemed purely the domain of science fiction." },
    { id:'ra10', tag:'★ 高频真题', text:"Antibiotic resistance is one of the greatest threats to global health, food security, and development. Bacteria that were once easily treated have evolved mechanisms to survive antibiotic treatment. The overuse and misuse of antibiotics in humans and livestock has accelerated this process. Without effective antibiotics, even minor infections and routine surgical procedures could become life-threatening." },
    { id:'ra11', tag:'真题', text:"The Industrial Revolution, which began in Britain in the late eighteenth century, fundamentally altered the structure of economies and societies worldwide. Steam-powered machinery enabled the mass production of goods, railways transformed transportation, and factories drew millions of workers from rural areas into cities. The legacy of this transformation continues to shape the modern world." },
    { id:'ra12', tag:'预测题', text:"Meditation has been practised for thousands of years across many cultures and religious traditions. In recent decades, scientific research has begun to document its effects on the brain and body. Studies suggest that regular meditation can reduce stress and anxiety, improve concentration, lower blood pressure, and enhance overall wellbeing. It is increasingly recommended as a complementary approach in clinical settings." },
    { id:'ra13', tag:'★ 高频预测题', text:"Urban forests provide a wide range of environmental and social benefits to modern cities. Trees reduce air pollution, moderate extreme temperatures, absorb stormwater, and create habitats for birds and insects. Access to green spaces is also associated with improved mental health and stronger community wellbeing. As cities continue to expand, protecting and restoring urban tree cover has become an important planning priority." },
    { id:'ra14', tag:'预测题', text:"Digital literacy is now regarded as a fundamental skill for participation in modern society. Beyond simply using devices, it includes the ability to evaluate online information, protect personal privacy, communicate effectively in digital environments, and adapt to emerging technologies. Schools, universities, and employers increasingly recognise that digital literacy is essential for academic success, employability, and informed citizenship." },
    { id:'ra15', tag:'预测题', text:"Volcanic eruptions can influence both local environments and global climate systems. In addition to lava flows and ash clouds, major eruptions release gases and fine particles high into the atmosphere. These particles can reflect sunlight and temporarily reduce global temperatures. Studying past eruptions helps scientists understand natural climate variability and improve hazard preparedness for communities living near volcanoes." },
    { id:'ra16', tag:'新增题', text:"The rapid growth of urban populations has placed increasing pressure on public transportation systems and infrastructure." },
    { id:'ra17', tag:'新增题', text:"In many countries, higher education is considered essential for career development and long-term success." },
    { id:'ra18', tag:'新增题', text:"Scientific research plays a crucial role in addressing global challenges such as climate change and public health." },
    { id:'ra19', tag:'新增题', text:"Technological innovation continues to transform the way people communicate and access information." },
    { id:'ra20', tag:'新增题', text:"Governments are investing heavily in renewable energy to reduce dependence on fossil fuels." },
    { id:'ra21', tag:'新增题', text:"Education systems must adapt to meet the needs of a rapidly changing global economy." },
    { id:'ra22', tag:'新增题', text:"The development of artificial intelligence has raised important ethical and social questions." },
    { id:'ra23', tag:'新增题', text:"Public health campaigns aim to encourage healthier lifestyles among the population." },
    { id:'ra24', tag:'新增题', text:"Globalization has increased cultural exchange but also created economic competition." },
    { id:'ra25', tag:'新增题', text:"Environmental conservation is becoming a priority for both governments and individuals." },
    { id:'ra26', tag:'新增题', text:"The internet has made it easier for people to access knowledge and share information." },
    { id:'ra27', tag:'新增题', text:"Economic growth is influenced by a variety of social, political, and technological factors." },
    { id:'ra28', tag:'新增题', text:"Modern cities face challenges related to pollution, housing, and transportation." },
    { id:'ra29', tag:'新增题', text:"Research indicates that regular exercise can improve both physical and mental health." },
    { id:'ra30', tag:'新增题', text:"The availability of online education has expanded learning opportunities worldwide." },
    { id:'ra31', tag:'新增题', text:"Climate policies are designed to reduce carbon emissions and protect natural ecosystems." },
    { id:'ra32', tag:'新增题', text:"Digital technology has significantly changed business operations and communication methods." },
    { id:'ra33', tag:'新增题', text:"Many organizations are focusing on sustainability as part of their long-term strategy." },
    { id:'ra34', tag:'新增题', text:"Advances in medicine have increased life expectancy in many parts of the world." },
    { id:'ra35', tag:'新增题', text:"Effective leadership is essential for managing teams and achieving organizational goals." },
  ],
  repeatSentence: [
    // ★ High-frequency real & predicted sentences
    { id:'rs1', tag:'★ 高频真题', text:"The professor cancelled tomorrow's lecture due to a conference.", audio: 'audio/repeat-sentence/rs1.wav' },
    { id:'rs2', tag:'★ 高频真题', text:"Students must submit their assignments by midnight on Friday.", audio: 'audio/repeat-sentence/rs2.wav' },
    { id:'rs3', tag:'真题', text:"The library will be closed for renovations throughout the summer semester.", audio: 'audio/repeat-sentence/rs3.wav' },
    { id:'rs4', tag:'真题', text:"Please make sure you have read all required chapters before the seminar.", audio: 'audio/repeat-sentence/rs4.wav' },
    { id:'rs5', tag:'★ 高频真题', text:"The research findings will be published in the next academic journal.", audio: 'audio/repeat-sentence/rs5.wav' },
    { id:'rs6', tag:'真题', text:"You are encouraged to participate actively in group discussions.", audio: 'audio/repeat-sentence/rs6.wav' },
    { id:'rs7', tag:'★ 高频真题', text:"The university offers a range of scholarships for international students.", audio: 'audio/repeat-sentence/rs7.wav' },
    { id:'rs8', tag:'★ 高频真题', text:"Biodiversity loss is occurring at an unprecedented rate around the world.", audio: 'audio/repeat-sentence/rs8.wav' },
    { id:'rs9', tag:'预测题', text:"The exam results will be released within five working days.", audio: 'audio/repeat-sentence/rs9.wav' },
    { id:'rs10', tag:'预测题', text:"Please bring your student identification card to the examination hall.", audio: 'audio/repeat-sentence/rs10.wav' },
    { id:'rs11', tag:'★ 高频真题', text:"Global temperatures have risen by approximately one point two degrees Celsius since pre-industrial times.", audio: 'audio/repeat-sentence/rs11.wav' },
    { id:'rs12', tag:'★ 高频真题', text:"Researchers have discovered a new species of deep-sea fish near the Pacific Ocean floor.", audio: 'audio/repeat-sentence/rs12.wav' },
    { id:'rs13', tag:'预测题', text:"The committee will announce its decision after reviewing all submitted applications.", audio: 'audio/repeat-sentence/rs13.wav' },
    { id:'rs14', tag:'真题', text:"The workshop on academic writing skills is open to all enrolled students.", audio: 'audio/repeat-sentence/rs14.wav' },
    { id:'rs15', tag:'★ 高频真题', text:"Scientists believe that dark matter makes up a large proportion of the universe.", audio: 'audio/repeat-sentence/rs15.wav' },
    { id:'rs16', tag:'★ 高频预测题', text:"The museum exhibition explores how technology has influenced contemporary art.", audio: 'audio/repeat-sentence/rs16.wav' },
    { id:'rs17', tag:'预测题', text:"Please switch off all electronic devices before entering the laboratory.", audio: 'audio/repeat-sentence/rs17.wav' },
    { id:'rs18', tag:'预测题', text:"The final report should include both statistical evidence and practical recommendations.", audio: 'audio/repeat-sentence/rs18.wav' },
    { id:'rs19', tag:'★ 高频预测题', text:"Early childhood education plays a crucial role in long-term cognitive development.", audio: 'audio/repeat-sentence/rs19.wav' },
    { id:'rs20', tag:'预测题', text:"The new railway line is expected to reduce traffic congestion in the city centre.", audio: 'audio/repeat-sentence/rs20.wav' },
    { id:'rs21', tag:'新增题', text:"The meeting has been postponed due to unforeseen circumstances.", audio: 'audio/repeat-sentence/rs21.wav' },
    { id:'rs22', tag:'新增题', text:"Students are encouraged to participate in extracurricular activities.", audio: 'audio/repeat-sentence/rs22.wav' },
    { id:'rs23', tag:'新增题', text:"The research focuses on improving environmental sustainability.", audio: 'audio/repeat-sentence/rs23.wav' },
    { id:'rs24', tag:'新增题', text:"The government introduced new policies to support economic growth.", audio: 'audio/repeat-sentence/rs24.wav' },
    { id:'rs25', tag:'新增题', text:"The results were influenced by several external factors.", audio: 'audio/repeat-sentence/rs25.wav' },
    { id:'rs26', tag:'新增题', text:"The company aims to expand its operations globally.", audio: 'audio/repeat-sentence/rs26.wav' },
    { id:'rs27', tag:'新增题', text:"Effective communication is essential for teamwork and success.", audio: 'audio/repeat-sentence/rs27.wav' },
    { id:'rs28', tag:'新增题', text:"The professor provided detailed feedback on the assignment.", audio: 'audio/repeat-sentence/rs28.wav' },
    { id:'rs29', tag:'新增题', text:"Many students prefer online learning due to its flexibility.", audio: 'audio/repeat-sentence/rs29.wav' },
    { id:'rs30', tag:'新增题', text:"The experiment produced unexpected but valuable results.", audio: 'audio/repeat-sentence/rs30.wav' },
    { id:'rs31', tag:'新增题', text:"The project requires careful planning and time management.", audio: 'audio/repeat-sentence/rs31.wav' },
    { id:'rs32', tag:'新增题', text:"Advances in science have improved healthcare outcomes significantly.", audio: 'audio/repeat-sentence/rs32.wav' },
    { id:'rs33', tag:'新增题', text:"The university offers a wide range of academic programs.", audio: 'audio/repeat-sentence/rs33.wav' },
    { id:'rs34', tag:'新增题', text:"The data suggests a steady increase in population growth.", audio: 'audio/repeat-sentence/rs34.wav' },
    { id:'rs35', tag:'新增题', text:"The committee will review the proposal next week.", audio: 'audio/repeat-sentence/rs35.wav' },
    { id:'rs36', tag:'新增题', text:"Environmental protection is a global responsibility.", audio: 'audio/repeat-sentence/rs36.wav' },
    { id:'rs37', tag:'新增题', text:"The lecture covered several important theoretical concepts.", audio: 'audio/repeat-sentence/rs37.wav' },
    { id:'rs38', tag:'新增题', text:"The organization is committed to reducing carbon emissions.", audio: 'audio/repeat-sentence/rs38.wav' },
    { id:'rs39', tag:'新增题', text:"The policy aims to improve public transportation systems.", audio: 'audio/repeat-sentence/rs39.wav' },
    { id:'rs40', tag:'新增题', text:"Technology has transformed modern communication methods.", audio: 'audio/repeat-sentence/rs40.wav' },
    { id:'rs41', tag:'新增题', text:"The study examines the impact of education on employment.", audio: 'audio/repeat-sentence/rs41.wav' },
    { id:'rs42', tag:'新增题', text:"Students must submit their work before the deadline.", audio: 'audio/repeat-sentence/rs42.wav' },
    { id:'rs43', tag:'新增题', text:"The research findings were published in a scientific journal.", audio: 'audio/repeat-sentence/rs43.wav' },
    { id:'rs44', tag:'新增题', text:"The company reported a significant increase in revenue.", audio: 'audio/repeat-sentence/rs44.wav' },
    { id:'rs45', tag:'新增题', text:"The program is designed to enhance professional skills.", audio: 'audio/repeat-sentence/rs45.wav' },
    { id:'rs46', tag:'新增题', text:"The government supports innovation in various industries.", audio: 'audio/repeat-sentence/rs46.wav' },
    { id:'rs47', tag:'新增题', text:"The conference will discuss global economic trends.", audio: 'audio/repeat-sentence/rs47.wav' },
    { id:'rs48', tag:'新增题', text:"The project was completed ahead of schedule.", audio: 'audio/repeat-sentence/rs48.wav' },
    { id:'rs49', tag:'新增题', text:"The system is designed to improve efficiency and productivity.", audio: 'audio/repeat-sentence/rs49.wav' },
    { id:'rs50', tag:'新增题', text:"The results indicate a positive trend in development.", audio: 'audio/repeat-sentence/rs50.wav' },
    { id:'RS-001', tag:'新增题', text:"The lecture will begin shortly after a brief introduction.", audio: null },
    { id:'RS-002', tag:'新增题', text:"Students are required to submit their assignments before the deadline.", audio: null },
    { id:'RS-003', tag:'新增题', text:"The results of the experiment were unexpectedly accurate.", audio: null },
    { id:'RS-004', tag:'新增题', text:"She recommended reviewing the material thoroughly.", audio: null },
    { id:'RS-005', tag:'新增题', text:"The company plans to expand its operations internationally.", audio: null },
    { id:'RS-006', tag:'新增题', text:"Attendance is mandatory for all registered participants.", audio: null },
    { id:'RS-007', tag:'新增题', text:"The professor emphasized the importance of critical thinking.", audio: null },
    { id:'RS-008', tag:'新增题', text:"We need to consider alternative solutions to this issue.", audio: null },
    { id:'RS-009', tag:'新增题', text:"The meeting has been postponed until next week.", audio: null },
    { id:'RS-010', tag:'新增题', text:"Environmental policies are essential for long-term sustainability.", audio: null },
    { id:'RS-011', tag:'新增题', text:"The research findings were published in a leading journal.", audio: null },
    { id:'RS-012', tag:'新增题', text:"Students should take advantage of available academic resources.", audio: null },
    { id:'RS-013', tag:'新增题', text:"The project requires collaboration between multiple departments.", audio: null },
    { id:'RS-014', tag:'新增题', text:"Economic growth depends on innovation and investment.", audio: null },
    { id:'RS-015', tag:'新增题', text:"The university offers a wide range of degree programs.", audio: null },
    { id:'RS-016', tag:'新增题', text:"Please ensure all documents are submitted on time.", audio: null },
    { id:'RS-017', tag:'新增题', text:"The speaker addressed several important global issues.", audio: null },
    { id:'RS-018', tag:'新增题', text:"Technology continues to influence modern education systems.", audio: null },
    { id:'RS-019', tag:'新增题', text:"The data must be analyzed carefully before drawing conclusions.", audio: null },
    { id:'RS-020', tag:'新增题', text:"The policy aims to reduce environmental impact.", audio: null },
    { id:'RS-021', tag:'新增题', text:"The results indicate a significant improvement in performance.", audio: null },
    { id:'RS-022', tag:'新增题', text:"Students are encouraged to participate in group discussions.", audio: null },
    { id:'RS-023', tag:'新增题', text:"The conference will be held at the main campus auditorium.", audio: null },
    { id:'RS-024', tag:'新增题', text:"This method provides a more efficient solution.", audio: null },
    { id:'RS-025', tag:'新增题', text:"The research focuses on sustainable development strategies.", audio: null },
    { id:'RS-026', tag:'新增题', text:"The system needs to be updated regularly.", audio: null },
    { id:'RS-027', tag:'新增题', text:"The assignment should be completed individually.", audio: null },
    { id:'RS-028', tag:'新增题', text:"The course requires active participation from all students.", audio: null },
    { id:'RS-029', tag:'新增题', text:"The results were influenced by external factors.", audio: null },
    { id:'RS-030', tag:'新增题', text:"The company has adopted new management strategies.", audio: null },
    { id:'RS-031', tag:'新增题', text:"The lecture covered several key concepts in detail.", audio: null },
    { id:'RS-032', tag:'新增题', text:"Students must follow the academic integrity guidelines.", audio: null },
    { id:'RS-033', tag:'新增题', text:"The findings contribute to further research in this field.", audio: null },
    { id:'RS-034', tag:'新增题', text:"The study examines the effects of climate change.", audio: null },
    { id:'RS-035', tag:'新增题', text:"The report highlights the importance of teamwork.", audio: null },
    { id:'RS-036', tag:'新增题', text:"The experiment was conducted under controlled conditions.", audio: null },
    { id:'RS-037', tag:'新增题', text:"The university encourages international collaboration.", audio: null },
    { id:'RS-038', tag:'新增题', text:"The results support the initial hypothesis.", audio: null },
    { id:'RS-039', tag:'新增题', text:"The policy was implemented last year.", audio: null },
    { id:'RS-040', tag:'新增题', text:"Students should review the material before class.", audio: null },
    { id:'RS-041', tag:'新增题', text:"The research was funded by a government grant.", audio: null },
    { id:'RS-042', tag:'新增题', text:"The lecture provided valuable insights into the topic.", audio: null },
    { id:'RS-043', tag:'新增题', text:"The company aims to improve customer satisfaction.", audio: null },
    { id:'RS-044', tag:'新增题', text:"The data suggests a positive trend.", audio: null },
    { id:'RS-045', tag:'新增题', text:"The professor will explain the concept in the next session.", audio: null },
    { id:'RS-046', tag:'新增题', text:"The system is designed to improve efficiency.", audio: null },
    { id:'RS-047', tag:'新增题', text:"The report was submitted to the management team.", audio: null },
    { id:'RS-048', tag:'新增题', text:"The study highlights the importance of education.", audio: null },
    { id:'RS-049', tag:'新增题', text:"The results were consistent across all groups.", audio: null },
    { id:'RS-050', tag:'新增题', text:"The policy addresses key environmental concerns.", audio: null },
    { id:'RS-051', tag:'新增题', text:"The experiment yielded promising results.", audio: null },
    { id:'RS-052', tag:'新增题', text:"The lecture emphasized practical applications.", audio: null },
    { id:'RS-053', tag:'新增题', text:"The company is exploring new markets.", audio: null },
    { id:'RS-054', tag:'新增题', text:"The students completed the assignment successfully.", audio: null },
    { id:'RS-055', tag:'新增题', text:"The data was collected over several months.", audio: null },
    { id:'RS-056', tag:'新增题', text:"The research provides new insights into the issue.", audio: null },
    { id:'RS-057', tag:'新增题', text:"The policy aims to promote sustainability.", audio: null },
    { id:'RS-058', tag:'新增题', text:"The system requires regular maintenance.", audio: null },
    { id:'RS-059', tag:'新增题', text:"The lecture covered theoretical concepts.", audio: null },
    { id:'RS-060', tag:'新增题', text:"The results indicate a clear improvement.", audio: null },
    { id:'RS-061', tag:'新增题', text:"The company plans to increase production.", audio: null },
    { id:'RS-062', tag:'新增题', text:"The students attended the workshop.", audio: null },
    { id:'RS-063', tag:'新增题', text:"The research was conducted by a team of experts.", audio: null },
    { id:'RS-064', tag:'新增题', text:"The lecture included several examples.", audio: null },
    { id:'RS-065', tag:'新增题', text:"The system helps improve productivity.", audio: null },
    { id:'RS-066', tag:'新增题', text:"The report outlines key recommendations.", audio: null },
    { id:'RS-067', tag:'新增题', text:"The policy supports long-term growth.", audio: null },
    { id:'RS-068', tag:'新增题', text:"The results were analyzed statistically.", audio: null },
    { id:'RS-069', tag:'新增题', text:"The company focuses on innovation.", audio: null },
    { id:'RS-070', tag:'新增题', text:"The lecture concluded with a summary of key points.", audio: null },
  ],
  describeImage: [
    { id:'di1', title:"Bar Chart – Global Renewable Energy", imageUrl: null, imageSvg: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px">
  <rect width="320" height="200" fill="#f8fafc"/>
  <text x="160" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#374151">Global Renewable Energy Share (%)</text>
  <line x1="40" y1="170" x2="300" y2="170" stroke="#d1d5db" stroke-width="1"/>
  <line x1="40" y1="130" x2="300" y2="130" stroke="#f3f4f6" stroke-width="1"/>
  <line x1="40" y1="90" x2="300" y2="90" stroke="#f3f4f6" stroke-width="1"/>
  <line x1="40" y1="50" x2="300" y2="50" stroke="#f3f4f6" stroke-width="1"/>
  <text x="35" y="173" text-anchor="end" font-size="9" fill="#6b7280">0</text>
  <text x="35" y="133" text-anchor="end" font-size="9" fill="#6b7280">20</text>
  <text x="35" y="93" text-anchor="end" font-size="9" fill="#6b7280">40</text>
  <text x="35" y="53" text-anchor="end" font-size="9" fill="#6b7280">60</text>
  <rect x="55" y="130" width="30" height="40" fill="#3b5bfc" rx="2"/>
  <rect x="110" y="110" width="30" height="60" fill="#3b5bfc" rx="2"/>
  <rect x="165" y="90" width="30" height="80" fill="#3b5bfc" rx="2"/>
  <rect x="220" y="65" width="30" height="105" fill="#3b5bfc" rx="2"/>
  <rect x="255" y="50" width="30" height="120" fill="#6366f1" rx="2"/>
  <text x="70" y="185" text-anchor="middle" font-size="9" fill="#6b7280">2000</text>
  <text x="125" y="185" text-anchor="middle" font-size="9" fill="#6b7280">2005</text>
  <text x="180" y="185" text-anchor="middle" font-size="9" fill="#6b7280">2010</text>
  <text x="235" y="185" text-anchor="middle" font-size="9" fill="#6b7280">2015</text>
  <text x="270" y="185" text-anchor="middle" font-size="9" fill="#6b7280">2020</text>
</svg>`, hint: "Describe the trend, key values, and what the chart shows overall." },
    { id:'di2', title:"Pie Chart – Energy Sources", imageUrl: null, imageSvg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:380px">
  <rect width="300" height="200" fill="#f8fafc"/>
  <text x="150" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="#374151">Global Energy Sources 2023</text>
  <circle cx="105" cy="105" r="70" fill="#f3f4f6"/>
  <path d="M105,105 L105,35 A70,70 0 0,1 175,105 Z" fill="#3b5bfc"/>
  <path d="M105,105 L175,105 A70,70 0 0,1 68,168 Z" fill="#6366f1"/>
  <path d="M105,105 L68,168 A70,70 0 0,1 40,60 Z" fill="#22c55e"/>
  <path d="M105,105 L40,60 A70,70 0 0,1 105,35 Z" fill="#f59e0b"/>
  <rect x="200" y="40" width="12" height="12" fill="#3b5bfc" rx="2"/>
  <text x="216" y="51" font-size="10" fill="#374151">Coal 29%</text>
  <rect x="200" y="60" width="12" height="12" fill="#6366f1" rx="2"/>
  <text x="216" y="71" font-size="10" fill="#374151">Oil 31%</text>
  <rect x="200" y="80" width="12" height="12" fill="#22c55e" rx="2"/>
  <text x="216" y="91" font-size="10" fill="#374151">Gas 23%</text>
  <rect x="200" y="100" width="12" height="12" fill="#f59e0b" rx="2"/>
  <text x="216" y="111" font-size="10" fill="#374151">Renew 17%</text>
</svg>`, hint: "Describe the largest and smallest segments and overall distribution." },
    { id:'di3', title:"Line Graph – CO₂ Emissions", imageUrl: null, imageSvg: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px">
  <rect width="320" height="200" fill="#f8fafc"/>
  <text x="160" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="#374151">CO₂ Emissions (GtCO₂) 1990–2020</text>
  <line x1="40" y1="170" x2="300" y2="170" stroke="#d1d5db"/>
  <line x1="40" y1="30" x2="40" y2="170" stroke="#d1d5db"/>
  <polyline points="40,140 90,130 140,115 190,100 240,90 290,80" fill="none" stroke="#3b5bfc" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="40" cy="140" r="4" fill="#3b5bfc"/>
  <circle cx="90" cy="130" r="4" fill="#3b5bfc"/>
  <circle cx="140" cy="115" r="4" fill="#3b5bfc"/>
  <circle cx="190" cy="100" r="4" fill="#3b5bfc"/>
  <circle cx="240" cy="90" r="4" fill="#3b5bfc"/>
  <circle cx="290" cy="80" r="4" fill="#3b5bfc"/>
  <text x="37" y="185" font-size="9" fill="#6b7280">1990</text>
  <text x="87" y="185" font-size="9" fill="#6b7280">1995</text>
  <text x="137" y="185" font-size="9" fill="#6b7280">2000</text>
  <text x="187" y="185" font-size="9" fill="#6b7280">2005</text>
  <text x="237" y="185" font-size="9" fill="#6b7280">2010</text>
  <text x="287" y="185" font-size="9" fill="#6b7280">2020</text>
</svg>`, hint: "Note the overall trend, any turning points, and future implications." },
    { id:'di4', title:"Process Diagram – Recycling Cycle", imageUrl: null, imageSvg: `<svg viewBox="0 0 340 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <rect width="340" height="210" fill="#f8fafc"/>
  <text x="170" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#374151">Household Recycling Process</text>
  <rect x="25" y="55" width="70" height="38" rx="8" fill="#fdf2f8" stroke="#ec4899"/>
  <text x="60" y="78" text-anchor="middle" font-size="10" fill="#374151">Collection</text>
  <rect x="135" y="55" width="70" height="38" rx="8" fill="#fdf2f8" stroke="#ec4899"/>
  <text x="170" y="78" text-anchor="middle" font-size="10" fill="#374151">Sorting</text>
  <rect x="245" y="55" width="70" height="38" rx="8" fill="#fdf2f8" stroke="#ec4899"/>
  <text x="280" y="78" text-anchor="middle" font-size="10" fill="#374151">Processing</text>
  <rect x="135" y="135" width="70" height="38" rx="8" fill="#fdf2f8" stroke="#ec4899"/>
  <text x="170" y="158" text-anchor="middle" font-size="10" fill="#374151">New Products</text>
  <path d="M95 74 H135" stroke="#ec4899" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M205 74 H245" stroke="#ec4899" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M280 93 V120 H205" stroke="#ec4899" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M135 154 H60 V95" stroke="#ec4899" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#ec4899"/></marker></defs>
</svg>`, hint: "Describe each stage in order and explain the overall cycle." },
    { id:'di5', title:"Table – Student Transport Modes", imageUrl: null, imageSvg: `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px">
  <rect width="320" height="210" fill="#f8fafc"/>
  <text x="160" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#374151">How Students Travel to Campus</text>
  <rect x="30" y="40" width="260" height="140" fill="#fff" stroke="#d1d5db"/>
  <line x1="30" y1="70" x2="290" y2="70" stroke="#d1d5db"/>
  <line x1="150" y1="40" x2="150" y2="180" stroke="#d1d5db"/>
  <text x="90" y="60" text-anchor="middle" font-size="10" font-weight="bold" fill="#374151">Mode</text>
  <text x="220" y="60" text-anchor="middle" font-size="10" font-weight="bold" fill="#374151">Percentage</text>
  <text x="90" y="95" text-anchor="middle" font-size="10" fill="#374151">Bus</text>
  <text x="220" y="95" text-anchor="middle" font-size="10" fill="#374151">34%</text>
  <text x="90" y="120" text-anchor="middle" font-size="10" fill="#374151">Car</text>
  <text x="220" y="120" text-anchor="middle" font-size="10" fill="#374151">28%</text>
  <text x="90" y="145" text-anchor="middle" font-size="10" fill="#374151">Train</text>
  <text x="220" y="145" text-anchor="middle" font-size="10" fill="#374151">22%</text>
  <text x="90" y="170" text-anchor="middle" font-size="10" fill="#374151">Cycling / Walk</text>
  <text x="220" y="170" text-anchor="middle" font-size="10" fill="#374151">16%</text>
</svg>`, hint: "Compare the categories and mention the most and least common choices." },
  ],
  retellLecture: [
    { id:'rl1', tag:'★ 高频真题', title:"The Water Cycle", transcript:"Water is continuously cycled through the environment in a process driven by solar energy. Evaporation from oceans and lakes transforms liquid water into vapor, which rises into the atmosphere. As it cools, condensation forms clouds. Eventually, precipitation returns water to the surface as rain or snow. This cycle regulates global temperatures, distributes fresh water, and sustains all life on Earth.", duration: 45 },
    { id:'rl2', tag:'★ 高频真题', title:"The Industrial Revolution", transcript:"The Industrial Revolution, which began in Britain in the late eighteenth century, transformed the way goods were produced. Steam-powered machines replaced manual labour in factories, dramatically increasing output. New transportation networks, including railways and canals, enabled mass distribution. However, urbanization also led to poor living conditions for many factory workers, sparking early labour movements.", duration: 50 },
    { id:'rl3', tag:'真题', title:"Neuroplasticity", transcript:"Neuroplasticity refers to the brain's remarkable ability to reorganise itself by forming new neural connections throughout life. This capacity allows the brain to compensate for injury or disease and to adjust in response to new situations or changes in the environment. Research has shown that activities such as learning a new language, playing a musical instrument, or regular physical exercise can promote neuroplasticity and help maintain cognitive function into old age.", duration: 55 },
    { id:'rl4', tag:'预测题', title:"Coral Reef Ecosystems", transcript:"Coral reefs are among the most biologically diverse ecosystems on Earth, covering less than one percent of the ocean floor but supporting approximately twenty-five percent of all marine species. They provide vital services including coastal protection, food security, and income from tourism and fisheries for hundreds of millions of people. However, climate change, ocean acidification, and human activities such as overfishing and pollution are rapidly degrading reef systems worldwide.", duration: 58 },
    { id:'rl5', tag:'预测题', title:"Behavioural Economics", transcript:"Behavioural economics combines insights from psychology and economics to understand how people actually make decisions, as opposed to how traditional economic theory assumes they should. Research in this field has shown that people are subject to cognitive biases — systematic errors in thinking — that lead to choices that may not serve their best interests. These findings have influenced policy design, with governments using nudges to encourage healthier and more financially sound behaviour.", duration: 52 },
    { id:'rl6', tag:'★ 高频预测题', title:"Renewable Energy Storage", transcript:"Renewable energy sources such as solar and wind are intermittent, meaning they do not produce electricity at all times. Energy storage technologies address this problem by capturing excess electricity when production is high and releasing it when demand rises. Batteries are the most widely discussed option, but pumped hydro, thermal storage, and hydrogen systems are also gaining attention. Improving storage capacity is essential if countries are to build reliable low-carbon power systems.", duration: 54 },
    { id:'rl7', tag:'预测题', title:"Language and Identity", transcript:"Language is more than a tool for communication; it is also a marker of identity, culture, and belonging. When minority languages disappear, communities lose not only vocabulary and grammar, but also stories, traditions, and unique ways of understanding the world. Linguists estimate that nearly half of the world's languages may disappear within this century unless active preservation efforts are made. Education policy, media representation, and community-led programs all play important roles in language maintenance.", duration: 57 },
  ],
  answerShort: [
    { id:'asq1', tag:'★ 高频真题', question:"What is the largest planet in our solar system?", answer:"Jupiter" },
    { id:'asq2', tag:'★ 高频真题', question:"What gas do plants absorb from the atmosphere?", answer:"Carbon dioxide" },
    { id:'asq3', tag:'真题', question:"How many sides does a hexagon have?", answer:"Six" },
    { id:'asq4', tag:'★ 高频真题', question:"What is the capital city of Australia?", answer:"Canberra" },
    { id:'asq5', tag:'真题', question:"What instrument is used to measure temperature?", answer:"Thermometer" },
    { id:'asq6', tag:'真题', question:"What is the chemical symbol for gold?", answer:"Au" },
    { id:'asq7', tag:'★ 高频真题', question:"Which ocean is the largest?", answer:"Pacific Ocean" },
    { id:'asq8', tag:'真题', question:"What do we call the study of living organisms?", answer:"Biology" },
    { id:'asq9', tag:'★ 高频真题', question:"What is the name of the process by which plants make food using sunlight?", answer:"Photosynthesis" },
    { id:'asq10', tag:'★ 高频真题', question:"How many chambers does the human heart have?", answer:"Four" },
    { id:'asq11', tag:'真题', question:"What do we call a scientist who studies earthquakes?", answer:"Seismologist" },
    { id:'asq12', tag:'★ 高频真题', question:"What is the boiling point of water in degrees Celsius?", answer:"One hundred degrees" },
    { id:'asq13', tag:'预测题', question:"What is the term for an economy where goods are shared rather than owned outright?", answer:"Sharing economy" },
    { id:'asq14', tag:'★ 高频真题', question:"Which gas makes up the majority of the Earth's atmosphere?", answer:"Nitrogen" },
    { id:'asq15', tag:'预测题', question:"What do we call the study of the universe and its contents?", answer:"Astronomy" },
    { id:'asq16', tag:'真题', question:"What type of energy does the sun provide?", answer:"Solar energy" },
    { id:'asq17', tag:'★ 高频真题', question:"What is the most widely spoken language in the world by number of native speakers?", answer:"Mandarin Chinese" },
    { id:'asq18', tag:'预测题', question:"What is the name of the layer of gas surrounding the Earth?", answer:"Atmosphere" },
    { id:'asq19', tag:'★ 高频预测题', question:"What is the device called that measures atmospheric pressure?", answer:"Barometer" },
    { id:'asq20', tag:'预测题', question:"Which part of the plant conducts photosynthesis most actively?", answer:"Leaf" },
    { id:'asq21', tag:'预测题', question:"What do we call water in its gas form?", answer:"Water vapor" },
    { id:'asq22', tag:'★ 高频预测题', question:"What branch of science studies weather and climate?", answer:"Meteorology" },
    { id:'asq23', tag:'预测题', question:"What is the opposite of import in international trade?", answer:"Export" },
    { id:'asq24', tag:'预测题', question:"What is the hardest natural substance on Earth?", answer:"Diamond" },
    { id:'asq25', tag:'新增题', question:"What do we call a place where books are kept?", answer:"Library" },
    { id:'asq26', tag:'新增题', question:"What is the process of water turning into vapor?", answer:"Evaporation" },
    { id:'asq27', tag:'新增题', question:"What do bees produce?", answer:"Honey" },
    { id:'asq28', tag:'新增题', question:"Which planet is known as the Red Planet?", answer:"Mars" },
    { id:'asq29', tag:'新增题', question:"What do we use to measure temperature?", answer:"Thermometer" },
    { id:'asq30', tag:'新增题', question:"What is the capital of France?", answer:"Paris" },
    { id:'asq31', tag:'新增题', question:"What do we call a person who teaches at university?", answer:"Professor" },
    { id:'asq32', tag:'新增题', question:"What is H2O commonly known as?", answer:"Water" },
    { id:'asq33', tag:'新增题', question:"Which organ pumps blood?", answer:"Heart" },
    { id:'asq34', tag:'新增题', question:"What do we call written laws of a country?", answer:"Constitution" },
    { id:'asq35', tag:'新增题', question:"What is the opposite of increase?", answer:"Decrease" },
    { id:'asq36', tag:'新增题', question:"What do we call animals that eat only plants?", answer:"Herbivores" },
    { id:'asq37', tag:'新增题', question:"What do you use to cut paper?", answer:"Scissors" },
    { id:'asq38', tag:'新增题', question:"What is the largest ocean?", answer:"Pacific Ocean" },
    { id:'asq39', tag:'新增题', question:"What do we call a baby dog?", answer:"Puppy" },
    { id:'asq40', tag:'新增题', question:"What is used to write on a blackboard?", answer:"Chalk" },
    { id:'asq41', tag:'新增题', question:"What do we call a scientist who studies weather?", answer:"Meteorologist" },
    { id:'asq42', tag:'新增题', question:"What is the freezing point of water?", answer:"Zero degrees" },
    { id:'asq43', tag:'新增题', question:"What do we call a person who designs buildings?", answer:"Architect" },
    { id:'asq44', tag:'新增题', question:"What is the currency of the United States?", answer:"Dollar" },
    { id:'asq45', tag:'新增题', question:"What do we call a person who drives a bus?", answer:"Driver" },
    { id:'asq46', tag:'新增题', question:"What is the opposite of fast?", answer:"Slow" },
    { id:'asq47', tag:'新增题', question:"What do we call a group of stars forming a pattern?", answer:"Constellation" },
    { id:'asq48', tag:'新增题', question:"What is used to measure time?", answer:"Clock" },
    { id:'asq49', tag:'新增题', question:"What do we call a person who writes books?", answer:"Author" },
    { id:'asq50', tag:'新增题', question:"What is the main gas in the air we breathe?", answer:"Nitrogen" },
    { id:'asq51', tag:'新增题', question:"What do we call a person who flies an airplane?", answer:"Pilot" },
    { id:'asq52', tag:'新增题', question:"What is the boiling point of water?", answer:"100 degrees" },
    { id:'asq53', tag:'新增题', question:"What do we call a place where people watch movies?", answer:"Cinema" },
    { id:'asq54', tag:'新增题', question:"What is the hardest natural substance?", answer:"Diamond" },
    { id:'asq55', tag:'新增题', question:"What do we call a person who studies history?", answer:"Historian" },
    { id:'asq56', tag:'新增题', question:"What is used to open a lock?", answer:"Key" },
    { id:'asq57', tag:'新增题', question:"What do we call a baby cat?", answer:"Kitten" },
    { id:'asq58', tag:'新增题', question:"What is the opposite of hot?", answer:"Cold" },
    { id:'asq59', tag:'新增题', question:"What do we call a place where planes land?", answer:"Airport" },
    { id:'asq60', tag:'新增题', question:"What is the largest land animal?", answer:"Elephant" },
    { id:'asq61', tag:'新增题', question:"What do we call a person who paints?", answer:"Painter" },
    { id:'asq62', tag:'新增题', question:"What is used to measure weight?", answer:"Scale" },
    { id:'asq63', tag:'新增题', question:"What do we call a person who fixes cars?", answer:"Mechanic" },
    { id:'asq64', tag:'新增题', question:"What is the center of the solar system?", answer:"Sun" },
  ],
  summarizeWritten: [
    { id:'swt1', tag:'★ 高频真题', title:"Biodiversity Loss", text:"Biodiversity — the variety of life on Earth — is declining at an unprecedented rate. Human activities such as deforestation, pollution, overfishing, and climate change are driving species to extinction far faster than natural processes would. Scientists estimate that species are disappearing at up to one thousand times the background extinction rate. The consequences extend beyond the natural world: healthy ecosystems provide clean water, regulate climate, pollinate crops, and support countless industries. Conservation efforts, including protected areas, habitat restoration, and international agreements such as the Convention on Biological Diversity, aim to slow this decline, but experts agree that transformative changes in how we produce food and energy are essential.", wordRange:[25,50] },
    { id:'swt2', tag:'★ 高频真题', title:"Digital Privacy", text:"In the digital age, personal data has become one of the most valuable commodities in the global economy. Every online interaction generates data points that companies harvest, analyse, and monetise. Social media platforms, search engines, and mobile applications continuously track user behaviour, preferences, and location. While users often receive free services in exchange, many are unaware of the extent to which their information is collected and sold. Regulators in Europe have responded with legislation such as the General Data Protection Regulation, which grants citizens greater control over their data. However, enforcement remains inconsistent, and technology often evolves faster than the laws designed to govern it.", wordRange:[25,50] },
    { id:'swt3', tag:'真题', title:"Microplastics in the Ocean", text:"Microplastics — plastic fragments smaller than five millimetres — have been detected throughout the world's oceans, from surface waters to deep-sea sediments. They originate from the breakdown of larger plastic items and from manufactured microbeads used in personal care products. Marine organisms from plankton to whales ingest these particles, which can accumulate toxins and enter the food chain. Human consumption of seafood means that microplastics are now regularly detected in human tissue. While awareness has grown, reducing plastic production and improving waste management remain formidable global challenges.", wordRange:[25,50] },
    { id:'swt4', tag:'预测题', title:"The Rise of Remote Work", text:"The COVID-19 pandemic accelerated an existing trend toward remote working, with millions of employees worldwide shifting to home-based arrangements almost overnight. For many workers and employers, this experience revealed previously untapped productivity gains and cost savings. However, remote work also highlighted issues such as digital inequality, the erosion of work-life boundaries, and reduced opportunities for collaboration and mentorship. As organisations consider permanent hybrid arrangements, they must weigh these competing factors to design work environments that support both performance and employee wellbeing.", wordRange:[25,50] },
    { id:'swt5', tag:'★ 高频真题', title:"Artificial Intelligence in Healthcare", text:"Artificial intelligence is transforming healthcare by enabling faster and more accurate diagnosis, personalised treatment plans, and more efficient management of clinical data. Machine learning algorithms trained on large medical datasets can detect cancers, diabetic retinopathy, and other conditions with accuracy comparable to or exceeding that of experienced clinicians. AI-powered tools also assist in drug discovery, reducing the time and cost of bringing new treatments to market. Nevertheless, concerns remain about data privacy, algorithmic bias, and the potential displacement of healthcare workers.", wordRange:[25,50] },
    { id:'swt6', tag:'★ 高频预测题', title:"Urban Public Transport", text:"Efficient public transport systems are central to reducing traffic congestion, improving air quality, and increasing access to employment and education. Cities with reliable buses, trains, and cycling infrastructure tend to experience lower car dependency and more inclusive economic growth. However, building and maintaining such systems requires substantial investment, long-term planning, and public trust. Transport experts argue that integrated networks and affordable fares are essential to attracting sustained ridership.", wordRange:[25,50] },
    { id:'swt7', tag:'预测题', title:"Online Misinformation", text:"The rapid spread of misinformation online has emerged as a major challenge for democratic societies. False or misleading content can travel faster than verified information, particularly when amplified by social media algorithms designed to maximise engagement. During elections, public health emergencies, and natural disasters, misinformation can undermine trust in institutions and influence harmful behaviour. Researchers argue that improving media literacy, increasing transparency in digital platforms, and strengthening independent journalism are all necessary to address this problem.", wordRange:[25,50] },
  ],
  writeEssay: [
    { id:'we1', tag:'★ 高频真题', prompt:"Some people believe that universities should focus purely on academic subjects, while others argue that they should also prepare students for employment. Discuss both views and give your own opinion.", wordRange:[200,300] },
    { id:'we2', tag:'★ 高频真题', prompt:"Technology has made it easier for people to work from home. What are the advantages and disadvantages of remote working? Use specific examples to support your answer.", wordRange:[200,300] },
    { id:'we3', tag:'真题', prompt:"Some governments are considering imposing a tax on sugar-sweetened beverages to combat obesity. Do the benefits of such a policy outweigh the disadvantages?", wordRange:[200,300] },
    { id:'we4', tag:'★ 高频真题', prompt:"In many countries, the gap between the rich and the poor is widening. What do you think are the causes of this problem, and what measures could be taken to address it?", wordRange:[200,300] },
    { id:'we5', tag:'预测题', prompt:"Artificial intelligence will soon replace human workers in most industries. To what extent do you agree or disagree with this statement?", wordRange:[200,300] },
    { id:'we6', tag:'预测题', prompt:"Some people argue that protecting the environment should be the top priority for governments, even if it means limiting economic growth. Do you agree or disagree?", wordRange:[200,300] },
    { id:'we7', tag:'★ 高频预测题', prompt:"Many people believe that children should learn financial skills such as budgeting and saving at school. Do you agree or disagree? Give reasons and examples.", wordRange:[200,300] },
    { id:'we8', tag:'预测题', prompt:"Some people think that international travel broadens the mind, while others believe people can learn enough about the world through books and media. Discuss both views and give your opinion.", wordRange:[200,300] },
    { id:'we9', tag:'预测题', prompt:"Large cities should invest more in public parks and open spaces than in new commercial developments. To what extent do you agree or disagree?", wordRange:[200,300] },
  ],
  rwFillBlanks: [
    { id:'rwfib1', title:"Ocean Plastic Pollution",
      parts:["Plastic pollution in the world's oceans has reached crisis ", "proportions. Every year, millions of tonnes of plastic ", "enter marine environments, ", "wildlife and contaminating the food chain. Scientists have identified vast ", "garbage patches in the Pacific Ocean, where currents concentrate floating debris. "],
      blanks:[
        {options:["alarming","joyful","helpful","minor"], answer:"alarming"},
        {options:["waste","gifts","water","air"], answer:"waste"},
        {options:["harming","helping","saving","ignoring"], answer:"harming"},
        {options:["floating","sinking","burning","freezing"], answer:"floating"},
      ]
    },
    { id:'rwfib2', title:"Renewable Cities",
      parts:["Many city governments are investing in cleaner transport systems to reduce air ", "and traffic congestion. Electric buses, bicycle lanes, and pedestrian-friendly streets can improve public health while making urban areas more ", ". However, these changes require careful planning, public support, and significant financial ", "."],
      blanks:[
        {options:["pollution","celebration","sunshine","tourism"], answer:"pollution"},
        {options:["livable","dangerous","isolated","silent"], answer:"livable"},
        {options:["investment","confusion","failure","dust"], answer:"investment"},
      ]
    },
    { id:'rwfib3', title:"Clean Energy Demand",
      parts:["The increasing demand for energy has led to a rise in ", " sources such as solar power."],
      blanks:[
        {options:["renewable","temporary","limited","artificial"], answer:"renewable"},
      ]
    },
    { id:'rwfib4', title:"Innovation and Growth",
      parts:["Economic development is closely linked to ", " innovation."],
      blanks:[
        {options:["scientific","social","cultural","random"], answer:"scientific"},
      ]
    },
    { id:'rwfib5', title:"Education and Work",
      parts:["Education plays a significant role in ", " opportunities."],
      blanks:[
        {options:["career","travel","leisure","routine"], answer:"career"},
      ]
    },
    { id:'rwfib6', title:"Environmental Policy",
      parts:["The government aims to ", " environmental protection."],
      blanks:[
        {options:["promote","reduce","ignore","delay"], answer:"promote"},
      ]
    },
    { id:'rwfib7', title:"Productivity Gains",
      parts:["Technological advances have improved ", " efficiency."],
      blanks:[
        {options:["overall","random","unusual","partial"], answer:"overall"},
      ]
    },
    { id:'rwfib8', title:"Long-Term Trends",
      parts:["The study focuses on ", " change over time."],
      blanks:[
        {options:["gradual","sudden","immediate","random"], answer:"gradual"},
      ]
    },
    { id:'rwfib9', title:"Transport Reform",
      parts:["The policy aims to ", " public transportation."],
      blanks:[
        {options:["improve","remove","reduce","delay"], answer:"improve"},
      ]
    },
    { id:'rwfib10', title:"Research Quality",
      parts:["The research provides ", " evidence."],
      blanks:[
        {options:["strong","weak","unclear","irrelevant"], answer:"strong"},
      ]
    },
    { id:'rwfib11', title:"Business Expansion",
      parts:["The company plans to ", " its operations."],
      blanks:[
        {options:["expand","reduce","cancel","avoid"], answer:"expand"},
      ]
    },
    { id:'rwfib12', title:"System Performance",
      parts:["The system improves ", " performance."],
      blanks:[
        {options:["overall","minor","temporary","limited"], answer:"overall"},
      ]
    },
  ],
  mcSingleReading: [
    { id:'mcsr1', passage:"Microplastics — tiny plastic particles less than five millimetres in size — have been found in every corner of the planet, from the deepest ocean trenches to the highest mountain peaks. These particles originate from the breakdown of larger plastic items and from microbeads used in cosmetics. Recent research has detected microplastics in human blood, lungs, and even placentas, raising serious concerns about potential health effects.",
      question:"According to the passage, where have microplastics been found?",
      options:["Only in ocean environments","Exclusively in cosmetic products","Everywhere from deep ocean to high mountains","Only in urban areas"],
      answer: 2 },
    { id:'mcsr2', passage:"Urban planners increasingly argue that cities should be designed around people rather than cars. Walkable neighbourhoods with mixed land use, accessible public transport, and nearby services can reduce commuting times and lower emissions. Such designs may also promote healthier lifestyles by encouraging walking and cycling. However, implementing these changes often requires rethinking existing road networks and zoning policies.",
      question:"What is one benefit of walkable neighbourhoods mentioned in the passage?",
      options:["Higher fuel consumption","Longer commuting times","Healthier lifestyles","Reduced access to services"],
      answer: 2 },
    { id:'mcsr3', passage:"Businesses across many industries are adopting digital tools to streamline routine tasks and improve decision-making. Automated systems can process information quickly, reduce repetitive manual work, and help staff focus on more complex responsibilities. For many organisations, the main benefit of technology lies in making daily operations more efficient.",
      question:"What is the main idea of the passage?",
      options:["Technology is harmful","Technology improves efficiency","Technology is limited","Technology is expensive"],
      answer: 1 },
    { id:'mcsr4', passage:"The passage explains how public health campaigns encourage healthier behaviour through education, community programs, and better access to information. It describes the methods used and outlines why these efforts matter for society.",
      question:"What is the author's purpose?",
      options:["To criticize","To inform","To entertain","To confuse"],
      answer: 1 },
    { id:'mcsr5', passage:"Governments and citizens are placing greater emphasis on reducing pollution, conserving natural resources, and protecting biodiversity. The passage discusses practical steps that can support cleaner air, safer water, and healthier ecosystems.",
      question:"What is the main focus of the passage?",
      options:["Environmental protection","Historical events","Travel advice","Personal finance"],
      answer: 0 },
    { id:'mcsr6', passage:"Higher education often gives students specialised knowledge, transferable skills, and better access to professional networks. These advantages can improve long-term employment prospects and support career development.",
      question:"Which statement best matches the passage?",
      options:["Education reduces opportunity","Education supports career development","Education has little value","Education should be avoided"],
      answer: 1 },
    { id:'mcsr7', passage:"A new transport policy was introduced in several districts to reduce congestion and improve service reliability. Early reports suggest shorter waiting times and better public satisfaction, although some challenges remain in implementation.",
      question:"What can be inferred from the passage?",
      options:["The project failed completely","The policy had some positive results","The research was cancelled","The company closed down"],
      answer: 1 },
    { id:'mcsr8', passage:"Recent discoveries in medicine, energy, and environmental science have changed the way people understand the world. The writer highlights how scientific progress continues to influence both daily life and long-term planning.",
      question:"What is the writer mainly discussing?",
      options:["Advances in science","Sports performance","Fashion trends","Family traditions"],
      answer: 0 },
    { id:'mcsr9', passage:"Modern cities depend on reliable transport networks to connect people with jobs, education, and services. The passage argues that better public transport can reduce traffic, lower emissions, and make urban growth more sustainable.",
      question:"What is the central argument?",
      options:["Public transport should be improved","Public transport should be removed","Cars are always better","Cities do not need planning"],
      answer: 0 },
    { id:'mcsr10', passage:"The passage explains that reducing emissions and protecting ecosystems require coordinated policies, investment, and long-term commitment. It stresses that sustainability cannot be achieved through words alone.",
      question:"What does the passage mainly suggest?",
      options:["Climate change is unimportant","Research has no value","Sustainability requires action","Technology should stop developing"],
      answer: 2 },
    { id:'mcsr11', passage:"Economic performance is shaped by a combination of policy choices, technological change, labour conditions, and social stability. The writer emphasises that no single factor can fully explain national growth patterns.",
      question:"What is the best summary?",
      options:["Economic growth depends on several factors","Growth is always guaranteed","Politics has no influence on growth","Technology prevents development"],
      answer: 0 },
    { id:'mcsr12', passage:"Strong leadership helps teams set priorities, solve problems, and stay focused on shared objectives. When guidance is clear and support is consistent, organisations are more likely to achieve successful outcomes.",
      question:"What is the main conclusion?",
      options:["Leadership is unnecessary","Effective leadership supports success","Teams should work without direction","Management reduces performance"],
      answer: 1 },
  ],
  mcMultipleReading: [
    { id:'mcmr1', passage:"Sleep plays a critical role in physical and mental health. During sleep, the brain consolidates memories and clears toxic waste products. The body repairs tissues, synthesises proteins, and releases hormones essential for growth. Chronic sleep deprivation is associated with increased risks of obesity, diabetes, cardiovascular disease, and depression. Despite this, many people in modern societies routinely sleep less than the recommended seven to nine hours per night.",
      question:"Which of the following are mentioned as benefits of sleep?",
      options:["Memory consolidation","Weight loss","Tissue repair","Improved eyesight","Hormone release","Faster metabolism"],
      answers:[0,2,4] },
    { id:'mcmr2', passage:"Reading fiction has been linked to a range of cognitive and emotional benefits. Researchers suggest that following complex narratives can improve concentration and expand vocabulary. Exposure to fictional characters and situations may also strengthen empathy by encouraging readers to consider perspectives different from their own. While fiction is not a substitute for real-life experience, it can complement education by deepening imagination and interpretive skills.",
      question:"Which benefits of reading fiction are mentioned in the passage?",
      options:["Improved concentration","Expanded vocabulary","Greater empathy","Faster reading speed","Better eyesight","Stronger imagination"],
      answers:[0,1,2,5] },
    { id:'mcmr3', passage:"The passage explains that education helps people develop practical abilities and broaden their understanding of the world. It also notes that strong educational systems can support personal growth and long-term social progress.",
      question:"Which statements are correct?",
      options:["Education improves skills","Education reduces knowledge","Education supports growth","Education has no impact"],
      answers:[0,2] },
    { id:'mcmr4', passage:"Governments in many countries are investing in solar, wind, and other cleaner technologies as they try to reduce dependence on fossil fuels. The passage describes renewable energy as an important part of future energy planning.",
      question:"Which points are supported by the passage?",
      options:["Renewable energy is important","Renewable energy is outdated","Governments invest in cleaner energy","Fossil fuels are the only solution"],
      answers:[0,2] },
    { id:'mcmr5', passage:"Scientific research often leads to new tools, improved systems, and better public services. The writer argues that research supports innovation and that scientific progress can produce broad benefits for society.",
      question:"Which statements are true?",
      options:["Research can support innovation","Research has no practical value","Scientific progress can improve society","Technology never changes"],
      answers:[0,2] },
    { id:'mcmr6', passage:"As urban populations increase, cities face growing demands on transport, housing, and public services. The passage notes that this pressure often makes infrastructure investment necessary.",
      question:"Which ideas are mentioned?",
      options:["Urban growth creates pressure","Infrastructure may need investment","Cities never change","Population decline is the only concern"],
      answers:[0,1] },
    { id:'mcmr7', passage:"Successful projects usually depend on realistic schedules, clear planning, and careful use of time. The writer explains that these factors often improve results and reduce avoidable setbacks.",
      question:"Which conclusions are reasonable?",
      options:["Good planning improves outcomes","Time management can matter","Planning is always unnecessary","Delays never happen"],
      answers:[0,1] },
    { id:'mcmr8', passage:"Climate policies are designed to reduce greenhouse gas emissions and limit environmental damage. The passage also highlights the need to protect ecosystems that are vulnerable to rising temperatures and other pressures.",
      question:"Which environmental outcomes are supported by the passage?",
      options:["Climate policy can reduce emissions","Climate policy has no purpose","Ecosystems may need protection","Carbon emissions should always rise"],
      answers:[0,2] },
    { id:'mcmr9', passage:"Digital tools have transformed the way people communicate and the way organisations carry out daily work. The writer points out that technology affects both communication habits and workplace systems.",
      question:"Which points are supported?",
      options:["Technology affects communication","Technology has changed workplaces","Communication methods never evolve","Digital systems are never useful"],
      answers:[0,1] },
    { id:'mcmr10', passage:"Public health campaigns often encourage better eating habits, physical activity, and greater awareness of preventable risks. The passage suggests that health knowledge can influence lifestyle choices.",
      question:"Which effects of public health campaigns are mentioned?",
      options:["Health campaigns encourage better habits","Public health is unrelated to behavior","Health awareness can influence lifestyle","Campaigns always fail"],
      answers:[0,2] },
    { id:'mcmr11', passage:"Universities commonly provide academic guidance, learning materials, and other support services to help students succeed. The writer notes that accessible resources can make study more manageable and effective.",
      question:"Which ideas are consistent with the passage?",
      options:["Universities offer student support","Learning resources can help students","Students should avoid support services","Resources have no academic value"],
      answers:[0,1] },
    { id:'mcmr12', passage:"Economic development is influenced by a range of conditions, including political stability, social structures, and broader financial circumstances. The passage argues that development does not happen in isolation.",
      question:"Which factors influencing development are mentioned?",
      options:["Economic stability can affect development","National development has no influencing factors","Political conditions may matter","Social factors are always irrelevant"],
      answers:[0,2] },
  ],
  reorderParagraphs: [
    { id:'rop1', tag:'★ 高频真题', sentences:[
      { id:'s1', text:"A) The printing press, invented by Johannes Gutenberg around 1440, revolutionised the spread of information across Europe." },
      { id:'s2', text:"B) Before its invention, books were copied by hand, making them expensive and rare." },
      { id:'s3', text:"C) The press enabled mass production of texts, dramatically lowering their cost." },
      { id:'s4', text:"D) As literacy rates rose, new ideas in science, religion, and politics spread rapidly, contributing to the Renaissance and Reformation." },
    ], correctOrder:['s1','s2','s3','s4'] },
    { id:'rop2', tag:'真题', sentences:[
      { id:'r2a', text:"A) The discovery of penicillin by Alexander Fleming in 1928 marked the beginning of the antibiotic era." },
      { id:'r2b', text:"B) Fleming noticed that a mould had contaminated one of his petri dishes and was killing the surrounding bacteria." },
      { id:'r2c', text:"C) He identified the mould as Penicillium notatum and named the antibacterial substance it produced penicillin." },
      { id:'r2d', text:"D) Further development by Florey and Chain in the 1940s transformed penicillin into a widely used medicine that saved millions of lives." },
    ], correctOrder:['r2a','r2b','r2c','r2d'] },
    { id:'rop3', tag:'预测题', sentences:[
      { id:'r3a', text:"A) Ocean acidification is the ongoing decrease in the pH of Earth's oceans, primarily caused by the absorption of carbon dioxide from the atmosphere." },
      { id:'r3b', text:"B) Since the industrial revolution, the average pH of surface ocean waters has fallen from 8.2 to approximately 8.1." },
      { id:'r3c', text:"C) This change may appear small, but pH is measured on a logarithmic scale, meaning the oceans are now around thirty percent more acidic than they were." },
      { id:'r3d', text:"D) The consequences for marine life, particularly shell-forming organisms such as oysters, clams, and corals, are increasingly severe." },
    ], correctOrder:['r3a','r3b','r3c','r3d'] },
    { id:'rop4', tag:'★ 高频预测题', sentences:[
      { id:'r4a', text:"A) Electric vehicles are often presented as a cleaner alternative to conventional petrol and diesel cars." },
      { id:'r4b', text:"B) They produce no tailpipe emissions, which can improve air quality in densely populated cities." },
      { id:'r4c', text:"C) However, their overall environmental impact still depends on how the electricity used to charge them is generated." },
      { id:'r4d', text:"D) For this reason, transport electrification is most effective when combined with a shift toward renewable energy." },
    ], correctOrder:['r4a','r4b','r4c','r4d'] },
    { id:'rop5', tag:'新增题', sentences:[
      { id:'r5a', text:"A) The results were surprising." },
      { id:'r5b', text:"B) The experiment lasted six months." },
      { id:'r5c', text:"C) Scientists conducted research." },
      { id:'r5d', text:"D) Data was collected." },
    ], correctOrder:['r5c','r5b','r5d','r5a'] },
    { id:'rop6', tag:'新增题', sentences:[
      { id:'r6a', text:"A) This improved productivity." },
      { id:'r6b', text:"B) The company adopted new technology." },
      { id:'r6c', text:"C) Staff were trained." },
      { id:'r6d', text:"D) Efficiency increased." },
    ], correctOrder:['r6b','r6c','r6a','r6d'] },
    { id:'rop7', tag:'新增题', sentences:[
      { id:'r7a', text:"A) The data was then analyzed carefully." },
      { id:'r7b', text:"B) A new study was carried out by the research team." },
      { id:'r7c', text:"C) The final results confirmed the original theory." },
      { id:'r7d', text:"D) Information was collected from several schools." },
    ], correctOrder:['r7b','r7d','r7a','r7c'] },
    { id:'rop8', tag:'新增题', sentences:[
      { id:'r8a', text:"A) As a result, customer satisfaction increased." },
      { id:'r8b', text:"B) The company changed its service strategy." },
      { id:'r8c', text:"C) Managers first reviewed client feedback." },
      { id:'r8d', text:"D) New training was introduced for staff." },
    ], correctOrder:['r8c','r8b','r8d','r8a'] },
    { id:'rop9', tag:'新增题', sentences:[
      { id:'r9a', text:"A) Finally, the report was submitted to the committee." },
      { id:'r9b', text:"B) The team gathered the necessary data." },
      { id:'r9c', text:"C) Recommendations were developed from the findings." },
      { id:'r9d', text:"D) The project began with a review of previous studies." },
    ], correctOrder:['r9d','r9b','r9c','r9a'] },
    { id:'rop10', tag:'新增题', sentences:[
      { id:'r10a', text:"A) This led to significant cost savings." },
      { id:'r10b', text:"B) The factory introduced automated systems." },
      { id:'r10c', text:"C) Workers received technical training." },
      { id:'r10d', text:"D) Production speed improved over time." },
    ], correctOrder:['r10b','r10c','r10d','r10a'] },
    { id:'rop11', tag:'新增题', sentences:[
      { id:'r11a', text:"A) The findings were presented at a conference." },
      { id:'r11b', text:"B) Researchers designed a new experiment." },
      { id:'r11c', text:"C) Several tests were completed successfully." },
      { id:'r11d', text:"D) The results supported the hypothesis." },
    ], correctOrder:['r11b','r11c','r11d','r11a'] },
    { id:'rop12', tag:'新增题', sentences:[
      { id:'r12a', text:"A) This created pressure on local services." },
      { id:'r12b', text:"B) The city's population grew rapidly." },
      { id:'r12c', text:"C) More housing developments were approved." },
      { id:'r12d', text:"D) Infrastructure investment became necessary." },
    ], correctOrder:['r12b','r12a','r12c','r12d'] },
    { id:'rop13', tag:'新增题', sentences:[
      { id:'r13a', text:"A) Students then completed a follow-up survey." },
      { id:'r13b', text:"B) A new teaching method was introduced." },
      { id:'r13c', text:"C) Teachers received guidance before implementation." },
      { id:'r13d', text:"D) Early feedback was generally positive." },
    ], correctOrder:['r13b','r13c','r13a','r13d'] },
    { id:'rop14', tag:'新增题', sentences:[
      { id:'r14a', text:"A) The policy was later expanded nationwide." },
      { id:'r14b', text:"B) A pilot program was launched in one region." },
      { id:'r14c', text:"C) Initial results were encouraging." },
      { id:'r14d', text:"D) Officials reviewed the early outcomes." },
    ], correctOrder:['r14b','r14c','r14d','r14a'] },
  ],
  rFillBlanks: [
    { id:'rfib1', title:"The Amazon Rainforest",
      fullText:"The Amazon rainforest covers approximately 5.5 million square kilometres and contains about ten percent of all species on Earth. It plays a vital role in regulating the global climate by absorbing vast amounts of carbon dioxide and releasing oxygen. Deforestation, driven primarily by agriculture and logging, threatens this irreplaceable ecosystem. Scientists warn that if current rates continue, the Amazon could reach a tipping point beyond which it transitions from rainforest to savanna.",
      blanks:[
        {word:"approximately", hint:"about, roughly"},
        {word:"regulating", hint:"controlling"},
        {word:"Deforestation", hint:"cutting down trees"},
        {word:"irreplaceable", hint:"cannot be replaced"},
        {word:"tipping", hint:"critical point"},
      ]
    },
    { id:'rfib2', title:"Digital Education",
      fullText:"Online learning platforms have expanded access to education for millions of people around the world. Students can now access lectures, interactive exercises, and discussion forums regardless of their geographic location. However, successful online learning requires self-discipline, reliable internet access, and carefully designed course materials. Educators increasingly argue that the most effective model combines the flexibility of digital delivery with the support of human interaction.",
      blanks:[
        {word:"expanded", hint:"increased"},
        {word:"interactive", hint:"engaging"},
        {word:"self-discipline", hint:"personal control"},
        {word:"flexibility", hint:"adaptability"},
        {word:"interaction", hint:"communication"},
      ]
    },
    { id:'rfib3', title:"Technology and Communication",
      fullText:"The rapid development of technology has changed the way people communicate.",
      blanks:[
        {word:"changed", hint:"altered"},
      ]
    },
    { id:'rfib4', title:"Growth Factors",
      fullText:"Economic growth depends on both internal and external factors.",
      blanks:[
        {word:"external", hint:"outside"},
      ]
    },
    { id:'rfib5', title:"Education and Careers",
      fullText:"Education plays a vital role in shaping future careers.",
      blanks:[
        {word:"role", hint:"function"},
      ]
    },
    { id:'rfib6', title:"Academic Publication",
      fullText:"The research findings were published in an international journal.",
      blanks:[
        {word:"published", hint:"printed"},
      ]
    },
    { id:'rfib7', title:"Energy Solutions",
      fullText:"Many companies are focusing on renewable energy solutions.",
      blanks:[
        {word:"renewable", hint:"sustainable"},
      ]
    },
    { id:'rfib8', title:"Population Trends",
      fullText:"The data shows a steady increase in population growth.",
      blanks:[
        {word:"increase", hint:"rise"},
      ]
    },
    { id:'rfib9', title:"Project Planning",
      fullText:"The project requires effective planning and time management.",
      blanks:[
        {word:"time", hint:"schedule"},
      ]
    },
    { id:'rfib10', title:"Living Standards",
      fullText:"Technological advances have improved living standards.",
      blanks:[
        {word:"living", hint:"daily life"},
      ]
    },
    { id:'rfib11', title:"Student Support",
      fullText:"The university provides various resources for students.",
      blanks:[
        {word:"resources", hint:"materials"},
      ]
    },
    { id:'rfib12', title:"Global Responsibility",
      fullText:"Environmental protection has become a global priority.",
      blanks:[
        {word:"priority", hint:"main concern"},
      ]
    },
  ],
  summarizeSpoken: [
    { id:'sst1', tag:'★ 高频真题', title:"Urban Heat Islands", transcript:"Cities are typically warmer than surrounding rural areas due to a phenomenon known as the urban heat island effect. Dark surfaces such as asphalt and concrete absorb solar radiation and release it as heat. The absence of vegetation removes the cooling effect of evapotranspiration. This effect can raise urban temperatures by up to five degrees Celsius, increasing energy consumption for cooling, worsening air quality, and posing health risks particularly for elderly populations. Urban planners are responding by increasing green spaces and mandating cool roofs.", wordRange:[50,70], duration:55 },
    { id:'sst2', tag:'★ 高频真题', title:"The Gig Economy", transcript:"The gig economy refers to a labour market characterised by short-term contracts and freelance work rather than permanent employment. Technology platforms such as ride-sharing and food delivery apps have dramatically expanded this sector. Proponents argue that gig work offers flexibility and low barriers to entry, benefiting workers who prefer non-traditional arrangements. Critics, however, point out that gig workers typically lack benefits such as paid leave, healthcare, and retirement savings, and may be vulnerable to income instability.", wordRange:[50,70], duration:52 },
    { id:'sst3', tag:'真题', title:"Ocean Plastic Pollution", transcript:"Every year, an estimated eight million tonnes of plastic waste enters the world's oceans, threatening marine ecosystems and the communities that depend on them. The majority comes from land-based sources — rivers carry waste from cities and agricultural areas into coastal waters. Once in the ocean, plastic breaks down into microplastics that are ingested by fish, birds, and marine mammals. Scientists are developing biodegradable alternatives to conventional plastics, but widespread adoption requires both regulatory support and changes in consumer behaviour.", wordRange:[50,70], duration:58 },
    { id:'sst4', tag:'预测题', title:"Sleep and Memory", transcript:"Research in neuroscience has established a strong link between sleep and memory consolidation. During sleep, the brain replays the day's experiences and transfers information from short-term to long-term memory. Studies show that people who sleep well after learning new material retain significantly more information than those who are sleep-deprived. The hippocampus plays a central role in this process, acting as a temporary storage site before memories are distributed across the cortex. These findings have practical implications for students and for the treatment of memory disorders.", wordRange:[50,70], duration:54 },
    { id:'sst5', tag:'预测题', title:"Sustainable Agriculture", transcript:"Conventional agriculture relies heavily on synthetic fertilisers, pesticides, and large amounts of water, contributing to soil degradation, water pollution, and greenhouse gas emissions. Sustainable agriculture seeks to produce food in ways that preserve natural resources and maintain ecological balance. Techniques include crop rotation, organic farming, agroforestry, and precision irrigation. While sustainable methods can yield comparable results to conventional farming over time, the transition requires investment in training, technology, and supportive policies. Food security for a growing global population depends on making this transition at scale.", wordRange:[50,70], duration:60 },
    { id:'sst6', tag:'★ 高频预测题', title:"Cybersecurity Awareness", transcript:"As more personal and professional activities move online, cybersecurity has become a basic requirement for individuals and organisations alike. Many data breaches do not result from highly sophisticated attacks, but from simple human errors such as weak passwords, phishing emails, or failure to install updates. Experts therefore emphasise that cybersecurity is not only a technical issue, but also an educational one. Regular training, multi-factor authentication, and clear security policies can significantly reduce digital risks.", wordRange:[50,70], duration:52 },
    { id:'sst7', tag:'预测题', title:"Food Waste", transcript:"A significant proportion of the food produced globally is never eaten. Food waste occurs at every stage of the supply chain, from farm losses and transportation problems to supermarket standards and household behaviour. This waste represents not only a moral issue in a world where many people remain undernourished, but also an environmental one, because producing food consumes land, water, and energy. Reducing food waste requires coordinated action by producers, retailers, governments, and consumers.", wordRange:[50,70], duration:56 },
  ],
  mcSingleListening: [
    { id:'mcsl1', title:"University Funding", transcript:"Many universities are facing significant funding pressures as government grants decline. As a result, institutions are increasingly reliant on tuition fees, industry partnerships, and alumni donations. Some experts argue that this shift risks compromising academic independence, as research agendas may be influenced by commercial interests. Others suggest that industry collaboration enhances the relevance of university research to real-world problems.",
      question:"What concern do some experts raise about universities relying on industry funding?",
      options:["It leads to lower tuition fees","It may compromise academic independence","It increases government grants","It reduces alumni donations"],
      answer: 1 },
    { id:'mcsl2', title:"Recycling Policy", transcript:"Several cities have introduced stricter recycling regulations in response to rising landfill costs and environmental concerns. Households are now required to separate food waste, paper, glass, and plastics into different bins. Local authorities argue that better sorting improves the quality of recycled materials and reduces contamination. However, some residents complain that the system is confusing and time-consuming, especially where public guidance is limited.",
      question:"Why do local authorities support better household sorting?",
      options:["It lowers electricity prices","It improves recycling quality","It reduces public guidance","It eliminates all waste"],
      answer: 1 },
  ],
  mcMultipleListening: [
    { id:'mcml1', title:"Benefits of Exercise", transcript:"Regular physical exercise provides a wide range of health benefits. Cardiovascular exercise such as running and cycling strengthens the heart and reduces the risk of heart disease. Resistance training builds muscle mass and increases metabolic rate. Exercise also releases endorphins, which improve mood and reduce anxiety and depression. Furthermore, studies show that physically active individuals tend to sleep better and have stronger immune systems.",
      question:"Which benefits of exercise are mentioned in the talk?",
      options:["Improved cardiovascular health","Better academic performance","Reduced anxiety","Stronger immune system","Improved balance","Better sleep"],
      answers:[0,2,3,5] },
    { id:'mcml2', title:"Urban Gardening", transcript:"Urban gardening is becoming increasingly popular in cities around the world. Community gardens can provide fresh produce, create social connections among residents, and offer educational opportunities for children. Green spaces of this kind may also support biodiversity by attracting insects and birds. However, urban gardening projects often depend on volunteer labour and may struggle if long-term funding and land access are uncertain.",
      question:"Which benefits of urban gardening are mentioned in the recording?",
      options:["Fresh produce","Social connection","Educational opportunities","Guaranteed profit","Support for biodiversity","Free public transport"],
      answers:[0,1,2,4] },
  ],
  fillBlanksListening: [
    { id:'fbl1', title:"Photosynthesis", transcript:"Photosynthesis is the process by which green plants convert sunlight into chemical energy. Plants absorb carbon dioxide from the air through tiny pores called stomata, and water from the soil through their roots. Using energy from sunlight, they convert these ingredients into glucose, which fuels plant growth. Oxygen is released as a byproduct, making photosynthesis essential to life on Earth.",
      blanks:[
        {before:"Plants absorb ", key:"carbon dioxide", after:" from the air"},
        {before:"through tiny pores called ", key:"stomata", after:", and water from the soil"},
        {before:"they convert these ingredients into ", key:"glucose", after:", which fuels plant growth"},
        {before:"Oxygen is released as a ", key:"byproduct", after:", making photosynthesis essential"},
      ]
    },
    { id:'fbl2', title:"Renewable Electricity", transcript:"Electricity generated from renewable sources such as wind and solar has grown rapidly in recent years. Falling technology costs and stronger climate policies have encouraged governments and businesses to invest in cleaner energy systems. However, because renewable power generation can vary according to weather conditions, electricity grids must become more flexible. Energy storage, smarter networks, and better forecasting all help maintain reliability.",
      blanks:[
        {before:"Electricity generated from renewable ", key:"sources", after:" such as wind and solar"},
        {before:"Falling technology costs and stronger climate ", key:"policies", after:" have encouraged governments"},
        {before:"renewable power generation can vary according to ", key:"weather", after:" conditions"},
        {before:"Energy storage, smarter networks, and better ", key:"forecasting", after:" all help maintain reliability"},
      ]
    },
  ],
  highlightSummary: [
    { id:'hcs1', title:"The Sharing Economy", transcript:"The sharing economy describes a system where individuals share access to goods and services, often facilitated by digital platforms. Companies like Airbnb and Uber have disrupted traditional industries by enabling peer-to-peer transactions. Supporters highlight the efficiency gains from better resource utilisation — an idle car or spare room can now generate income. Critics, however, point to concerns about worker rights, safety regulations, and the impact on local communities, particularly rising housing costs in cities where short-term rentals proliferate.",
      summaries:[
        "The sharing economy uses platforms to enable resource sharing but raises concerns about worker rights and housing costs.",
        "Digital platforms have completely eliminated traditional industries by offering cheaper alternatives to consumers.",
        "Sharing economy companies operate without any regulatory oversight and offer no benefits to local communities.",
      ], answer: 0 },
    { id:'hcs2', title:"Online Education", transcript:"Universities have expanded their use of online education over the past decade, and this trend accelerated sharply during the pandemic. Online delivery offers flexibility and can widen access for students who live far from campus or who balance study with work. At the same time, educators warn that online learning may reduce spontaneous interaction, weaken a sense of community, and disadvantage students with poor internet access. As a result, many institutions are moving toward blended models that combine digital convenience with face-to-face engagement.",
      summaries:[
        "Online education increases flexibility and access, but many institutions now prefer blended models because fully online learning also has limitations.",
        "Universities have replaced all face-to-face teaching with online platforms because students strongly prefer digital classes.",
        "Online education is mainly useful because it removes the need for teachers and campus facilities altogether.",
      ], answer: 0 },
  ],
  selectMissing: [
    { id:'smw1', title:"Scientific Method", transcript:"The scientific method is a systematic process for acquiring knowledge. A scientist begins by making an observation, which leads to a question. A hypothesis — a testable prediction — is then formulated. Experiments are designed to test the hypothesis, and data is collected and analysed. Based on the results, the hypothesis is either supported or",
      options:["celebrated publicly","rejected and revised","kept confidential","applied to industry"],
      answer: 1 },
    { id:'smw2', title:"Academic Integrity", transcript:"Academic integrity is based on honesty, trust, fairness, respect, and responsibility. Universities expect students to acknowledge sources correctly, complete their own work, and avoid plagiarism. When these principles are followed, qualifications retain their value and learning becomes more meaningful. If academic misconduct occurs, institutions may impose penalties ranging from formal warnings to",
      options:["graduation ceremonies","scholarship increases","disciplinary suspension","public celebrations"],
      answer: 2 },
  ],
  highlightIncorrect: [
    { id:'hi1', title:"Migration Patterns", transcript:"Every year, billions of birds undertake extraordinary journeys across continents and oceans as part of their annual migration cycles. These migrations are driven primarily by the need to find food and suitable breeding conditions. Birds navigate using a variety of cues, including the position of the sun, stars, and Earth's magnetic field.",
      textWords:["Every","year,","millions","of","birds","undertake","extraordinary","journeys","across","continents","and","oceans","as","part","of","their","annual","migration","patterns.","These","migrations","are","driven","primarily","by","the","need","to","find","food","and","suitable","breeding","conditions.","Birds","navigate","using","a","variety","of","cues,","including","the","position","of","the","sun,","stars,","and","Earth's","magnetic","field."],
      incorrectIndices:[2, 18]
    },
    { id:'hi2', title:"Renewable Energy", transcript:"Solar and wind energy have become central to many national climate strategies. Their rapid expansion has been driven by falling costs, supportive policies, and advances in energy storage. Although renewable energy sources are cleaner than fossil fuels, integrating large amounts of intermittent power into national grids remains a technical challenge.",
      textWords:["Solar","and","wind","energy","have","become","central","to","many","regional","climate","strategies.","Their","rapid","decline","has","been","driven","by","falling","costs,","supportive","policies,","and","advances","in","energy","storage.","Although","renewable","energy","sources","are","cleaner","than","fossil","fuels,","integrating","large","amounts","of","intermittent","power","into","national","grids","remains","a","technical","challenge."],
      incorrectIndices:[9, 14]
    },
  ],
  writeDictation: [
    { id:'wfd1', tag:'★ 高频真题', sentence:"The government has announced a new policy to reduce carbon emissions by 2035." },
    { id:'wfd2', tag:'★ 高频真题', sentence:"Students are advised to arrive at least thirty minutes before the examination begins." },
    { id:'wfd3', tag:'★ 高频真题', sentence:"The discovery of antibiotics transformed modern medicine and saved millions of lives." },
    { id:'wfd4', tag:'真题', sentence:"Researchers have found a strong correlation between exercise and improved mental health." },
    { id:'wfd5', tag:'真题', sentence:"The committee will review all applications before making a final decision next month." },
    { id:'wfd6', tag:'★ 高频真题', sentence:"Biodiversity is essential to the health and stability of ecosystems around the world." },
    { id:'wfd7', tag:'★ 高频真题', sentence:"The university library provides access to thousands of academic journals and research papers." },
    { id:'wfd8', tag:'真题', sentence:"Climate models predict that sea levels could rise by up to one metre by the end of the century." },
    { id:'wfd9', tag:'★ 高频真题', sentence:"Regular physical activity is one of the most effective ways to maintain both physical and mental health." },
    { id:'wfd10', tag:'预测题', sentence:"Artificial intelligence is rapidly transforming the way businesses operate and make decisions." },
    { id:'wfd11', tag:'★ 高频真题', sentence:"The experiment demonstrated a clear relationship between diet and cognitive performance in children." },
    { id:'wfd12', tag:'预测题', sentence:"International cooperation is essential to addressing the challenges posed by climate change." },
    { id:'wfd13', tag:'真题', sentence:"Many students struggle to balance academic responsibilities with part-time employment." },
    { id:'wfd14', tag:'★ 高频真题', sentence:"The findings of the study were consistent with previous research conducted in this field." },
    { id:'wfd15', tag:'预测题', sentence:"Access to clean water and sanitation remains a critical challenge in many developing nations." },
    { id:'wfd16', tag:'★ 高频预测题', sentence:"The lecture highlighted the importance of critical thinking in higher education." },
    { id:'wfd17', tag:'预测题', sentence:"Improving public transport can reduce both pollution and travel time in major cities." },
    { id:'wfd18', tag:'预测题', sentence:"Scientists are investigating how sleep quality affects memory and learning performance." },
    { id:'wfd19', tag:'★ 高频预测题', sentence:"The company introduced flexible working hours to improve employee wellbeing and productivity." },
    { id:'wfd20', tag:'预测题', sentence:"International students should familiarize themselves with local laws and university policies." },
    { id:'WFD-001', tag:'新增题', sentence:"Education plays a vital role in economic development." },
    { id:'WFD-002', tag:'新增题', sentence:"The results should be submitted by the end of the week." },
    { id:'WFD-003', tag:'新增题', sentence:"Technological advancements improve efficiency." },
    { id:'WFD-004', tag:'新增题', sentence:"The research focuses on environmental sustainability." },
    { id:'WFD-005', tag:'新增题', sentence:"Students must attend all scheduled classes." },
    { id:'WFD-006', tag:'新增题', sentence:"The lecture covered important theoretical concepts." },
    { id:'WFD-007', tag:'新增题', sentence:"The company aims to expand its global presence." },
    { id:'WFD-008', tag:'新增题', sentence:"The policy addresses key social issues." },
    { id:'WFD-009', tag:'新增题', sentence:"The experiment produced accurate results." },
    { id:'WFD-010', tag:'新增题', sentence:"The system requires regular updates." },
    { id:'WFD-011', tag:'新增题', sentence:"The professor explained the concept clearly." },
    { id:'WFD-012', tag:'新增题', sentence:"The study examines economic growth patterns." },
    { id:'WFD-013', tag:'新增题', sentence:"The data was collected over several years." },
    { id:'WFD-014', tag:'新增题', sentence:"The results indicate a positive trend." },
    { id:'WFD-015', tag:'新增题', sentence:"The research contributes to scientific knowledge." },
    { id:'WFD-016', tag:'新增题', sentence:"The lecture was informative and engaging." },
    { id:'WFD-017', tag:'新增题', sentence:"Students should review the material carefully." },
    { id:'WFD-018', tag:'新增题', sentence:"The company focuses on customer satisfaction." },
    { id:'WFD-019', tag:'新增题', sentence:"The system improves operational efficiency." },
    { id:'WFD-020', tag:'新增题', sentence:"The policy supports sustainable development." },
    { id:'WFD-021', tag:'新增题', sentence:"The experiment was conducted successfully." },
    { id:'WFD-022', tag:'新增题', sentence:"The results were published in a journal." },
    { id:'WFD-023', tag:'新增题', sentence:"The lecture included practical examples." },
    { id:'WFD-024', tag:'新增题', sentence:"The research highlights important findings." },
    { id:'WFD-025', tag:'新增题', sentence:"Students are encouraged to participate actively." },
    { id:'WFD-026', tag:'新增题', sentence:"The system needs to be maintained regularly." },
    { id:'WFD-027', tag:'新增题', sentence:"The company plans to increase investment." },
    { id:'WFD-028', tag:'新增题', sentence:"The policy aims to reduce pollution." },
    { id:'WFD-029', tag:'新增题', sentence:"The results were consistent across groups." },
    { id:'WFD-030', tag:'新增题', sentence:"The lecture focused on key issues." },
    { id:'WFD-031', tag:'新增题', sentence:"The research was funded by the government." },
    { id:'WFD-032', tag:'新增题', sentence:"Students must follow the guidelines carefully." },
    { id:'WFD-033', tag:'新增题', sentence:"The system improves productivity significantly." },
    { id:'WFD-034', tag:'新增题', sentence:"The company adopted new strategies." },
    { id:'WFD-035', tag:'新增题', sentence:"The policy promotes environmental awareness." },
    { id:'WFD-036', tag:'新增题', sentence:"The results show a clear improvement." },
    { id:'WFD-037', tag:'新增题', sentence:"The lecture provided useful insights." },
    { id:'WFD-038', tag:'新增题', sentence:"The research examines global trends." },
    { id:'WFD-039', tag:'新增题', sentence:"Students should complete the assignment on time." },
    { id:'WFD-040', tag:'新增题', sentence:"The system is designed to be efficient." },
    { id:'WFD-041', tag:'新增题', sentence:"The company aims to expand internationally." },
    { id:'WFD-042', tag:'新增题', sentence:"The policy addresses economic challenges." },
    { id:'WFD-043', tag:'新增题', sentence:"The results were analyzed carefully." },
    { id:'WFD-044', tag:'新增题', sentence:"The lecture covered various topics." },
    { id:'WFD-045', tag:'新增题', sentence:"The research contributes to innovation." },
    { id:'WFD-046', tag:'新增题', sentence:"Students must attend the workshop." },
    { id:'WFD-047', tag:'新增题', sentence:"The system requires technical support." },
    { id:'WFD-048', tag:'新增题', sentence:"The company focuses on long-term growth." },
    { id:'WFD-049', tag:'新增题', sentence:"The policy encourages sustainable practices." },
    { id:'WFD-050', tag:'新增题', sentence:"The results indicate strong performance." },
    { id:'WFD-051', tag:'新增题', sentence:"The lecture emphasized critical thinking." },
    { id:'WFD-052', tag:'新增题', sentence:"The research provides valuable data." },
    { id:'WFD-053', tag:'新增题', sentence:"Students should prepare for the exam." },
    { id:'WFD-054', tag:'新增题', sentence:"The system helps improve performance." },
    { id:'WFD-055', tag:'新增题', sentence:"The company plans to increase revenue." },
    { id:'WFD-056', tag:'新增题', sentence:"The policy supports innovation." },
    { id:'WFD-057', tag:'新增题', sentence:"The results were statistically significant." },
    { id:'WFD-058', tag:'新增题', sentence:"The lecture included case studies." },
    { id:'WFD-059', tag:'新增题', sentence:"The research explores new ideas." },
    { id:'WFD-060', tag:'新增题', sentence:"Students must submit the report on time." },
  ],
};

DB.repeatSentence = DB.repeatSentence.map((item) => ({
  ...item,
  audio: item.audio || `/audio/repeat-sentence/${item.id}.wav`,
}));
