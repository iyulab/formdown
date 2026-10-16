import { NAME, pattern } from './grammar.js'

/**
 * A value worked out from other fields' numbers — `compute="quantity * price"`: what it reads, and how to work it
 * out. Read once, evaluated as often as the values change; never `eval`.
 */
export interface Computation {
    /** The fields it reads, each once, in the order they first appear. */
    fields: string[]
    /**
     * The value for the form's values: undefined while a field it reads holds no number, or where it divides by zero.
     * Worked out to twelve significant digits, so `0.1 + 0.2` is `0.3`.
     */
    evaluate(data: Record<string, unknown>): number | undefined
}

type Node =
    | { kind: 'number'; value: number }
    | { kind: 'field'; name: string }
    | { kind: 'negate'; operand: Node }
    | { kind: 'binary'; operator: '+' | '-' | '*' | '/'; left: Node; right: Node }

const TOKEN = pattern(String.raw`\s*(?:(\d+(?:\.\d+)?)|(${NAME})|([-+*/()]))`, 'y')

/**
 * Reads `text` — numbers, field names, `+ - * /` and parentheses, with `*` and `/` before `+` and `-` — or says where
 * it stops making sense.
 */
export function parseComputation(text: string): Computation | { error: string } {
    const tokens: (number | string)[] = []
    const kinds: ('number' | 'name' | 'symbol')[] = []
    TOKEN.lastIndex = 0
    let at = 0
    while (at < text.length) {
        if (!text.slice(at).trim()) break
        TOKEN.lastIndex = at
        const match = TOKEN.exec(text)
        if (!match) return { error: `cannot read "${text.slice(at).trim()}"` }
        if (match[1] !== undefined) {
            tokens.push(Number(match[1]))
            kinds.push('number')
        } else if (match[2] !== undefined) {
            tokens.push(match[2])
            kinds.push('name')
        } else {
            tokens.push(match[3])
            kinds.push('symbol')
        }
        at = TOKEN.lastIndex
    }
    if (tokens.length === 0) return { error: 'is empty' }

    let next = 0
    const fields: string[] = []
    const peek = () => (kinds[next] === 'symbol' ? (tokens[next] as string) : undefined)

    function sum(): Node {
        let node = product()
        for (let symbol = peek(); symbol === '+' || symbol === '-'; symbol = peek()) {
            next++
            node = { kind: 'binary', operator: symbol, left: node, right: product() }
        }
        return node
    }
    function product(): Node {
        let node = factor()
        for (let symbol = peek(); symbol === '*' || symbol === '/'; symbol = peek()) {
            next++
            node = { kind: 'binary', operator: symbol, left: node, right: factor() }
        }
        return node
    }
    function factor(): Node {
        if (next >= tokens.length) throw new Error('ends too soon')
        const token = tokens[next]
        const kind = kinds[next++]
        if (kind === 'number') return { kind: 'number', value: token as number }
        if (kind === 'name') {
            if (!fields.includes(token as string)) fields.push(token as string)
            return { kind: 'field', name: token as string }
        }
        if (token === '-') return { kind: 'negate', operand: factor() }
        if (token === '(') {
            const inner = sum()
            if (peek() !== ')') throw new Error('has a "(" without its ")"')
            next++
            return inner
        }
        throw new Error(`has "${token}" where a number or a field was expected`)
    }

    let root: Node
    try {
        root = sum()
        if (next < tokens.length) throw new Error(`has "${tokens[next]}" after its end`)
    } catch (error) {
        return { error: (error as Error).message }
    }
    return { fields, evaluate: (data) => round(evaluate(root, data)) }
}

function evaluate(node: Node, data: Record<string, unknown>): number | undefined {
    switch (node.kind) {
        case 'number':
            return node.value
        case 'field':
            return numberOf(data[node.name])
        case 'negate': {
            const value = evaluate(node.operand, data)
            return value === undefined ? undefined : -value
        }
        case 'binary': {
            const left = evaluate(node.left, data)
            const right = evaluate(node.right, data)
            if (left === undefined || right === undefined) return undefined
            switch (node.operator) {
                case '+':
                    return left + right
                case '-':
                    return left - right
                case '*':
                    return left * right
                case '/':
                    return right === 0 ? undefined : left / right
            }
        }
    }
}

/** A field's value as a number: a number, or text that is one (thousands separators allowed); anything else is none. */
function numberOf(value: unknown): number | undefined {
    if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
    if (typeof value !== 'string') return undefined
    const text = value.trim().replace(/,(?=\d{3}\b)/g, '')
    if (!/^-?\d+(?:\.\d+)?$/.test(text)) return undefined
    return Number(text)
}

function round(value: number | undefined): number | undefined {
    return value === undefined || !Number.isFinite(value) ? undefined : Number(value.toPrecision(12))
}
