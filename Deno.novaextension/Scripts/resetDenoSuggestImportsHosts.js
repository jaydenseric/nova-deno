// @ts-check

/** @type {typeof import("./setNovaGlobalConfig.js")} */
const setNovaGlobalConfig = require("./setNovaGlobalConfig.js");

/**
 * Resets the Nova global config option `deno.suggest.imports.hosts`.
 * @returns {Promise<void>} Resolves once the Nova global config has updated.
 */
async function resetDenoSuggestImportsHosts() {
  await setNovaGlobalConfig("deno.suggest.imports.hosts", {
    "https://deno.land": true,
  });
}

module.exports = resetDenoSuggestImportsHosts;
