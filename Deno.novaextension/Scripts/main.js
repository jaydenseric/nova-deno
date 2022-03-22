// @ts-check
/// <reference path="https://unpkg.com/@types/nova-editor-node@4.1.4/index.d.ts" />

/** @type {typeof import("./asyncCallback.js")} */
const asyncCallback = require("./asyncCallback.js");

/** @type {typeof import("./denoFormatTextEditor.js")} */
const denoFormatTextEditor = require("./denoFormatTextEditor.js");

/** @type {typeof import("./notify.js")} */
const notify = require("./notify.js");

/** @type {typeof import("./registerCommand.js")} */
const registerCommand = require("./registerCommand.js");

/** @type {typeof import("./setNovaGlobalConfigMapEntry.js")} */
const setNovaGlobalConfigMapEntry = require("./setNovaGlobalConfigMapEntry.js");

/** @type {typeof import("./specifierHasUriScheme.js")} */
const specifierHasUriScheme = require("./specifierHasUriScheme.js");

/** @type {typeof import("./resetDenoSuggestImportsHosts.js")} */
const resetDenoSuggestImportsHosts = require(
  "./resetDenoSuggestImportsHosts.js",
);

/** @type {typeof import("./restartLanguageClient.js")} */
const restartLanguageClient = require("./restartLanguageClient.js");

/**
 * LSP syntax identifiers supported by both Nova and the Deno language server.
 * Note that Nova uses `jsx`/`tsx` whereas the LSP recommends
 * `javascriptreact`/`typescriptreact`.
 *
 * - [LSP specification recommended syntax identifies](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocumentItem).
 */
const denoLspSyntaxes = [
  "javascript",
  "jsx",
  "typescript",
  "tsx",
  "json",
  "markdown",
];

/**
 * Register of hosts discovered to support Import IntelliSense that are pending
 * a user decision to enable or disable, via a notification. This is used to
 * prevent duplicate notifications per host.
 * @type {Set<string>}
 */
const pendingDenoSuggestImportsHostUpdates = new Set();

/**
 * The Deno language client.
 * @type {LanguageClient}
 */
let languageClient;

registerCommand(
  "jaydenseric.deno.commands.restartDenoLanguageClient",
  () => restartLanguageClient(languageClient),
  "Restart Deno language client error:",
);

registerCommand(
  "jaydenseric.deno.commands.resetDenoSuggestImportsHosts",
  () => resetDenoSuggestImportsHosts(),
  "Reset Deno import IntelliSense hosts error:",
);

// This command can be triggered either directly by the user (e.g. via the Nova
// command palette), or by the Deno language server when the user activates the
// Deno cache code action on an uncached import. The latter way isn’t working,
// likely due to a Nova bug, see:
// https://github.com/jaydenseric/nova-deno/issues/5
// See: https://deno.land/manual/language_server/overview#commands
registerCommand(
  "deno.cache",
  /**
   * @param {TextEditor} textEditor
   * @param {string} [uri] The import module specifier URI to cache, provided by
   *   the Deno language server when this command is triggered via the Deno
   *   cache code action.
   */
  async (textEditor, uri) => {
    // See: https://deno.land/manual/language_server/overview#requests
    const params = {
      referrer: { uri: textEditor.document.uri },
      /** @type {Array<{ uri: string }>} */
      uris: [],
    };

    if (uri) params.uris.push({ uri });

    // The Deno language server responds to `deno/cache` requests the same if
    // the caching succeeds or fails (e.g. due to no internet connection),
    // meaning the user can’t be notified of caching errors. See:
    // https://github.com/denoland/deno/issues/11796
    await languageClient.sendRequest("deno/cache", params);
  },
  "Deno cache error:",
);

registerCommand(
  "jaydenseric.deno.commands.denoFormatDocument",
  /** @param {TextEditor} textEditor */
  (textEditor) => denoFormatTextEditor(languageClient, textEditor),
  "Deno format document error:",
);

// The Deno language client notifies the server when workspace config values
// change, but not when data changes within files referenced in config values
// as file paths. Such files must be watched for changes to restart the Deno
// language client for it to detect the new file data.

/** @type {FileSystemWatcher} */
let importMapWatcher;

/**
 * @param {ConfigurationValue | null} [importMap] Source of an import map for
 *   the project JavaScript and TypeScript modules; a URL or an absolute or
 *   project relative file path.
 */
function updateImportMapWatcher(
  importMap = nova.workspace.config.get("deno.importMap"),
) {
  importMapWatcher?.dispose();

  if (
    typeof importMap === "string" &&
    // The config `deno.importMap` can be a local file path or a remote URL.
    // Only a local file can be watched for changes to the contents.
    !specifierHasUriScheme(importMap)
  ) {
    importMapWatcher = nova.fs.watch(
      importMap,
      asyncCallback(() => restartLanguageClient(languageClient)),
    );
  }
}

/** @type {FileSystemWatcher} */
let tsConfigWatcher;

/**
 * @param {ConfigurationValue | null} [config] Source of a TypeScript config
 *   JSON file for the project JavaScript and TypeScript modules; an absolute or
 *   project relative file path.
 */
function updateTsConfigWatcher(
  config = nova.workspace.config.get("deno.config"),
) {
  tsConfigWatcher?.dispose();

  if (typeof config === "string") {
    tsConfigWatcher = nova.fs.watch(
      config,
      asyncCallback(() => resetDenoSuggestImportsHosts()),
    );
  }
}

/** Called when Nova activates the extension. */
exports.activate = asyncCallback(async () => {
  if (!nova.config.get("deno.suggest.imports.hosts")) {
    await resetDenoSuggestImportsHosts();
  }

  languageClient = new LanguageClient(
    "jaydenseric.deno.denoLanguageClient",
    "Deno language server",
    {
      path: "/usr/bin/env",
      args: [
        "deno",
        "lsp",

        // Ensure only actual errors are printed to stderr. By default, the
        // command prints diagnostic messages to stderr.
        "--quiet",
      ],
    },
    {
      syntaxes: denoLspSyntaxes,
      initializationOptions: {
        enable: nova.workspace.config.get("deno.enable", "boolean"),
        unstable: nova.workspace.config.get("deno.unstable", "boolean"),
        lint: nova.workspace.config.get("deno.lint", "boolean"),
        importMap: nova.workspace.config.get("deno.importMap", "string"),
        config: nova.workspace.config.get("deno.config", "string"),
        suggest: {
          completeFunctionCalls: nova.workspace.config.get(
            "deno.suggest.completeFunctionCalls",
            "boolean",
          ),
          names: nova.workspace.config.get("deno.suggest.names", "boolean"),
          path: nova.workspace.config.get("deno.suggest.path", "boolean"),
          autoImports: nova.workspace.config.get(
            "deno.suggest.autoImports",
            "boolean",
          ),
          imports: {
            autoDiscover: nova.workspace.config.get(
              "deno.suggest.imports.autoDiscover",
              "boolean",
            ),
            hosts: nova.config.get("deno.suggest.imports.hosts"),
          },
        },
      },
    },
  );

  languageClient.onDidStop(asyncCallback(async (error) => {
    if (error) {
      const { actionIdx } = await notify(
        "jaydenseric.deno.notifications.denoLanguageClientCrashed",
        nova.localize("Deno language client crashed"),
        error.message,
        [
          nova.localize("Restart"),
          nova.localize("Config"),
          nova.localize("Ignore"),
        ],
      );

      switch (actionIdx) {
        case 0: {
          await restartLanguageClient(languageClient);
          break;
        }
        case 1: {
          nova.workspace.openConfig();
          break;
        }
      }
    }
  }));

  languageClient.onNotification(
    "deno/registryState",
    asyncCallback(
      /**
       * @see https://deno.land/manual/language_server/overview#notifications
       * @param {object} params
       * @param {string} params.origin Origin.
       * @param {boolean} params.suggestions Does the origin support import
       *   IntelliSense.
       */
      async ({ origin, suggestions }) => {
        if (suggestions && !pendingDenoSuggestImportsHostUpdates.has(origin)) {
          /** @type {{ [key: string]: boolean } | null} */
          // @ts-ignore Nova and `@types/nova-editor-node` don’t support map
          // data structures in config.
          const hosts = nova.config.get("deno.suggest.imports.hosts");

          if (typeof hosts !== "object" || Array.isArray(hosts)) {
            throw new TypeError(
              "Config `deno.suggest.imports.hosts` must be a map.",
            );
          }

          if (!hosts || !(origin in hosts)) {
            pendingDenoSuggestImportsHostUpdates.add(origin);

            try {
              if (suggestions) {
                const { actionIdx } = await notify(
                  "jaydenseric.deno.notifications.importIntellisenseAvailable",
                  nova.localize("Import IntelliSense available for host"),
                  origin,
                  [
                    nova.localize("Enable"),
                    nova.localize("Disable"),
                  ],
                );

                await setNovaGlobalConfigMapEntry(
                  "deno.suggest.imports.hosts",
                  origin,
                  actionIdx === 0,
                );
              }
            } finally {
              pendingDenoSuggestImportsHostUpdates.delete(origin);
            }
          }
        }
      },
    ),
  );

  languageClient.start();

  updateImportMapWatcher();

  nova.workspace.config.onDidChange("deno.importMap", updateImportMapWatcher);

  updateTsConfigWatcher();

  nova.workspace.config.onDidChange("deno.config", updateTsConfigWatcher);

  nova.workspace.onDidAddTextEditor((textEditor) => {
    textEditor.onWillSave(asyncCallback(async () => {
      if (
        // The document has a syntax and isn’t plain text.
        textEditor.document.syntax &&
        // Format on save config is enabled.
        nova.workspace.config.get("jaydenseric.deno.formatOnSave", "boolean") &&
        // Deno LSP supports the syntax.
        denoLspSyntaxes.includes(textEditor.document.syntax)
      ) {
        await denoFormatTextEditor(languageClient, textEditor);
      }
    }));
  });
});
