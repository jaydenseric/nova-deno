/**
 * Stops a Nova language client. The Nova `LanguageClient` instance method
 * `stop` doesn’t synchronously stop the language server or return a promise to
 * await when it stops.
 * @param {LanguageClient} languageClient Nova language client.
 * @returns {Promise<void>} Resolves once the language client is stopped, or immediately if it’s already stoped.
 */
async function stopLanguageClient(languageClient) {
  if (!(languageClient instanceof LanguageClient)) {
    throw new TypeError(
      "Argument 1 `languageClient` must be a `LanguageClient` instance.",
    );
  }

  if (!languageClient.stopped) {
    await new Promise((resolve) => {
      const listener = languageClient.onDidStop(() => {
        listener.dispose();
        resolve();
      });

      languageClient.stop();
    });
  }
}

module.exports = stopLanguageClient;
