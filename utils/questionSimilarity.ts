import { normalizeQuestionText } from './normalizeQuestionText.ts';

export type QuestionType =
  | 'repeat_sentence'
  | 'write_from_dictation'
  | 'answer_short_question'
  | 'describe_image';

export type ComparableQuestion = {
  id: string;
  type: QuestionType;
  content: string;
  normalized?: string;
};

export function levenshteinSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  const distance = matrix[rows - 1][cols - 1];
  return 1 - distance / Math.max(a.length, b.length);
}

export function diceCoefficient(a: string, b: string): number {
  const aTokens = a.split(' ').filter(Boolean);
  const bTokens = b.split(' ').filter(Boolean);
  if (!aTokens.length || !bTokens.length) return 0;

  const aCounts = new Map<string, number>();
  aTokens.forEach(token => aCounts.set(token, (aCounts.get(token) || 0) + 1));

  let overlap = 0;
  bTokens.forEach(token => {
    const count = aCounts.get(token) || 0;
    if (count > 0) {
      overlap += 1;
      aCounts.set(token, count - 1);
    }
  });

  return (2 * overlap) / (aTokens.length + bTokens.length);
}

export function questionSimilarity(a: string, b: string): number {
  const normalizedA = normalizeQuestionText(a);
  const normalizedB = normalizeQuestionText(b);
  return Math.max(
    levenshteinSimilarity(normalizedA, normalizedB),
    diceCoefficient(normalizedA, normalizedB),
  );
}

export function compareWithExistingBank(
  newQuestion: ComparableQuestion,
  existingQuestions: ComparableQuestion[],
): { isDuplicate: boolean; matchedId?: string; similarity?: number; reason?: 'exact' | 'near' } {
  const normalizedNew = newQuestion.normalized || normalizeQuestionText(newQuestion.content);

  let bestMatch: { id: string; similarity: number; reason: 'exact' | 'near' } | null = null;

  for (const existing of existingQuestions) {
    if (existing.type !== newQuestion.type) continue;
    const normalizedExisting = existing.normalized || normalizeQuestionText(existing.content);

    if (normalizedExisting === normalizedNew) {
      return { isDuplicate: true, matchedId: existing.id, similarity: 1, reason: 'exact' };
    }

    const similarity = questionSimilarity(normalizedNew, normalizedExisting);
    if (similarity > 0.85 && (!bestMatch || similarity > bestMatch.similarity)) {
      bestMatch = { id: existing.id, similarity, reason: 'near' };
    }
  }

  if (bestMatch) {
    return {
      isDuplicate: true,
      matchedId: bestMatch.id,
      similarity: bestMatch.similarity,
      reason: bestMatch.reason,
    };
  }

  return { isDuplicate: false };
}
