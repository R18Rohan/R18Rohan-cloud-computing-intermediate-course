import { removeDuplicates, setUnion, setIntersection, setDifference } from '../src/setUtils';
import { CacheRegistry } from '../src/mapUtils';

describe('ES6 Set and Map Collections', () => {

  describe('Set Utilities (Deduplication and Algebra)', () => {
    test('should remove duplicate items from an array', () => {
      const input = [1, 2, 2, 3, 4, 4, 5];
      const output = removeDuplicates(input);

      expect(output).toEqual([1, 2, 3, 4, 5]);
    });

    test('should calculate union of two Sets correctly', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([3, 4, 5]);

      const union = setUnion(setA, setB);
      expect(Array.from(union)).toEqual([1, 2, 3, 4, 5]);
    });

    test('should calculate intersection of two Sets correctly', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([3, 4, 5]);

      const intersection = setIntersection(setA, setB);
      expect(Array.from(intersection)).toEqual([3]);
    });

    test('should calculate difference of two Sets correctly', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([3, 4, 5]);

      const difference = setDifference(setA, setB);
      expect(Array.from(difference)).toEqual([1, 2]);
    });
  });

  describe('Map Utilities (Cache Registry and Keys mapping)', () => {
    test('should perform basic Map CRUD operations', () => {
      const registry = new CacheRegistry<string, number>();

      registry.set('port', 3000);
      registry.set('timeout', 5000);

      expect(registry.get('port')).toBe(3000);
      expect(registry.has('timeout')).toBe(true);
      expect(registry.size()).toBe(2);

      registry.delete('port');
      expect(registry.get('port')).toBeUndefined();
      expect(registry.size()).toBe(1);

      registry.clear();
      expect(registry.size()).toBe(0);
    });

    test('should support using Objects as Map keys with reference equality', () => {
      const registry = new CacheRegistry<object, string>();
      
      const keyObj1 = { id: 101 };
      const keyObj2 = { id: 101 }; // Identical shape but different reference

      registry.set(keyObj1, 'Metadata for user 101');

      // Reference lookup works
      expect(registry.get(keyObj1)).toBe('Metadata for user 101');

      // Different object reference does not resolve to the metadata key
      expect(registry.get(keyObj2)).toBeUndefined();
      expect(registry.size()).toBe(1);

      // We can list all keys and values in arrays
      expect(registry.getKeys()).toEqual([keyObj1]);
      expect(registry.getValues()).toEqual(['Metadata for user 101']);
    });
  });
});
