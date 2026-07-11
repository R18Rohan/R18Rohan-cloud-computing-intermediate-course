// ES6 Map utility class for key-value dictionary mappings and caching

export class CacheRegistry<K, V> {
  private cache = new Map<K, V>();

  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Returns all keys of the Map
  getKeys(): K[] {
    return Array.from(this.cache.keys());
  }

  // Returns all values of the Map
  getValues(): V[] {
    return Array.from(this.cache.values());
  }
}
