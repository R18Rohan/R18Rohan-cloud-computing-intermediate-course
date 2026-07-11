import { NumberRange } from '../src/customIterable';
import { fibonacciGenerator, infiniteCounter } from '../src/generators';
import { SecureUser, MetadataKey } from '../src/weakData';
import { sanitizeHtml } from '../src/taggedTemplates';

describe('Modern JavaScript Features', () => {

  describe('Iteration Protocol and Custom Iterables', () => {
    test('should loop over custom NumberRange using for...of', () => {
      const range = new NumberRange(1, 5);
      const results: number[] = [];

      for (const val of range) {
        results.push(val);
      }

      expect(results).toEqual([1, 2, 3, 4, 5]);
    });

    test('should support manual iterator navigation', () => {
      const range = new NumberRange(10, 11);
      const iterator = range[Symbol.iterator]();

      expect(iterator.next()).toEqual({ value: 10, done: false });
      expect(iterator.next()).toEqual({ value: 11, done: false });
      expect(iterator.next().done).toBe(true);
    });
  });

  describe('ES6 Generators and Lazy Evaluation', () => {
    test('should generate Fibonacci sequence up to limit', () => {
      const generator = fibonacciGenerator(10);
      const results = Array.from(generator);

      expect(results).toEqual([0, 1, 1, 2, 3, 5, 8]);
    });

    test('should support lazy evaluation on infinite sequences without crashing', () => {
      const counter = infiniteCounter(5, 5);

      expect(counter.next().value).toBe(5);
      expect(counter.next().value).toBe(10);
      expect(counter.next().value).toBe(15);
      expect(counter.next().value).toBe(20);
    });
  });

  describe('WeakMaps and Symbols', () => {
    test('should store and verify private password inside WeakMap', () => {
      const user = new SecureUser('charlie', 'securepassword123');

      // Public property is accessible
      expect(user.username).toBe('charlie');

      // Private password is not exposed on instance properties list
      expect((user as any).password).toBeUndefined();
      expect(Object.keys(user)).not.toContain('password');

      // Verification method resolves successfully
      expect(user.verifyPassword('securepassword123')).toBe(true);
      expect(user.verifyPassword('wrongpassword')).toBe(false);
    });

    test('should map metadata details using unique Symbol keys', () => {
      const user = new SecureUser('alice', 'pw');

      expect(user[MetadataKey]).toBeDefined();
      expect(user[MetadataKey].created).toBeLessThanOrEqual(Date.now());
      
      // Symbol keys are hidden from standard property loops
      expect(Object.keys(user)).not.toContain(MetadataKey);
    });
  });

  describe('Tagged Template Literals', () => {
    test('should escape HTML tags to prevent XSS script executions', () => {
      const maliciousScript = '<script>alert("hack")</script>';
      const secureGreeting = sanitizeHtml`Welcome, ${maliciousScript}!`;

      expect(secureGreeting).toBe('Welcome, &lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;!');
    });

    test('should resolve strings normally when no HTML present', () => {
      const name = 'Alice';
      const greeting = sanitizeHtml`Hello ${name}`;
      expect(greeting).toBe('Hello Alice');
    });
  });
});
