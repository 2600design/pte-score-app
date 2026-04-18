const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const sayPath = '/usr/bin/say';
const afconvertPath = '/usr/bin/afconvert';
const outDir = path.join(__dirname, '..', 'audio', 'retell-lecture');

const items = [
  {
    id: 'rl1',
    text: 'Water is continuously cycled through the environment in a process driven by solar energy. Evaporation from oceans and lakes transforms liquid water into vapor, which rises into the atmosphere. As it cools, condensation forms clouds. Eventually, precipitation returns water to the surface as rain or snow. This cycle regulates global temperatures, distributes fresh water, and sustains all life on Earth.',
  },
  {
    id: 'rl2',
    text: 'The Industrial Revolution, which began in Britain in the late eighteenth century, transformed the way goods were produced. Steam-powered machines replaced manual labour in factories, dramatically increasing output. New transportation networks, including railways and canals, enabled mass distribution. However, urbanization also led to poor living conditions for many factory workers, sparking early labour movements.',
  },
  {
    id: 'rl3',
    text: 'Neuroplasticity refers to the brain\'s remarkable ability to reorganise itself by forming new neural connections throughout life. This capacity allows the brain to compensate for injury or disease and to adjust in response to new situations or changes in the environment. Research has shown that activities such as learning a new language, playing a musical instrument, or regular physical exercise can promote neuroplasticity and help maintain cognitive function into old age.',
  },
  {
    id: 'rl4',
    text: 'Coral reefs are among the most biologically diverse ecosystems on Earth, covering less than one percent of the ocean floor but supporting approximately twenty-five percent of all marine species. They provide vital services including coastal protection, food security, and income from tourism and fisheries for hundreds of millions of people. However, climate change, ocean acidification, and human activities such as overfishing and pollution are rapidly degrading reef systems worldwide.',
  },
  {
    id: 'rl5',
    text: 'Behavioural economics combines insights from psychology and economics to understand how people actually make decisions, as opposed to how traditional economic theory assumes they should. Research in this field has shown that people are subject to cognitive biases, systematic errors in thinking, that lead to choices that may not serve their best interests. These findings have influenced policy design, with governments using nudges to encourage healthier and more financially sound behaviour.',
  },
  {
    id: 'rl6',
    text: 'Renewable energy sources such as solar and wind are intermittent, meaning they do not produce electricity at all times. Energy storage technologies address this problem by capturing excess electricity when production is high and releasing it when demand rises. Batteries are the most widely discussed option, but pumped hydro, thermal storage, and hydrogen systems are also gaining attention. Improving storage capacity is essential if countries are to build reliable low-carbon power systems.',
  },
  {
    id: 'rl7',
    text: 'Language is more than a tool for communication; it is also a marker of identity, culture, and belonging. When minority languages disappear, communities lose not only vocabulary and grammar, but also stories, traditions, and unique ways of understanding the world. Linguists estimate that nearly half of the world\'s languages may disappear within this century unless active preservation efforts are made. Education policy, media representation, and community-led programs all play important roles in language maintenance.',
  },
];

fs.mkdirSync(outDir, { recursive: true });

items.forEach(({ id, text }) => {
  const aiffPath = path.join(outDir, `${id}.aiff`);
  const wavPath = path.join(outDir, `${id}.wav`);

  execFileSync(sayPath, ['-v', 'Daniel', '-o', aiffPath, text], { stdio: 'inherit' });
  execFileSync(afconvertPath, ['-f', 'WAVE', '-d', 'LEI16@22050', aiffPath, wavPath], { stdio: 'inherit' });
  fs.rmSync(aiffPath, { force: true });
});

console.log(`Generated ${items.length} retell-lecture wav files in ${outDir}`);
