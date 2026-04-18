export function normalizeQuestionText(text: string): string {
  const lower = (text || '')
    .toLowerCase()
    .trim()
    .replace(/\b(a\.m\.|am)\b/g, 'am')
    .replace(/\b(p\.m\.|pm)\b/g, 'pm')
    .replace(/\bnine\b/g, '9')
    .replace(/\beight\b/g, '8')
    .replace(/\bseven\b/g, '7')
    .replace(/\bsix\b/g, '6')
    .replace(/\bfive\b/g, '5')
    .replace(/\bfour\b/g, '4')
    .replace(/\bthree\b/g, '3')
    .replace(/\btwo\b/g, '2')
    .replace(/\bone\b/g, '1')
    .replace(/\bzero\b/g, '0');

  const withoutPunctuation = lower.replace(/[^a-z0-9\s]/g, ' ');
  const collapsed = withoutPunctuation.replace(/\s+/g, ' ').trim();

  return collapsed
    .split(' ')
    .filter(Boolean)
    .filter(token => !['the', 'a', 'an'].includes(token))
    .join(' ');
}
