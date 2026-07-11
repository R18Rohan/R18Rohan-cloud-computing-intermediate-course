// Immutability utilities for deep cloning and deep freezing objects

// 1. Deep cloning using standard structuredClone
export function deepClone<T>(obj: T): T {
  return structuredClone(obj);
}

// 2. Recursive deep freeze to prevent any mutations
export function deepFreeze<T extends object>(obj: T): T {
  Object.freeze(obj);
  
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (
      value !== null &&
      (typeof value === 'object' || typeof value === 'function') &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });

  return obj;
}

// 3. Immutable update helper using spread operator
export function updateObjectProperty<T extends Record<string, any>>(
  obj: T,
  key: keyof T,
  value: any
): T {
  return {
    ...obj,
    [key]: value
  };
}
