// Custom iterable collection implementing the Iteration Protocol

export class NumberRange implements Iterable<number> {
  constructor(private start: number, private end: number) {}

  // The object must define a method with key Symbol.iterator
  [Symbol.iterator](): Iterator<number> {
    let current = this.start;
    const limit = this.end;

    // Returns an iterator object containing a next() method
    return {
      next(): IteratorResult<number> {
        if (current <= limit) {
          return {
            value: current++,
            done: false
          };
        } else {
          return {
            value: undefined as any,
            done: true
          };
        }
      }
    };
  }
}
