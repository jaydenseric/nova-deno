/**
 * Converts a LSP text document range to a Nova text document range.
 *
 * LSP text document ranges are line and column based, whereas Nova ones are
 * character index based. Hopefully in the future Nova will have a way to use
 * either style, or convert between the two.
 *
 * - [Nova feature request](https://devforum.nova.app/t/feature-request-for-languageclient-expose-the-api-that-nova-already-uses-to-convert-line-character-into-nova-ranges-possible-duplicate-of-601/758).
 * - [Inspiration](https://github.com/apexskier/nova-typescript/blob/7d47a5e5c798e91bf2a06f808868ec71fa6e94be/src/lspNovaConversions.ts#L29-L50).
 * @param {TextDocument} textDocument Nova text document.
 * @param {import("./types.js").LspRange} lspRange LSP text document range.
 * @returns {Range} Nova text document range.
 */
function lspRangeToNovaRange(textDocument, lspRange) {
  // Nova doesn’t expose `TextDocument` as a global for an `instanceof` check.
  if (typeof lspRange !== "object") {
    throw new TypeError("Argument 1 `textDocument` must be an object.");
  }

  if (typeof lspRange !== "object") {
    throw new TypeError("Argument 2 `lspRange` must be an object.");
  }

  let novaRangeStart = 0;
  let novaRangeEnd = 0;
  let chars = 0;

  const fullContents = textDocument.getTextInRange(
    new Range(0, textDocument.length),
  );
  const lines = fullContents.split(textDocument.eol);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineLength = lines[lineIndex].length + textDocument.eol.length;

    if (lspRange.start.line === lineIndex) {
      novaRangeStart = chars + lspRange.start.character;
    }

    if (lspRange.end.line === lineIndex) {
      novaRangeEnd = chars + lspRange.end.character;
      break;
    }

    chars += lineLength;
  }

  return new Range(novaRangeStart, novaRangeEnd);
}

module.exports = lspRangeToNovaRange;
