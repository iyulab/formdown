/**
 * The fastest of `runs` timed calls of `work`, in milliseconds. A machine busy with something else only ever
 * adds time, so the fastest run is the closest to what the work itself costs: a time limit checked against it
 * fails on slow code, not on a loaded machine. The first call warms up (module loading, JIT) and is not timed.
 */
export function fastestOf(work: () => unknown, runs = 5): number {
    work()
    let fastest = Infinity
    for (let i = 0; i < runs; i++) {
        const start = performance.now()
        work()
        fastest = Math.min(fastest, performance.now() - start)
    }
    return fastest
}
