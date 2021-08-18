const asyncCallback = require("./asyncCallback.js");
const denoFormatTextEditor = require("./denoFormatTextEditor.js");
const notify = require("./notify.js");
const registerCommand = require("./registerCommand.js");
const setNovaGlobalConfigMapEntry = require("./setNovaGlobalConfigMapEntry.js");
const specifierHasUriScheme = require("./specifierHasUriScheme.js");
const resetDenoSuggestImportsHosts = require(
  "./resetDenoSuggestImportsHosts.js",
);
const restartLanguageClient = require("./restartLanguageClient.js");

/**
 * LSP syntax identifiers that the Deno language server supports.
 *
 * Some Nova and Deno language server syntax identifiers conflict; Nova uses
 * `jsx`/`tsx` and Deno uses `javascriptreact`/`typescriptreact`. This extension
 * can’t support JSX and TSX until there’s a solution.
 *
 * - [Nova dev forum discussion](https://devforum.nova.app/t/how-to-workaround-nova-syntax-ids-differing-with-a-language-server/1100).
 */
const denoLspSyntaxes = [
  "javascript",
  "typescript",
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
  "restartDenoLanguageClient",
  () => restartLanguageClient(languageClient),
  "Restart Deno language client error:",
);

registerCommand(
  "resetDenoSuggestImportsHosts",
  () => resetDenoSuggestImportsHosts(),
  "Reset Deno import IntelliSense hosts error:",
);

registerCommand(
  "denoFormatDocument",
  (textEditor) => denoFormatTextEditor(languageClient, textEditor),
  "Deno format document error:",
);

// The Deno language client notifies the server when workspace config values
// change, but not when data changes within files referenced in config values
// as file paths. Such files must be watched for changes to restart the Deno
// language client for it to detect the new file data.

let importMapWatcher;

function updateImportMapWatcher(
  importMap = nova.workspace.config.get("deno.importMap"),
) {
  importMapWatcher?.dispose();

  if (
    importMap &&
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

let tsConfigWatcher;

function updateTsConfigWatcher(
  config = nova.workspace.config.get("deno.config"),
) {
  tsConfigWatcher?.dispose();

  if (config) {
    tsConfigWatcher = nova.fs.watch(
      config,
      asyncCallback(() => resetDenoSuggestImportsHosts()),
    );
  }
}

/**
 * Called when Nova activates the extension.
 */
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
    asyncCallback(async ({
      origin,

      // Does the origin support import IntelliSense.
      suggestions,
    }) => {
      if (suggestions && !pendingDenoSuggestImportsHostUpdates.has(origin)) {
        const hosts = nova.config.get("deno.suggest.imports.hosts");

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
            pendingDenoSuggestImportsHostUpdates.remove(origin);
          }
        }
      }
    }),
  );

  languageClient.start();

  updateImportMapWatcher();

  nova.workspace.config.onDidChange("deno.importMap", updateImportMapWatcher);

  updateTsConfigWatcher();

  nova.workspace.config.onDidChange("deno.config", updateTsConfigWatcher);

  nova.workspace.onDidAddTextEditor((textEditor) => {
    textEditor.onWillSave(asyncCallback(async () => {
      if (
        nova.workspace.config.get("jaydenseric.deno.formatOnSave", "boolean") &&
        denoLspSyntaxes.includes(textEditor.document.syntax)
      ) {
        await denoFormatTextEditor(languageClient, textEditor);
      }
    }));
  });
});
