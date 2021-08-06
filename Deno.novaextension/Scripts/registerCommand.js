const asyncCallback = require("./asyncCallback.js");
const notify = require("./notify.js");

/**
 * Registers a Nova command.
 * @param {string} id ID for the command for use in the Nova notification identifier if the Nova command callback errors.
 * @param {function} callback Nova command callback.
 * @param {string} errorDescription Error description for use in the Nova notification body text if the Nova command callback errors. Shouldn’t be dynamic as it’s localized.
 */
function registerCommand(id, callback, errorDescription) {
  if (typeof id !== "string") {
    throw new TypeError("Argument 1 `id` must be a string.");
  }

  if (typeof callback !== "function") {
    throw new TypeError("Argument 2 `callback` must be a function.");
  }

  if (typeof errorDescription !== "string") {
    throw new TypeError("Argument 3 `errorDescription` must be a string.");
  }

  nova.commands.register(
    `jaydenseric.deno.commands.${id}`,
    asyncCallback(async (...args) => {
      try {
        await callback(...args);
      } catch (error) {
        await notify(
          `jaydenseric.deno.notifications.commands.${id}.error`,
          nova.localize("Command error"),
          `${nova.localize(errorDescription)}\n\n${error}`,
        );
      }
    }),
  );
}

module.exports = registerCommand;
