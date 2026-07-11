// Lens Pattern for deeply nested state updates

export interface Lens<S, A> {
  view(state: S): A;
  set(value: A, state: S): S;
}

// Factory to create a Lens
export function lens<S, A>(
  getter: (state: S) => A,
  setter: (value: A, state: S) => S
): Lens<S, A> {
  return {
    view: getter,
    set: setter
  };
}

// Lens combinator over() to apply a function to the focused target
export function over<S, A>(lensObj: Lens<S, A>, fn: (val: A) => A, state: S): S {
  return lensObj.set(fn(lensObj.view(state)), state);
}

// Example Lens creators for common structures
export function pathLens<S, A>(path: string[]): Lens<S, A> {
  return {
    view(state: S): A {
      return path.reduce((acc, part) => (acc as any)?.[part], state) as any;
    },
    set(value: A, state: S): S {
      const clone = structuredClone(state);
      let current: any = clone;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return clone;
    }
  };
}
