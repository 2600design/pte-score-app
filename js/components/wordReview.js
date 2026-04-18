const WordReview = {
  renderTokenRow(tokens, mode, emptyMessage) {
    if (!tokens?.length) {
      return `<div class="word-review-empty">${Scorer.escapeHtml(emptyMessage)}</div>`;
    }

    return tokens
      .map(token => {
        const status = token.status || 'correct';
        const titleMap = {
          correct: 'Correct word',
          missing: 'Missing word',
          mismatched: mode === 'reference' ? 'Expected word was misread' : `Recognised as "${token.text}" instead of "${token.expected || ''}"`,
          extra: 'Extra spoken word',
        };
        const title = titleMap[status] || 'Word';
        return `<span class="word-review-chip ${status}" title="${Scorer.escapeHtml(title)}" aria-label="${Scorer.escapeHtml(title)}">${Scorer.escapeHtml(token.text)}</span>`;
      })
      .join(' ');
  },

  renderLegend() {
    return `
<div class="word-review-legend" aria-label="Word review legend">
  <span class="word-review-legend-item"><span class="word-review-dot missing"></span>Missing</span>
  <span class="word-review-legend-item"><span class="word-review-dot mismatched"></span>Misread</span>
  <span class="word-review-legend-item"><span class="word-review-dot extra"></span>Extra</span>
</div>`;
  },

  renderSummary(summary) {
    return `<div class="word-review-summary">${summary.missingCount} missing words · ${summary.mismatchCount} misread phrases · ${summary.extraCount} extra words</div>`;
  },

  render(diff, options = {}) {
    if (!diff) return '';
    const transcriptEmpty = !options.transcriptText || !String(options.transcriptText).trim();
    const extraRow = diff.extraWords.length
      ? `<div class="word-review-extra-row"><strong>Extra words detected</strong><span>${Scorer.escapeHtml(diff.extraWords.join(', '))}</span></div>`
      : '';

    return `
<div class="card speaking-result-card word-review-card" style="animation-delay:.12s">
  <div class="word-review-header">
    <div>
      <div class="card-title">Word-level review</div>
      ${this.renderSummary(diff.summary)}
    </div>
    ${this.renderLegend()}
  </div>
  <div class="word-review-block">
    <div class="word-review-label">Reference text</div>
    <div class="word-review-line">${this.renderTokenRow(diff.referenceTokens, 'reference', 'Reference text unavailable.')}</div>
  </div>
  <div class="word-review-block">
    <div class="word-review-label">Recognised transcript</div>
    <div class="word-review-line transcript">${transcriptEmpty
      ? '<div class="word-review-empty">No speech was clearly recognised in this attempt.</div>'
      : this.renderTokenRow(diff.transcriptTokens, 'transcript', 'No transcript available.')}</div>
  </div>
  ${extraRow}
</div>`;
  },
};

window.WordReview = WordReview;
