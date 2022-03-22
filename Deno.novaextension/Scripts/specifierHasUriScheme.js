// @ts-check

/**
 * Checks if a specifier has a URL scheme. Deno specifies can be either a URL or
 * file path.
 *
 * - [Equivalent Deno function in Rust](https://github.com/denoland/deno/blob/8f00b5542caffd14988b923efe4f066b712d2858/core/module_specifier.rs#L147-L174).
 * - [IETF RFC 3986](https://tools.ietf.org/html/rfc3986#section-3.1).
 * @param {string} specifier Specifier.
 * @returns {boolean} Does the specifier have a URL scheme.
 */
function specifierHasUriScheme(specifier) {
  if (typeof specifier !== "string") {
    throw new TypeError("Argument 1 `specifier` must be a string.");
  }

  return /^[a-z][a-z\d+.-]+:/iu.test(specifier);
}

module.exports = specifierHasUriScheme;
