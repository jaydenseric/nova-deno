import {
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { createRequire } from "https://deno.land/std@0.106.0/node/module.ts";

const require = createRequire(import.meta.url);

const specifierHasUriScheme = require(
  "../Deno.novaextension/Scripts/specifierHasUriScheme.js",
);

Deno.test(
  "`specifierHasUriScheme` argument 1 `specifier` not a string.",
  () => {
    assertThrows(
      () => {
        specifierHasUriScheme(true);
      },
      TypeError,
      "Argument 1 `specifier` must be a string.",
    );
  },
);

Deno.test(
  "`specifierHasUriScheme` with a specifier that doesn’t have a URI scheme due to no colon.",
  () => {
    assertStrictEquals(specifierHasUriScheme("aa"), false);
  },
);

Deno.test(
  "`specifierHasUriScheme` with specifiers that don’t have a URI scheme due to < 2 chars at the start before the colon.",
  () => {
    assertStrictEquals(specifierHasUriScheme(":"), false);
    assertStrictEquals(specifierHasUriScheme("a:"), false);
  },
);

Deno.test(
  "`specifierHasUriScheme` with specifiers that don’t have a URI scheme due to starting with a non-letter.",
  () => {
    assertStrictEquals(specifierHasUriScheme("1a:"), false);
    assertStrictEquals(specifierHasUriScheme("+a:"), false);
    assertStrictEquals(specifierHasUriScheme(".a:"), false);
    assertStrictEquals(specifierHasUriScheme("-a:"), false);
  },
);

Deno.test(
  "`specifierHasUriScheme` with specifiers that have a URI scheme.",
  () => {
    assertStrictEquals(specifierHasUriScheme("Aa:"), true);
    assertStrictEquals(specifierHasUriScheme("aA:"), true);
    assertStrictEquals(
      specifierHasUriScheme("aA1+.-:aA0-._~:/?#[]@!$&'()*+,;%="),
      true,
    );
    assertStrictEquals(specifierHasUriScheme("https://deno.land"), true);
  },
);

Deno.test(
  "`specifierHasUriScheme` with realistic specifiers.",
  () => {
    assertStrictEquals(specifierHasUriScheme("foo.js"), false);
    assertStrictEquals(specifierHasUriScheme("./foo.js"), false);
    assertStrictEquals(
      specifierHasUriScheme("https://deno.land/std@0.106.0/testing/asserts.ts"),
      true,
    );
  },
);
