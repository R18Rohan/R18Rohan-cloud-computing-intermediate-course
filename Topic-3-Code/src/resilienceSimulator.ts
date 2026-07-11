// High Availability & Resilience Engineering Simulator

export type DrStrategy = 'BackupAndRestore' | 'PilotLight' | 'WarmStandby' | 'ActiveActive';

export interface DrMetrics {
  strategy: DrStrategy;
  rtoMinutes: number;
  rpoMinutes: number;
  costImpact: 'Low' | 'Medium' | 'High' | 'VeryHigh';
}

export interface ScalingConfig {
  minCapacity: number;
  maxCapacity: number;
  targetCpuUtilization: number; // e.g. 70 (%)
}

export interface ScalingResult {
  desiredCapacity: number;
  actionTaken: 'ScaleUp' | 'ScaleDown' | 'NoAction';
  message: string;
}

export class ResilienceSimulator {
  // 1. Calculate RTO and RPO benchmarks based on Disaster Recovery strategies
  calculateDrMetrics(strategy: DrStrategy): DrMetrics {
    switch (strategy) {
      case 'BackupAndRestore':
        return {
          strategy,
          rtoMinutes: 1440, // 24 hours
          rpoMinutes: 1440,
          costImpact: 'Low'
        };
      case 'PilotLight':
        return {
          strategy,
          rtoMinutes: 240, // 4 hours
          rpoMinutes: 240,
          costImpact: 'Medium'
        };
      case 'WarmStandby':
        return {
          strategy,
          rtoMinutes: 30, // 30 minutes
          rpoMinutes: 30,
          costImpact: 'High'
        };
      case 'ActiveActive':
        return {
          strategy,
          rtoMinutes: 1, // Near real-time
          rpoMinutes: 1,
          costImpact: 'VeryHigh'
        };
    }
  }

  // 2. Simulate ASG Target Tracking CPU Scaling Calculations
  simulateTargetTracking(
    currentCpu: number,
    currentCapacity: number,
    config: ScalingConfig
  ): ScalingResult {
    if (config.minCapacity > config.maxCapacity) {
      throw new Error('Configuration Error: minCapacity cannot exceed maxCapacity.');
    }

    // Target tracking scaling equation: Desired = Current * (Current CPU / Target CPU)
    let desired = Math.ceil(currentCapacity * (currentCpu / config.targetCpuUtilization));

    // Clamp desired capacity between min and max bounds
    if (desired > config.maxCapacity) {
      desired = config.maxCapacity;
    } else if (desired < config.minCapacity) {
      desired = config.minCapacity;
    }

    let action: 'ScaleUp' | 'ScaleDown' | 'NoAction' = 'NoAction';
    if (desired > currentCapacity) {
      action = 'ScaleUp';
    } else if (desired < currentCapacity) {
      action = 'ScaleDown';
    }

    const message = action === 'ScaleUp'
      ? `High CPU load detected (${currentCpu}%). Scaling up capacity to ${desired} instances.`
      : action === 'ScaleDown'
      ? `Low CPU load detected (${currentCpu}%). Scaling down capacity to ${desired} instances.`
      : `CPU load stable (${currentCpu}%). No action required.`;

    return {
      desiredCapacity: desired,
      actionTaken: action,
      message
    };
  }
}
