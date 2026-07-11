import { CounterModule } from '../src/module';
import { CustomEventEmitter } from '../src/observer';
import { UserFactory } from '../src/factory';
import { StandardShipping, ExpressShipping, ShippingCalculatorContext } from '../src/strategy';
import { AppConfig } from '../src/singleton';
import { createSecureDataProxy, ISensitiveData } from '../src/proxy';

describe('JavaScript Design Patterns', () => {

  describe('Module Pattern', () => {
    beforeEach(() => {
      CounterModule.reset();
    });

    test('should encapsulate state and expose public interface', () => {
      expect(CounterModule.getCount()).toBe(0);
      expect(CounterModule.increment()).toBe(1);
      expect(CounterModule.increment()).toBe(2);
      expect(CounterModule.decrement()).toBe(1);

      // Private variables are not exposed on exports object
      expect((CounterModule as any).count).toBeUndefined();
      expect((CounterModule as any).history).toBeUndefined();
    });

    test('should prevent external mutation of history array', () => {
      CounterModule.increment();
      const historyCopy = CounterModule.getHistory();
      
      // Mutating copy shouldn't affect internal state
      historyCopy.push(999);
      expect(CounterModule.getHistory()).toEqual([1]);
    });
  });

  describe('Observer (EventEmitter) Pattern', () => {
    test('should publish and subscribe to custom events', () => {
      const emitter = new CustomEventEmitter();
      const mockListener = jest.fn();

      emitter.on('alert', mockListener);
      emitter.emit('alert', 'System warning payload');

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith('System warning payload');
    });

    test('should support deregistering listeners', () => {
      const emitter = new CustomEventEmitter();
      const mockListener = jest.fn();

      emitter.on('ping', mockListener);
      emitter.off('ping', mockListener);
      emitter.emit('ping');

      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('Factory Pattern', () => {
    test('should dynamically instantiate user instances with correct roles', () => {
      const admin = UserFactory.createUser('Alice', 'admin');
      const member = UserFactory.createUser('Bob', 'member');

      expect(admin.role).toBe('admin');
      expect(admin.getPermissions()).toContain('delete');

      expect(member.role).toBe('member');
      expect(member.getPermissions()).not.toContain('delete');
    });
  });

  describe('Strategy Pattern', () => {
    test('should swap calculations strategies dynamically', () => {
      const calculator = new ShippingCalculatorContext(new StandardShipping());
      
      // Standard: 5 + (10 * 0.50) = 10
      expect(calculator.calculateCost(10)).toBe(10);

      // Swap strategy to Express
      calculator.setStrategy(new ExpressShipping());
      
      // Express: 15 + (10 * 2.00) = 35
      expect(calculator.calculateCost(10)).toBe(35);
    });
  });

  describe('Singleton Pattern', () => {
    test('should maintain a single global instance', () => {
      const config1 = AppConfig.getInstance();
      const config2 = AppConfig.getInstance();

      expect(config1).toBe(config2); // Strict reference equality

      config1.set('port', 8080);
      expect(config2.get('port')).toBe(8080); // Second reference inherits state update
    });
  });

  describe('Proxy Pattern', () => {
    let rawData: ISensitiveData;

    beforeEach(() => {
      rawData = {
        secretKey: 'top-secret-credentials',
        publicId: 'uuid-101'
      };
    });

    test('should allow admins to read secret keys but block members', () => {
      const adminProxy = createSecureDataProxy(rawData, 'admin');
      const memberProxy = createSecureDataProxy(rawData, 'member');

      expect(adminProxy.secretKey).toBe('top-secret-credentials');
      expect(() => {
        const key = memberProxy.secretKey;
      }).toThrow('Access Denied');
    });

    test('should block attempts to modify read-only properties', () => {
      const proxyObj = createSecureDataProxy(rawData, 'admin');

      expect(() => {
        proxyObj.publicId = 'new-id';
      }).toThrow('Mutation Error');
    });
  });
});
