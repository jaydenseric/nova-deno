// @ts-check
/// <reference path="https://unpkg.com/@types/nova-editor-node@4.1.4/index.d.ts" />

/** @type {typeof import("./lspRangeToNovaRange.js")} */
const lspRangeToNovaRange = require("./lspRangeToNovaRange.js");

/**
 * Applies LSP text document edits to a Nova text editor.
 *
 * - [Inspiration](https://github.com/apexskier/nova-typescript/blob/7d47a5e5c798e91bf2a06f808868ec71fa6e94be/src/applyLSPEdits.ts#L4-L14).
 * @param {TextEditor} textEditor Nova text editor.
 * @param {Array<import("./types.js").LspTextEdit>} lspTextEdits LSP text document edits.
 * @returns {Promise<void>} Resolves once the Nova text editor accepts or rejects the edits.
 */
async function applyLspTextEdits(textEditor, lspTextEdits) {
  if (!TextEditor.isTextEditor(textEditor)) {
    throw new TypeError(
      "Argument 1 `textEditor` must be a `TextEditor` instance.",
    );
  }

  if (!Array.isArray(lspTextEdits)) {
    throw new TypeError(
      "Argument 2 `lspTextEdits` must be an array.",
    );
  }

  await textEditor.edit((textEditorEdit) => {
    for (const { range, newText } of lspTextEdits.reverse()) {
      textEditorEdit.replace(
        lspRangeToNovaRange(textEditor.document, range),
        newText,
      );
    }
  });
}

module.exports = applyLspTextEdits;
