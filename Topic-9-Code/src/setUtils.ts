// ES6 Set utility functions for deduplication and set mathematics

// 1. Deduplicate items in an array using Sets
export function removeDuplicates<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

// 2. Perform Union of two Sets (combines items from both, removing duplicates)
export function setUnion<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA, ...setB]);
}

// 3. Perform Intersection of two Sets (returns items present in both)
export function setIntersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter(item => setB.has(item)));
}

// 4. Perform Difference of two Sets (returns items in setA that are not in setB)
export function setDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter(item => !setB.has(item)));
}
