const Queue = require("./Queue.js");
const stopLanguageClient = require("./stopLanguageClient.js");

const restartLanguageClientQueue = new Queue();

/**
 * Restarts a Nova language client, making sure multiple restarts queue.
 * @param {LanguageClient} The Nova language client to restart.
 * @returns {Promise<void>} Resolves once the restart finishes.
 */
async function restartLanguageClient(languageClient) {
  if (!(languageClient instanceof LanguageClient)) {
    throw new TypeError(
      "Argument 1 `languageClient` must be a `LanguageClient` instance.",
    );
  }

  await restartLanguageClientQueue.add(async () => {
    await stopLanguageClient(languageClient);

    if (languageClient.running) {
      throw new Error("Language client failed to stop.");
    }

    languageClient.start();

    if (!languageClient.running) {
      throw new Error("Language client failed to start.");
    }
  });
}

module.exports = restartLanguageClient;
