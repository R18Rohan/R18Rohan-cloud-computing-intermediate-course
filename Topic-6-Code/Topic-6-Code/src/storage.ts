// Web Storage Wrapper supporting key expirations

interface StoragePayload<T> {
  value: T;
  expiresAt: number | null; // Null means no expiration
}

export class SafeStorage {
  // Store item with optional TTL (time to live in milliseconds)
  static setItem<T>(key: string, value: T, ttlMs?: number): void {
    const expiresAt = ttlMs ? Date.now() + ttlMs : null;
    const payload: StoragePayload<T> = { value, expiresAt };
    localStorage.setItem(key, JSON.stringify(payload));
  }

  // Retrieve item, purging if stale
  static getItem<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      const payload: StoragePayload<T> = JSON.parse(raw);
      
      // Check expiration
      if (payload.expiresAt && Date.now() > payload.expiresAt) {
        localStorage.removeItem(key); // Purge stale key
        return null;
      }
      
      return payload.value;
    } catch {
      return null; // Return null if format corrupted
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
