/**
 * Shared lexical grammar for Formdown source.
 *
 * Every pattern that recognises a field name is assembled from NAME so that the
 * inline, block and shorthand forms agree on what a name is. Patterns built here
 * use the `u` flag, which is required for Unicode property escapes.
 */

/** A field name: a Unicode letter or underscore, then letters, digits or underscores. */
export const NAME = String.raw`[\p{L}_][\p{L}\p{N}_]*`

const FULL_NAME = new RegExp(`^${NAME}$`, 'u')

/** True when `name` is a valid field name. */
export function isValidName(name: string): boolean {
    return FULL_NAME.test(name)
}

/** Build a Unicode-aware RegExp from a pattern source that may reference NAME. */
export function pattern(source: string, flags = ''): RegExp {
    return new RegExp(source, flags.includes('u') ? flags : flags + 'u')
}
