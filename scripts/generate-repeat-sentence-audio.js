const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const questionsPath = path.join(projectRoot, 'data', 'questions.js');
const outputDir = path.join(projectRoot, 'audio', 'repeat-sentence');
const voice = process.env.RS_VOICE || 'Daniel';

function loadDb() {
  const source = fs.readFileSync(questionsPath, 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${source}\nthis.__DB__ = DB;`, context, { filename: 'questions.js' });
  return context.__DB__;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function generateFile(item) {
  const tmpAiff = path.join(outputDir, `${item.id}.aiff`);
  const outWav = path.join(outputDir, `${item.id}.wav`);
  execFileSync('/usr/bin/say', ['-v', voice, '-o', tmpAiff, item.text], { stdio: 'inherit' });
  execFileSync('/usr/bin/afconvert', ['-f', 'WAVE', '-d', 'LEI16@22050', tmpAiff, outWav], { stdio: 'inherit' });
  fs.rmSync(tmpAiff, { force: true });
}

function main() {
  const db = loadDb();
  const items = Array.isArray(db.repeatSentence) ? db.repeatSentence : [];
  if (!items.length) {
    throw new Error('No repeatSentence items found in data/questions.js');
  }

  ensureDir(outputDir);
  console.log(`Generating ${items.length} Repeat Sentence audio files with voice "${voice}"...`);
  items.forEach(generateFile);
  console.log(`Done. Files written to ${outputDir}`);
}

main();
