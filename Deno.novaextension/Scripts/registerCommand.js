// @ts-check
/// <reference path="https://unpkg.com/@types/nova-editor-node@4.1.4/index.d.ts" />

/** @type {typeof import("./asyncCallback.js")} */
const asyncCallback = require("./asyncCallback.js");

/** @type {typeof import("./notify.js")} */
const notify = require("./notify.js");

/**
 * Registers a Nova command.
 * @param {string} identifier Nova command identifier, also used in the Nova
 *   notification identifier if the Nova command callback errors.
 * @param {function} callback Nova command callback.
 * @param {string} errorDescription Error description for use in the Nova
 *   notification body text if the Nova command callback errors. Shouldn’t be
 *   dynamic as it’s localized.
 */
function registerCommand(identifier, callback, errorDescription) {
  if (typeof identifier !== "string") {
    throw new TypeError("Argument 1 `identifier` must be a string.");
  }

  if (typeof callback !== "function") {
    throw new TypeError("Argument 2 `callback` must be a function.");
  }

  if (typeof errorDescription !== "string") {
    throw new TypeError("Argument 3 `errorDescription` must be a string.");
  }

  nova.commands.register(
    identifier,
    asyncCallback(async (...args) => {
      try {
        await callback(...args);
      } catch (error) {
        await notify(
          `${identifier}.notifications.error`,
          nova.localize("Command error"),
          `${nova.localize(errorDescription)}\n\n${error}`,
        );
      }
    }),
  );
}

module.exports = registerCommand;
