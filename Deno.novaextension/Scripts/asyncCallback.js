const reportError = require("./reportError.js");

/**
 * Wraps an async callback function to ensure it’s errors are reported, to avoid
 * a silent failure when using an async callback with a Nova function expecting
 * a sync callback.
 * @param {function} callback Callback to wrap.
 * @returns {function} Wrapped callback.
 */
function asyncCallback(callback) {
  if (typeof callback !== "function") {
    throw new TypeError("Argument 1 `callback` must be a function.");
  }

  return async function callbackWithErrorReporting(...args) {
    try {
      return await callback(...args);
    } catch (error) {
      reportError(error);
    }
  };
}

module.exports = asyncCallback;
