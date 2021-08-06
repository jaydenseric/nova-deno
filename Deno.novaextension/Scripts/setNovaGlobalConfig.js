const globalConfigFilePath =
  `${nova.extension.globalStoragePath}/../../UserConfiguration.json`;

/**
 * Sets a Nova global config entry for a value with a type that that isn’t
 * settable via `nova.config.set`.
 * @param {string} configKey Nova global config key.
 * @param {Any} configValue Nova global config value.
 */
async function setNovaGlobalConfig(configKey, configValue) {
  if (typeof configKey !== "string") {
    throw new TypeError("Argument 1 `configKey` must be a string.");
  }

  const oldFile = nova.fs.open(globalConfigFilePath);
  const config = JSON.parse(oldFile.read());

  oldFile.close();

  const newConfigJson = JSON.stringify(
    {
      ...config,
      [configKey]: configValue,
    },
    null,
    2,
  );

  let resolveChanged;

  const changed = new Promise((resolve) => {
    resolveChanged = resolve;
  });
  const listener = nova.config.onDidChange(configKey, (newValue) => {
    if (JSON.stringify(newValue, null, 2) === newConfigJson) resolveChanged();
  });
  const newFile = nova.fs.open(globalConfigFilePath, "w");

  newFile.write(newConfigJson + "\n");
  newFile.close();

  await changed;

  listener.dispose();
}

module.exports = setNovaGlobalConfig;
