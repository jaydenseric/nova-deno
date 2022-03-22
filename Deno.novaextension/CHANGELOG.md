# Nova Deno extension changelog

## Next

### Patch

- Added VS Code config to the project.
- Stopped using Deno `unstable` mode for the project.
- Added a project import map, used for tests.
- Updated the Deno `std` version used in tests.
- Added `@ts-check` comments to modules, referenced
  [`@types/nova-editor-node`](https://npm.im/@types/nova-editor-node), and fixed
  various issues revealed by TypeScript.
- Changed the test module file extensions from `.js` to `.mjs`.
- Use a new class `Defer` to streamline deferred promises in both the
  implementation and tests.
- The extension now creates a missing global config file during initialization
  or running certain commands, instead of hanging or erroring.

## 1.2.2

### Patch

- Removed the readme warning that document changes can be lost if Nova crashes
  (particularly when formatting on save) as Nova
  [v7.3](https://nova.app/releases/#v7.3) is more stable, closing
  [#3](https://github.com/jaydenseric/nova-deno/issues/3).

## 1.2.1

### Patch

- Documented the minimum required Deno version (v1.13.2).

## 1.2.0

### Minor

- Added support for JSX and TSX syntax, fixing
  [#1](https://github.com/jaydenseric/nova-deno/issues/1).

### Patch

- Updated dev dependencies.

## 1.1.0

### Minor

- Implemented the `deno.cache` “Deno cache” command, progressing
  [#5](https://github.com/jaydenseric/nova-deno/issues/5).

### Patch

- Updated issue information in the extension readme and source comments.

## 1.0.2

### Patch

- Removed Deno language server code lens related workspace configuration as Nova
  doesn’t appear to support code lens.

## 1.0.1

### Patch

- Uppercased the extension readme and changelog file names to conform to Nova
  extension conventions so the contents will display in the Nova extension
  library.

## 1.0.0

Initial release.
