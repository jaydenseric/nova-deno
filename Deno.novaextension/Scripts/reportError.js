// @ts-check
/// <reference path="https://unpkg.com/@types/nova-editor-node@4.1.4/index.d.ts" />

/**
 * Reports an error to the Nova extension console.
 * @param {unknown} error Error.
 * @param {string} [description] Description of the context. Defaults to
 *   `"Error"`.
 */
function reportError(error, description = "Error") {
  let message = `${description}:\n\n${error}`;
  if (error instanceof Error) message += `\n\n${error.stack}`;

  // @ts-ignore `@types/nova-editor-node` incorrectly doesn’t define the
  // `console` global.
  console.error(message);
}

module.exports = reportError;
