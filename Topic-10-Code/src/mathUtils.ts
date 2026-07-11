// TypeScript Migrated Module demonstrating explicit type annotations and interfaces

export interface IResult {
  value: number;
  operation: string;
  timestamp: number;
}

export class MathCalculator {
  // Explicit type annotations on parameters and return values
  add(a: number, b: number): IResult {
    return {
      value: a + b,
      operation: 'addition',
      timestamp: Date.now()
    };
  }

  multiply(a: number, b: number): IResult {
    return {
      value: a * b,
      operation: 'multiplication',
      timestamp: Date.now()
    };
  }

  divide(a: number, b: number): IResult {
    if (b === 0) {
      throw new Error('Division by zero is not allowed.');
    }
    return {
      value: a / b,
      operation: 'division',
      timestamp: Date.now()
    };
  }
}
