const applyLspTextEdits = require("./applyLspTextEdits.js");

/**
 * Deno formats a Nova text editor document.
 * @param {LanguageClient} languageClient Nova language client.
 * @param {TextEditor} textEditor Nova text editor.
 * @returns {Promise<void>} Resolves once the text editor document has been Deno formatted.
 */
async function denoFormatTextEditor(languageClient, textEditor) {
  if (!(languageClient instanceof LanguageClient)) {
    throw new TypeError(
      "Argument 1 `languageClient` must be a `LanguageClient` instance.",
    );
  }

  if (!TextEditor.isTextEditor(textEditor)) {
    throw new TypeError(
      "Argument 2 `textEditor` must be a `TextEditor` instance.",
    );
  }

  const textEdits = await languageClient.sendRequest(
    "textDocument/formatting",
    {
      textDocument: {
        uri: textEditor.document.uri,
      },
      options: {
        insertSpaces: textEditor.softTabs === 1,
        tabSize: textEditor.tabLength,
      },
    },
  );

  if (textEdits) await applyLspTextEdits(textEditor, textEdits);
}

module.exports = denoFormatTextEditor;
