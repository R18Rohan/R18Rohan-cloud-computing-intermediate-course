// Currying and point-free pipe composition helpers

// 1. Currying helper function
export function curry(fn: (...args: any[]) => any): (...args: any[]) => any {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(this: any, ...nextArgs: any[]) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

// 2. Point-free pipe composition helper
export function pipe(...fns: Array<(...args: any[]) => any>) {
  return function(initialValue: any) {
    return fns.reduce((value, fn) => fn(value), initialValue);
  };
}
