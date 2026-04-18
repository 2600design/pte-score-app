import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { normalizeQuestionText } from '../utils/normalizeQuestionText.ts';
import {
  compareWithExistingBank,
  type ComparableQuestion,
  type QuestionType,
} from '../utils/questionSimilarity.ts';

type QuestionSource = 'recent_prediction_2026';

type PredictionQuestion = {
  id: string;
  type: QuestionType;
  content: string;
  answer?: string;
  normalized: string;
  source: QuestionSource;
  sourceName: string;
  sourceUrl: string;
  monthTag: string;
  fetchedAt: string;
  frequency: 'high' | 'unknown';
  isPrediction: true;
  isLocked?: boolean;
  status: 'active' | 'review';
};

type ImportBatch = {
  sourceName: string;
  sourceUrl: string;
  monthTag: string;
  type: QuestionType;
  items: Array<{ content: string; answer?: string }>;
};

type PredictionBank = {
  repeatSentence: PredictionQuestion[];
  writeFromDictation: PredictionQuestion[];
  answerShortQuestion: PredictionQuestion[];
  describeImage: PredictionQuestion[];
};

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const QUESTIONS_PATH = path.join(ROOT, 'data', 'questions.js');
const INPUT_PATH = path.join(ROOT, 'data', 'prediction-imports', 'latest-april-2026.json');
const BANK_JSON_PATH = path.join(ROOT, 'data', 'prediction-bank.json');
const BANK_JS_PATH = path.join(ROOT, 'data', 'prediction-bank.js');

function bankKey(type: QuestionType): keyof PredictionBank {
  if (type === 'repeat_sentence') return 'repeatSentence';
  if (type === 'write_from_dictation') return 'writeFromDictation';
  if (type === 'answer_short_question') return 'answerShortQuestion';
  return 'describeImage';
}

async function loadDb(): Promise<any> {
  const raw = await fs.readFile(QUESTIONS_PATH, 'utf8');
  const context: Record<string, unknown> = {};
  vm.runInNewContext(`${raw}; this.__DB__ = DB;`, context);
  return context.__DB__;
}

async function loadPredictionBank(): Promise<PredictionBank> {
  try {
    return JSON.parse(await fs.readFile(BANK_JSON_PATH, 'utf8'));
  } catch (_error) {
    return {
      repeatSentence: [],
      writeFromDictation: [],
      answerShortQuestion: [],
      describeImage: [],
    };
  }
}

function coreQuestionsToComparable(db: any): ComparableQuestion[] {
  return [
    ...(db.repeatSentence || []).map((item: any) => ({
      id: item.id,
      type: 'repeat_sentence' as QuestionType,
      content: item.text,
      normalized: normalizeQuestionText(item.text),
    })),
    ...(db.writeDictation || []).map((item: any) => ({
      id: item.id,
      type: 'write_from_dictation' as QuestionType,
      content: item.sentence,
      normalized: normalizeQuestionText(item.sentence),
    })),
    ...(db.answerShort || []).map((item: any) => ({
      id: item.id,
      type: 'answer_short_question' as QuestionType,
      content: item.question,
      normalized: normalizeQuestionText(item.question),
    })),
  ];
}

function predictionQuestionsToComparable(bank: PredictionBank): ComparableQuestion[] {
  return [
    ...bank.repeatSentence,
    ...bank.writeFromDictation,
    ...bank.answerShortQuestion,
    ...bank.describeImage,
  ].map(item => ({
    id: item.id,
    type: item.type,
    content: item.content,
    normalized: item.normalized,
  }));
}

function nextPredictionId(type: QuestionType, monthTag: string, index: number): string {
  const prefix = type === 'repeat_sentence' ? 'pred-rs' : type === 'write_from_dictation' ? 'pred-wfd' : 'pred-asq';
  return `${prefix}-${monthTag}-${String(index).padStart(3, '0')}`;
}

async function ensureDir(filePath: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function serializeBankForBrowser(bank: PredictionBank): string {
  return `window.PREDICTION_BANK = ${JSON.stringify(bank, null, 2)};\n`;
}

async function main(): Promise<void> {
  const db = await loadDb();
  const bank = await loadPredictionBank();
  const importBatches = JSON.parse(await fs.readFile(INPUT_PATH, 'utf8')) as ImportBatch[];
  const existingQuestions = [
    ...coreQuestionsToComparable(db),
    ...predictionQuestionsToComparable(bank),
  ];

  let totalParsed = 0;
  let exactDuplicates = 0;
  let nearDuplicates = 0;
  let inserted = 0;
  const duplicateItems: Array<Record<string, unknown>> = [];
  const fetchedAt = new Date().toISOString();

  for (const batch of importBatches) {
    const key = bankKey(batch.type);
    const startIndex = bank[key].length + 1;

    batch.items.forEach((item, itemIndex) => {
      totalParsed += 1;
      const normalized = normalizeQuestionText(item.content);
      const candidate: ComparableQuestion = {
        id: nextPredictionId(batch.type, batch.monthTag, startIndex + itemIndex),
        type: batch.type,
        content: item.content,
        normalized,
      };

      const compared = compareWithExistingBank(candidate, existingQuestions);
      if (compared.isDuplicate) {
        if (compared.reason === 'exact') exactDuplicates += 1;
        else nearDuplicates += 1;
        duplicateItems.push({
          type: batch.type,
          content: item.content,
          answer: item.answer || '',
          matchedId: compared.matchedId,
          similarity: compared.similarity,
          reason: compared.reason,
          monthTag: batch.monthTag,
          sourceName: batch.sourceName,
        });
        return;
      }

      const insertedQuestion: PredictionQuestion = {
        id: candidate.id,
        type: batch.type,
        content: item.content,
        answer: item.answer,
        normalized,
        source: 'recent_prediction_2026',
        sourceName: batch.sourceName,
        sourceUrl: batch.sourceUrl,
        monthTag: batch.monthTag,
        fetchedAt,
        frequency: 'high',
        isPrediction: true,
        isLocked: true,
        status: 'review',
      };

      bank[key].push(insertedQuestion);
      existingQuestions.push(candidate);
      inserted += 1;
    });
  }

  const reportMonth = importBatches[0]?.monthTag || fetchedAt.slice(0, 7);
  const reportPath = path.join(ROOT, 'data', 'prediction-imports', 'reports', `${reportMonth}-duplicates.json`);
  await ensureDir(reportPath);
  await fs.writeFile(BANK_JSON_PATH, `${JSON.stringify(bank, null, 2)}\n`);
  await fs.writeFile(BANK_JS_PATH, serializeBankForBrowser(bank));
  await fs.writeFile(reportPath, `${JSON.stringify(duplicateItems, null, 2)}\n`);

  console.log(`Imported latest predictions for ${reportMonth}`);
  console.log(`Parsed: ${totalParsed}`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped exact duplicates: ${exactDuplicates}`);
  console.log(`Skipped near duplicates: ${nearDuplicates}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
