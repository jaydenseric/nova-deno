# Nova Deno extension changelog

## Next

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
