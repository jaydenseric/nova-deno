/**
 * Reports an error to the Nova extension console.
 * @param {Any} error Error.
 * @param {string} [description="Error"] Description of the context.
 */
function reportError(error, description = "Error") {
  let message = `${description}:\n\n${error}`;
  if (error instanceof Error) message += `\n\n${error.stack}`;
  console.error(message);
}

module.exports = reportError;
