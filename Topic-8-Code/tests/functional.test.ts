import { deepClone, deepFreeze, updateObjectProperty } from '../src/immutability';
import { pathLens, over } from '../src/lens';
import { ReactiveStore } from '../src/reactive';
import { curry, pipe } from '../src/functionalUtils';

describe('Functional Programming Patterns', () => {

  describe('Deep Copy & Freezing Immutability', () => {
    test('should deeply clone objects and isolate changes', () => {
      const original = { user: { name: 'Alice', details: { age: 30 } } };
      const cloned = deepClone(original);

      cloned.user.details.age = 31;

      expect(original.user.details.age).toBe(30); // Isolated
      expect(cloned.user.details.age).toBe(31);
    });

    test('should recursively freeze nested structures', () => {
      const original = { company: { name: 'Acme', address: { city: 'New York' } } };
      const frozen = deepFreeze(original);

      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.company.address)).toBe(true);

      // In strict mode (which TypeScript compiles to), modifying throws
      expect(() => {
        (frozen.company as any).name = 'New Acme';
      }).toThrow();
    });

    test('should immutably update properties using spreads', () => {
      const state = { port: 3000, environment: 'dev' };
      const updated = updateObjectProperty(state, 'port', 8080);

      expect(state.port).toBe(3000); // Intact
      expect(updated.port).toBe(8080);
      expect(updated).not.toBe(state); // Reference has changed
    });
  });

  describe('Lens Pattern for Deep Nested Updates', () => {
    interface AppState {
      config: {
        server: {
          port: number;
        };
      };
    }

    const state: AppState = {
      config: {
        server: {
          port: 3000
        }
      }
    };

    test('should read deeply nested properties using pathLens view', () => {
      const portLens = pathLens<AppState, number>(['config', 'server', 'port']);
      expect(portLens.view(state)).toBe(3000);
    });

    test('should update nested values immutably returning new references', () => {
      const portLens = pathLens<AppState, number>(['config', 'server', 'port']);
      const updatedState = portLens.set(8080, state);

      expect(portLens.view(state)).toBe(3000); // Original intact
      expect(portLens.view(updatedState)).toBe(8080); // New updated
      expect(updatedState).not.toBe(state); // New reference
    });

    test('should support over combinator for math conversions', () => {
      const portLens = pathLens<AppState, number>(['config', 'server', 'port']);
      const increment = (x: number) => x + 1;
      
      const updatedState = over(portLens, increment, state);
      expect(portLens.view(updatedState)).toBe(3001);
    });
  });

  describe('Proxy-Based Reactive Store', () => {
    test('should trigger subscriptions when state changes', () => {
      const store = new ReactiveStore({ count: 0 });
      const mockSub = jest.fn();

      store.subscribe(mockSub);
      store.state.count = 10; // Trigger mutation

      expect(mockSub).toHaveBeenCalledTimes(1);
      expect(mockSub).toHaveBeenCalledWith({ count: 10 }, 'count', 10);
    });

    test('should support unsubscribing from store changes', () => {
      const store = new ReactiveStore({ count: 0 });
      const mockSub = jest.fn();

      const unsubscribe = store.subscribe(mockSub);
      unsubscribe(); // Unsubscribe immediately
      
      store.state.count = 10;
      expect(mockSub).not.toHaveBeenCalled();
    });
  });

  describe('Currying & Pipe Function Composition', () => {
    test('should support curried function evaluations', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry(add);

      const addFive = curriedAdd(5);
      expect(addFive(10)).toBe(15);
      expect(curriedAdd(10)(20)).toBe(30);
    });

    test('should build pipeline transforms in point-free style', () => {
      const double = (x: number) => x * 2;
      const addTen = (x: number) => x + 10;
      const format = (x: number) => `Result: ${x}`;

      // (x * 2) + 10 -> format
      const processPipeline = pipe(double, addTen, format);

      expect(processPipeline(5)).toBe('Result: 20');
      expect(processPipeline(20)).toBe('Result: 50');
    });
  });
});
