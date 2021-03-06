// @ts-check
/// <reference path="https://unpkg.com/@types/nova-editor-node@4.1.4/index.d.ts" />

/** @type {typeof import("./setNovaGlobalConfig.js")} */
const setNovaGlobalConfig = require("./setNovaGlobalConfig.js");

/**
 * Sets a Nova global config map entry, creating the map if it doesn’t exist.
 * @param {string} configKey Nova global config key.
 * @param {string} mapKey Map key.
 * @param {unknown} mapValue Map value.
 */
async function setNovaGlobalConfigMapEntry(configKey, mapKey, mapValue) {
  if (typeof configKey !== "string") {
    throw new TypeError("Argument 1 `configKey` must be a string.");
  }

  if (typeof mapKey !== "string") {
    throw new TypeError("Argument 2 `mapKey` must be a string.");
  }

  const map = nova.config.get(configKey) ?? {};
  await setNovaGlobalConfig(configKey, {
    ...map,
    [mapKey]: mapValue,
  });
}

module.exports = setNovaGlobalConfigMapEntry;
