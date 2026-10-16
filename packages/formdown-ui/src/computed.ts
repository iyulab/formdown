import { parseComputation, type Computation } from '@formdown/core'

/** The fields a schema works out from others (`compute="…"`), each with how; one that cannot be read is left out. */
export function computations(schema: Record<string, { compute?: string }> | null): Map<string, Computation> {
  const found = new Map<string, Computation>()
  for (const [name, field] of Object.entries(schema ?? {})) {
    if (!field.compute) continue
    const read = parseComputation(field.compute)
    if (!('error' in read) && !read.fields.includes(name)) found.set(name, read)
  }
  return found
}

/**
 * What the computed fields hold for `data`, where it differs from what `data` holds: a number as text, or empty while
 * a field it reads has none. Fields are worked out in order, so one may read another worked out before it.
 */
export function computedValues(found: Map<string, Computation>, data: Record<string, unknown>): Record<string, string> {
  const values: Record<string, unknown> = { ...data }
  const changed: Record<string, string> = {}
  for (const [name, computation] of found) {
    const value = computation.evaluate(values)
    const text = value === undefined ? '' : String(value)
    if (String(values[name] ?? '') !== text) changed[name] = text
    values[name] = text
  }
  return changed
}
