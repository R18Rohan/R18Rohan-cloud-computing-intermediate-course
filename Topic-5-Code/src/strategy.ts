// Strategy Pattern for interchangeable algorithms

export interface IShippingStrategy {
  calculate(weight: number): number;
}

export class StandardShipping implements IShippingStrategy {
  calculate(weight: number): number {
    // Standard flat cost calculation: $5 flat fee + $0.50 per kg
    return 5 + weight * 0.50;
  }
}

export class ExpressShipping implements IShippingStrategy {
  calculate(weight: number): number {
    // Express premium calculation: $15 flat fee + $2.00 per kg
    return 15 + weight * 2.00;
  }
}

export class ShippingCalculatorContext {
  private strategy: IShippingStrategy;

  constructor(strategy: IShippingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IShippingStrategy): void {
    this.strategy = strategy;
  }

  calculateCost(weight: number): number {
    return this.strategy.calculate(weight);
  }
}
