// @ts-check

// Prevent a TypeScript error when importing this module in a JSDoc type.
module.exports = {};

/**
 * LSP text document position.
 *
 * - [LSP spec](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#position).
 * @typedef {object} LspPosition
 * @prop {number} line Line index within the text document.
 * @prop {number} character Character index within the line string.
 */

/**
 * LSP text document range.
 *
 * - [LSP spec](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#range).
 * @typedef {object} LspRange
 * @prop {LspPosition} start Start position.
 * @prop {LspPosition} end End position.
 */

/**
 * LSP text document edit.
 *
 * - [LSP spec](https://microsoft.github.io/language-server-protocol/specifications/specification-3-17/#textEdit).
 * @typedef {object} LspTextEdit
 * @prop {LspRange} range LSP text document range.
 * @prop {string} newText Replacement text.
 */
