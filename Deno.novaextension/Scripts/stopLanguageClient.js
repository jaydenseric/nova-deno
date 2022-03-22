// @ts-check
/// <reference path="https://unpkg.com/@types/nova-editor-node@4.1.4/index.d.ts" />

/**
 * Stops a Nova language client. The Nova `LanguageClient` instance method
 * `stop` doesn’t synchronously stop the language server or return a promise to
 * await when it stops.
 * @param {LanguageClient} languageClient Nova language client.
 * @returns {Promise<void>} Resolves once the language client is stopped, or
 *   immediately if it’s already stopped.
 */
async function stopLanguageClient(languageClient) {
  if (!(languageClient instanceof LanguageClient)) {
    throw new TypeError(
      "Argument 1 `languageClient` must be a `LanguageClient` instance.",
    );
  }

  if (languageClient.running) {
    await /** @type {Promise<void>} */ (new Promise((resolve) => {
      const listener = languageClient.onDidStop(() => {
        listener.dispose();
        resolve();
      });

      languageClient.stop();
    }));
  }
}

module.exports = stopLanguageClient;
