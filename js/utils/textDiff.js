const TextDiff = {
  normalizeWord(word) {
    return String(word || '')
      .trim()
      .toLowerCase()
      .replace(/^[^a-z0-9']+|[^a-z0-9']+$/gi, '');
  },

  tokenize(text) {
    return String(text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(token => ({
        text: token,
        normalized: this.normalizeWord(token),
      }))
      .filter(token => token.normalized);
  },

  buildLcsTable(reference, transcript) {
    const rows = reference.length + 1;
    const cols = transcript.length + 1;
    const table = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = reference.length - 1; i >= 0; i -= 1) {
      for (let j = transcript.length - 1; j >= 0; j -= 1) {
        if (reference[i].normalized === transcript[j].normalized) {
          table[i][j] = 1 + table[i + 1][j + 1];
        } else {
          table[i][j] = Math.max(table[i + 1][j], table[i][j + 1]);
        }
      }
    }

    return table;
  },

  compareText(referenceText, transcriptText) {
    const reference = this.tokenize(referenceText);
    const transcript = this.tokenize(transcriptText);
    const table = this.buildLcsTable(reference, transcript);
    const referenceTokens = [];
    const transcriptTokens = [];
    const missingWords = [];
    const extraWords = [];
    const mismatchedPairs = [];

    let i = 0;
    let j = 0;

    while (i < reference.length && j < transcript.length) {
      if (reference[i].normalized === transcript[j].normalized) {
        referenceTokens.push({ text: reference[i].text, status: 'correct' });
        transcriptTokens.push({ text: transcript[j].text, status: 'correct' });
        i += 1;
        j += 1;
        continue;
      }

      const skipReference = table[i + 1][j];
      const skipTranscript = table[i][j + 1];

      if (skipReference === skipTranscript) {
        referenceTokens.push({ text: reference[i].text, status: 'mismatched' });
        transcriptTokens.push({
          text: transcript[j].text,
          status: 'mismatched',
          expected: reference[i].text,
        });
        mismatchedPairs.push({ expected: reference[i].text, actual: transcript[j].text });
        i += 1;
        j += 1;
      } else if (skipReference > skipTranscript) {
        referenceTokens.push({ text: reference[i].text, status: 'missing' });
        missingWords.push(reference[i].text);
        i += 1;
      } else {
        transcriptTokens.push({ text: transcript[j].text, status: 'extra' });
        extraWords.push(transcript[j].text);
        j += 1;
      }
    }

    while (i < reference.length) {
      referenceTokens.push({ text: reference[i].text, status: 'missing' });
      missingWords.push(reference[i].text);
      i += 1;
    }

    while (j < transcript.length) {
      transcriptTokens.push({ text: transcript[j].text, status: 'extra' });
      extraWords.push(transcript[j].text);
      j += 1;
    }

    return {
      referenceTokens,
      transcriptTokens,
      summary: {
        missingCount: missingWords.length,
        mismatchCount: mismatchedPairs.length,
        extraCount: extraWords.length,
      },
      missingWords,
      extraWords,
      mismatchedPairs,
    };
  },
};

window.TextDiff = TextDiff;
window.TextCompare = TextDiff;
