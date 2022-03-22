// @ts-check
/// <reference path="https://unpkg.com/@types/nova-editor-node@4.1.4/index.d.ts" />

/** @type {typeof import("./Defer.js")} */
const Defer = require("./Defer.js");

const globalConfigFilePath =
  `${nova.extension.globalStoragePath}/../../UserConfiguration.json`;

/**
 * Sets a Nova global config entry for a value with a type that that isn’t
 * settable via `nova.config.set`.
 * @param {string} configKey Nova global config key.
 * @param {unknown} configValue Nova global config value.
 */
async function setNovaGlobalConfig(configKey, configValue) {
  if (typeof configKey !== "string") {
    throw new TypeError("Argument 1 `configKey` must be a string.");
  }

  /** @type {{ [key: string]: unknown }} */
  let oldConfig = {};

  if (
    // Does the global config file exist yet? Nova creates it the first time
    // global config is set.
    nova.fs.stat(globalConfigFilePath)
  ) {
    const oldFile = nova.fs.open(globalConfigFilePath);
    const oldJson = oldFile.read();

    oldFile.close();

    if (typeof oldJson !== "string") {
      throw new TypeError("Nova global config read error.");
    }

    oldConfig = JSON.parse(oldJson);

    if (typeof oldConfig !== "object" || !oldConfig) {
      throw new TypeError("Nova global config data invalid.");
    }
  }

  const newConfigJson = JSON.stringify(
    {
      ...oldConfig,
      [configKey]: configValue,
    },
    null,
    2,
  );

  const { promise: changed, resolve: resolveChanged } = new Defer();

  const listener = nova.config.onDidChange(configKey, (newValue) => {
    if (JSON.stringify(newValue, null, 2) === newConfigJson) resolveChanged();
  });
  const newFile =
    // The file will be created if it‘s missing.
    nova.fs.open(globalConfigFilePath, "w");

  newFile.write(newConfigJson + "\n");
  newFile.close();

  await changed;

  listener.dispose();
}

module.exports = setNovaGlobalConfig;
