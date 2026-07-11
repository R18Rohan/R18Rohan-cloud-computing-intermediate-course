// Generator functions demonstrating lazy evaluation

// 1. Fibonacci Sequence Generator up to a limit
export function* fibonacciGenerator(limit: number): Generator<number, void, unknown> {
  let prev = 0;
  let curr = 1;

  while (prev <= limit) {
    yield prev;
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
}

// 2. Infinite Sequence Generator demonstrating lazy evaluation without memory crashes
export function* infiniteCounter(start = 0, step = 1): Generator<number, void, unknown> {
  let current = start;
  while (true) {
    yield current;
    current += step;
  }
}
