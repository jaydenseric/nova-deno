# Nova Deno extension

A [Nova][Nova] editor extension that integrates the [Deno][Deno]
JavaScript/[TypeScript][TypeScript] [runtime](https://deno.land/manual/runtime)
and [tools](https://deno.land/manual/tools).

## Usage

The [Deno language server][Deno language server] enhances editing for the
following syntaxes in various ways (all support format on save, but a subset
support linting, type checking, and IntelliSense), depending on the
configuration:

- JavaScript
- [TypeScript][TypeScript]
- JSON
- Markdown

JSX and TSX will be supported once
[the issue of Nova using non-standard LSP syntax
identifiers](https://devforum.nova.app/t/how-to-workaround-nova-syntax-ids-differing-with-a-language-server/1100)
is resolved.

> **⚠️ Warning:** [Nova][Nova] and the
> [Deno language server][Deno language server] are unstable. Document changes
> can be lost if [Nova][Nova] crashes,
> [particularly when formatting on save](https://devforum.nova.app/t/texteditoredit-replace-causing-hard-crashes-in-nova-7-2/1093).

### Import IntelliSense

The [Deno language server][Deno language server] can provide
JavaScript/[TypeScript] import IntelliSense if the imported module host serves
`/.well-known/deno-import-intellisense.json` and implements the necessary API
endpoints.

Import IntelliSense is enabled or disabled per host in the global configuration
option `deno.suggest.imports.hosts`, typically saved in
`~/Library/Application Support/Nova/UserConfiguration.json`. As of [Nova][Nova]
v7.2, there’s no suitable extension GUI for editing this map data structure.

If the project configuration option `deno.suggest.imports.autoDiscover` is
enabled, while typing an import module specifier the
[Deno language server][Deno language server] automatically discovers if the host
supports import IntelliSense, triggering a notification to enable or disable it.

### Commands

#### Reset Deno import IntelliSense hosts

Resets the global configuration option `deno.suggest.imports.hosts` to allow
fresh auto-discovery of hosts that support JavaScript/[TypeScript] import
IntelliSense (see the _**Import IntelliSense**_ section above). The host
`https://deno.land` is enabled by default. This happens automatically if the
global configuration option `deno.suggest.imports.hosts` is missing when the
extension activates.

Available via:

- [Nova command palette][Nova command palettes], entering
  `Reset Deno import IntelliSense hosts`.
- [Nova][Nova] menu bar option _**Extensions → Deno → Reset Deno import
  IntelliSense hosts**_.

#### Restart Deno language client

Restarts the [Deno][Deno] language client. This happens automatically when the
configuration or files referenced in the configuration (e.g. the
`deno.importMap` import map file or the `deno.config` [TypeScript] config file)
change.

Available via:

- [Nova command palette][Nova command palettes], entering
  `Restart Deno language client`.
- [Nova][Nova] menu bar option _**Extensions → Deno → Restart Deno language
  client**_.

#### Deno cache

Instructs Deno to attempt to cache any dependencies of the module in the focused
editor.

Available when the focused editor has a JavaScript or TypeScript syntax, via:

- [Nova command palette][Nova command palettes], entering `Deno cache`.
- [Nova][Nova] menu bar option _**Editor → Deno cache**_.

#### Deno format document

[Deno formats](https://deno.land/manual/tools/formatter) the focused editor.

Available when the focused editor has a [Deno][Deno] formattable syntax, via:

- [Nova command palette][Nova command palettes], entering
  `Deno format document`.
- [Nova][Nova] menu bar option _**Editor → Deno format document**_.
- Keyboard shortcut <kbd>Shift</kbd>+<kbd>Option</kbd>+<kbd>f</kbd>.

## Requirements

- macOS v10.15.4+, for modern JavaScript syntax support in JavaScriptCore.
- [Nova][Nova] v5+.
- The [Deno CLI](https://deno.land/#installation).

## Configuration

### Global config

1. In the [Nova][Nova] menu bar open _**Extensions → Extension Library…**_.
2. In the sidebar under _**Installed Extensions**_, open the tab _**Deno**_.
3. Open the tab _**Preferences**_.

### Project config

1. In the [Nova][Nova] menu bar open _**Project → Project Settings...**_.
2. In the sidebar under _**Extensions**_, open the tab _**Deno**_.

[Deno]: https://deno.land "Deno website"
[Deno language server]: https://github.com/denoland/deno/blob/main/cli/lsp/README.md "Deno language server docs"
[Nova]: https://nova.app "Nova website"
[Nova command palettes]: https://library.panic.com/nova/command-palettes "Nova command palettes docs"
[TypeScript]: https://www.typescriptlang.org "TypeScript website"
