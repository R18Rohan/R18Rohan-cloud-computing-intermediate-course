import { MathCalculator, IResult } from '../src/mathUtils';
import { loadConfig, IConfig } from '../src/config';

describe('Toolchain and TypeScript Introduction', () => {

  describe('TypeScript Module Migration (MathCalculator)', () => {
    let calculator: MathCalculator;

    beforeEach(() => {
      calculator = new MathCalculator();
    });

    test('should add numbers and return an IResult object', () => {
      const result: IResult = calculator.add(10, 20);
      
      expect(result.value).toBe(30);
      expect(result.operation).toBe('addition');
      expect(result.timestamp).toBeLessThanOrEqual(Date.now());
    });

    test('should multiply numbers and return IResult', () => {
      const result: IResult = calculator.multiply(5, 5);
      expect(result.value).toBe(25);
      expect(result.operation).toBe('multiplication');
    });

    test('should divide numbers and return IResult', () => {
      const result: IResult = calculator.divide(100, 4);
      expect(result.value).toBe(25);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => {
        calculator.divide(10, 0);
      }).toThrow('Division by zero');
    });
  });

  describe('Environment Config Loader', () => {
    test('should parse environment variables successfully', () => {
      const mockEnv = {
        PORT: '8080',
        NODE_ENV: 'production',
        API_SECRET_KEY: 'test-secret-101'
      };

      const config: IConfig = loadConfig(mockEnv);

      expect(config.port).toBe(8080);
      expect(config.environment).toBe('production');
      expect(config.apiSecretKey).toBe('test-secret-101');
    });

    test('should throw error on missing environment variables', () => {
      const incompleteEnv = {
        PORT: '3000'
      };

      expect(() => {
        loadConfig(incompleteEnv);
      }).toThrow('Missing required environment variables');
    });

    test('should throw error on invalid port numbers', () => {
      const invalidEnv = {
        PORT: 'not-a-number',
        NODE_ENV: 'dev',
        API_SECRET_KEY: 'secret'
      };

      expect(() => {
        loadConfig(invalidEnv);
      }).toThrow('must be a valid number');
    });
  });
});
