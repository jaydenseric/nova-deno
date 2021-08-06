# Nova Deno extension

A [Nova][Nova] editor extension that integrates the [Deno][Deno]
JavaScript/[TypeScript](https://www.typescriptlang.org)
[runtime](https://deno.land/manual/runtime) and
[tools](https://deno.land/manual/tools).

This is the readme for developing the extension. The readme for using the
extension can be seen at
[`Deno.novaextension/readme.md`](Deno.novaextension/readme.md).

## Requirements

- macOS v10.15.4+, for modern JavaScript syntax support in JavaScriptCore.
- [Nova][Nova] v5+.
- The [Deno CLI](https://deno.land/#installation).

## Manual testing

To activate this project as a [Nova extension][Nova extensions] for manual
testing:

1. Open this repo as a [Nova][Nova] project.
2. In the [Nova][Nova] menu bar select _**Extensions → Activate Project as
   Extension**_.

To deactivate this project as a [Nova extension][Nova extensions]:

1. In the [Nova][Nova] menu bar select _**Extensions → Deactivate Project as
   Extension**_.

## Scripts

These CLI scripts used to develop and
[GitHub Actions CI](./github/workflows/ci.yml) check the extension are available
as [Nova project tasks](https://library.panic.com/nova/run-tasks).

### Format

```
deno fmt
```

### Format check

```
deno fmt --check
```

### Lint

```
deno lint
```

### Test

```
deno test --allow-read --unstable
```

[Deno]: https://deno.land "Deno website"
[Nova]: https://nova.app "Nova website"
[Nova extensions]: https://docs.nova.app/extensions "Nova extensions docs"
