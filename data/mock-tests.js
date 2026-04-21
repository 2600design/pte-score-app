window.PTE_MOCK_SETS = {
  full_mock_1: {
    id: 'full_mock_1',
    title: 'Original Full Mock 1',
    questionTypes: {
      readAloud: [
        {
          id: 'mock1_ra1',
          tag: 'Mock Test 1',
          text: 'Cities that invest in reliable public transport often gain both economic and environmental benefits. Efficient train and bus systems reduce commuting time, improve access to employment, and lower dependence on private cars. Over time, this can reduce air pollution and support more inclusive urban growth.'
        },
        {
          id: 'mock1_ra2',
          tag: 'Mock Test 1',
          text: 'Scientific literacy is increasingly important in a world shaped by data, technology, and rapid innovation. People are expected not only to understand basic scientific ideas, but also to evaluate evidence, question unreliable claims, and make informed decisions in daily life.'
        }
      ],
      repeatSentence: [
        {
          id: 'mock1_rs1',
          tag: 'Mock Test 1',
          text: 'The research team presented its findings at an international conference last month.',
          audio: null
        },
        {
          id: 'mock1_rs2',
          tag: 'Mock Test 1',
          text: 'Public libraries continue to play an important role in community education.',
          audio: null
        }
      ],
      describeImage: [
        {
          id: 'mock1_di1',
          tag: 'Mock Test 1',
          title: 'Line Graph – Urban Cycling Growth',
          imageUrl: null,
          imageSvg: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px"><rect width="320" height="200" fill="#f8fafc"/><text x="160" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">Urban Cycling Trips (millions)</text><line x1="40" y1="168" x2="292" y2="168" stroke="#cbd5e1"/><line x1="40" y1="34" x2="40" y2="168" stroke="#cbd5e1"/><polyline points="50,150 95,138 140,120 185,98 230,80 275,60" fill="none" stroke="#2563eb" stroke-width="3"/><g fill="#2563eb"><circle cx="50" cy="150" r="4"/><circle cx="95" cy="138" r="4"/><circle cx="140" cy="120" r="4"/><circle cx="185" cy="98" r="4"/><circle cx="230" cy="80" r="4"/><circle cx="275" cy="60" r="4"/></g><text x="50" y="184" font-size="9" text-anchor="middle" fill="#64748b">2015</text><text x="95" y="184" font-size="9" text-anchor="middle" fill="#64748b">2016</text><text x="140" y="184" font-size="9" text-anchor="middle" fill="#64748b">2017</text><text x="185" y="184" font-size="9" text-anchor="middle" fill="#64748b">2018</text><text x="230" y="184" font-size="9" text-anchor="middle" fill="#64748b">2019</text><text x="275" y="184" font-size="9" text-anchor="middle" fill="#64748b">2020</text></svg>`,
          hint: 'Describe the main trend, key changes, and overall pattern shown in the graph.'
        }
      ],
      retellLecture: [
        {
          id: 'mock1_rl1',
          tag: 'Mock Test 1',
          content: 'Lecture on Circular Economy',
          transcript: 'The circular economy is an economic model designed to minimize waste and make better use of resources. Instead of following the traditional pattern of take, make, and dispose, it focuses on reusing materials, repairing products, and recycling components so that they remain in circulation for as long as possible. Supporters argue that this model can reduce environmental pressure, lower production costs over time, and encourage innovation in product design. However, implementing a circular economy also requires changes in manufacturing systems, consumer behavior, and public policy.',
          duration: 48,
          audio: ''
        }
      ],
      answerShort: [
        {
          id: 'mock1_asq1',
          tag: 'Mock Test 1',
          content: 'What do we call the natural home of an animal?',
          answer: 'habitat',
          audio: ''
        },
        {
          id: 'mock1_asq2',
          tag: 'Mock Test 1',
          content: 'What device is commonly used to measure temperature?',
          answer: 'thermometer',
          audio: ''
        }
      ],
      summarizeWritten: [
        {
          id: 'mock1_swt1',
          tag: 'Mock Test 1',
          title: 'Urban Tree Cover',
          text: 'Urban tree cover provides important benefits for modern cities. Trees reduce surface temperatures, improve air quality, absorb rainwater, and support biodiversity by creating habitats for birds and insects. Access to green spaces is also associated with lower stress levels and improved mental wellbeing. Despite these benefits, urban development often removes mature trees and replaces natural surfaces with roads and buildings. City planners therefore argue that preserving and expanding tree cover should be treated as essential infrastructure rather than as an optional aesthetic feature.',
          wordRange: [25, 50]
        }
      ],
      writeEssay: [
        {
          id: 'mock1_we1',
          tag: 'Mock Test 1',
          prompt: 'Some people believe that governments should invest more in public transport than in building new roads. Discuss both views and give your own opinion.',
          wordRange: [200, 300]
        }
      ],
      rwFillBlanks: [
        {
          id: 'mock1_rwfib1',
          title: 'Digital Health',
          parts: [
            'Digital health tools can improve access to medical advice, support earlier ',
            ' of illness, and help patients manage chronic conditions more effectively. However, their long-term success depends on strong data ',
            ', user trust, and careful integration with existing healthcare systems.'
          ],
          blanks: [
            { options: ['detection', 'holiday', 'distance', 'retirement'], answer: 'detection' },
            { options: ['protection', 'confusion', 'advertising', 'migration'], answer: 'protection' }
          ]
        }
      ],
      mcSingleReading: [
        {
          id: 'mock1_mcsr1',
          passage: 'Researchers studying workplace productivity have found that short breaks can improve concentration and reduce mental fatigue. Rather than lowering output, well-timed pauses may help employees maintain attention and make fewer errors during complex tasks.',
          question: 'According to the passage, what is one benefit of short breaks?',
          options: ['They always reduce output', 'They improve concentration', 'They eliminate all fatigue', 'They increase working hours'],
          answer: 1
        }
      ],
      mcMultipleReading: [
        {
          id: 'mock1_mcmr1',
          passage: 'Effective teamwork often depends on clear communication, shared goals, and mutual accountability. Teams that understand their responsibilities and exchange information openly are usually better able to solve problems and complete projects successfully.',
          question: 'Which factors contributing to effective teamwork are mentioned?',
          options: ['Clear communication', 'Shared goals', 'Mutual accountability', 'Longer holidays'],
          answers: [0, 1, 2]
        }
      ],
      reorderParagraphs: [
        {
          id: 'mock1_rop1',
          tag: 'Mock Test 1',
          sentences: [
            { id: 'mock1_rop1_a', text: 'A) Community gardens are becoming more common in large cities.' },
            { id: 'mock1_rop1_b', text: 'B) They provide residents with fresh produce and shared outdoor space.' },
            { id: 'mock1_rop1_c', text: 'C) In addition, they can strengthen local social connections.' },
            { id: 'mock1_rop1_d', text: 'D) For this reason, many planners now see them as valuable urban assets.' }
          ],
          correctOrder: ['mock1_rop1_a', 'mock1_rop1_b', 'mock1_rop1_c', 'mock1_rop1_d']
        }
      ],
      rFillBlanks: [
        {
          id: 'mock1_rfib1',
          title: 'Energy Transition',
          fullText: 'The transition to cleaner energy depends on innovation, investment, and public support.',
          blanks: [
            { word: 'innovation', hint: 'new ideas' },
            { word: 'support', hint: 'backing' }
          ]
        }
      ],
      summarizeSpoken: [
        {
          id: 'mock1_sst1',
          tag: 'Mock Test 1',
          title: 'Digital Skills in Employment',
          transcript: 'Employers increasingly expect workers in many industries to possess at least basic digital skills. These include using productivity software, communicating effectively online, managing information securely, and adapting to new digital tools. While specialist technical roles require deeper expertise, many ordinary jobs now also depend on digital confidence. As a result, schools, training providers, and employers are placing greater emphasis on practical digital literacy as part of workforce preparation.',
          wordRange: [50, 70],
          duration: 50
        }
      ],
      mcSingleListening: [
        {
          id: 'mock1_mcsl1',
          title: 'Tourism Policy',
          transcript: 'Some cities are introducing tourism limits during peak seasons because local infrastructure becomes overloaded. Officials argue that controlling visitor numbers can protect historic sites, reduce crowding, and improve the experience for both residents and tourists.',
          question: 'Why are some cities introducing tourism limits?',
          options: ['To increase crowding', 'To protect local infrastructure and sites', 'To remove all visitors permanently', 'To close historic attractions'],
          answer: 1
        }
      ],
      mcMultipleListening: [
        {
          id: 'mock1_mcml1',
          title: 'Benefits of Public Parks',
          transcript: 'Public parks can improve city life in several ways. They provide space for exercise, offer places for social interaction, and help reduce urban heat. Parks may also support biodiversity by creating habitats for birds, insects, and small animals.',
          question: 'Which benefits of public parks are mentioned?',
          options: ['Exercise space', 'Social interaction', 'Reduced urban heat', 'Cheaper fuel', 'Support for biodiversity'],
          answers: [0, 1, 2, 4]
        }
      ],
      fillBlanksListening: [
        {
          id: 'mock1_fbl1',
          title: 'Water Management',
          transcript: 'Modern water management requires careful planning, efficient infrastructure, and public awareness. In many cities, ageing pipes lead to leakage, while growing populations increase overall demand. Conservation measures, system upgrades, and better monitoring can all improve long-term reliability.',
          blanks: [
            { before: 'Modern water management requires careful ', key: 'planning', after: ', efficient infrastructure' },
            { before: 'ageing pipes lead to ', key: 'leakage', after: ', while growing populations' },
            { before: 'increase overall ', key: 'demand', after: '. Conservation measures' },
            { before: 'better ', key: 'monitoring', after: ' can all improve long-term reliability' }
          ]
        }
      ],
      highlightSummary: [
        {
          id: 'mock1_hcs1',
          title: 'Flexible Learning',
          transcript: 'Flexible learning models allow students to engage with content at different times and in different formats. Supporters say this helps learners balance study with work and family responsibilities, while critics warn that too much flexibility may reduce structure and motivation. Many educators therefore prefer a balanced approach that combines flexibility with regular support and clear expectations.',
          summaries: [
            'Flexible learning can improve access, but many educators prefer a balanced model with support and structure.',
            'Flexible learning should replace all structured teaching because students never need guidance.',
            'Critics believe flexible learning always increases motivation and discipline.'
          ],
          answer: 0
        }
      ],
      selectMissing: [
        {
          id: 'mock1_smw1',
          title: 'Research Ethics',
          transcript: 'Research ethics are designed to protect participants, ensure honesty in reporting, and maintain trust in scientific work. When ethical standards are ignored, the consequences can damage both public confidence and the reliability of future',
          options: ['discoveries', 'vacations', 'advertisements', 'ceremonies'],
          answer: 0
        }
      ],
      highlightIncorrect: [
        {
          id: 'mock1_hi1',
          title: 'Urban Planning',
          transcript: 'Good urban planning can improve mobility, support economic activity, and create healthier environments for residents. It often involves integrating housing, transport, public services, and green space so that cities can grow more sustainably.',
          textWords: ['Good', 'urban', 'planning', 'can', 'improve', 'mobility,', 'support', 'economic', 'activity,', 'and', 'create', 'healthier', 'environments', 'for', 'visitors.', 'It', 'often', 'involves', 'integrating', 'housing,', 'transport,', 'public', 'services,', 'and', 'green', 'space', 'so', 'that', 'cities', 'can', 'grow', 'more', 'slowly.'],
          incorrectIndices: [14, 32]
        }
      ],
      writeDictation: [
        {
          id: 'mock1_wfd1',
          tag: 'Mock Test 1',
          sentence: 'Reliable data is essential for making informed public policy decisions.'
        },
        {
          id: 'mock1_wfd2',
          tag: 'Mock Test 1',
          sentence: 'Students should review feedback carefully before completing the next task.'
        }
      ]
    }
  }
};
