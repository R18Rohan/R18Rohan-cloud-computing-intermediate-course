import { ResilienceSimulator, ScalingConfig, DrStrategy } from '../src/resilienceSimulator';

describe('AWS Auto Scaling & DR Resilience Simulation Tests', () => {
  let simulator: ResilienceSimulator;

  beforeEach(() => {
    simulator = new ResilienceSimulator();
  });

  describe('Disaster Recovery Framework Mappings', () => {
    test('should return correct metrics for Backup and Restore strategy', () => {
      const result = simulator.calculateDrMetrics('BackupAndRestore');
      expect(result.rtoMinutes).toBe(1440);
      expect(result.rpoMinutes).toBe(1440);
      expect(result.costImpact).toBe('Low');
    });

    test('should return correct metrics for Pilot Light strategy', () => {
      const result = simulator.calculateDrMetrics('PilotLight');
      expect(result.rtoMinutes).toBe(240);
      expect(result.rpoMinutes).toBe(240);
      expect(result.costImpact).toBe('Medium');
    });

    test('should return correct metrics for Warm Standby strategy', () => {
      const result = simulator.calculateDrMetrics('WarmStandby');
      expect(result.rtoMinutes).toBe(30);
      expect(result.rpoMinutes).toBe(30);
      expect(result.costImpact).toBe('High');
    });

    test('should return correct metrics for Active-Active multi-region strategy', () => {
      const result = simulator.calculateDrMetrics('ActiveActive');
      expect(result.rtoMinutes).toBe(1);
      expect(result.rpoMinutes).toBe(1);
      expect(result.costImpact).toBe('VeryHigh');
    });
  });

  describe('Auto Scaling Group Target Tracking Policies', () => {
    const config: ScalingConfig = {
      minCapacity: 2,
      maxCapacity: 10,
      targetCpuUtilization: 70
    };

    test('should trigger ScaleUp action on high CPU loads', () => {
      // 90% CPU load when running with 2 instances should trigger scale up
      const result = simulator.simulateTargetTracking(90, 2, config);

      expect(result.actionTaken).toBe('ScaleUp');
      expect(result.desiredCapacity).toBe(3); // Math.ceil(2 * (90/70)) = 3
      expect(result.message).toContain('Scaling up capacity');
    });

    test('should trigger ScaleDown action when CPU utilization drops', () => {
      // 30% CPU load when running with 6 instances should trigger scale down
      const result = simulator.simulateTargetTracking(30, 6, config);

      expect(result.actionTaken).toBe('ScaleDown');
      expect(result.desiredCapacity).toBe(3); // Math.ceil(6 * (30/70)) = 3
      expect(result.message).toContain('Scaling down capacity');
    });

    test('should respect and clamp desired capacity to Fargate limits', () => {
      // Very high CPU load should not exceed maxCapacity of 10
      const maxSurgeResult = simulator.simulateTargetTracking(95, 8, config);
      expect(maxSurgeResult.desiredCapacity).toBe(10); // Clamped to maxCapacity

      // Very low load should not fall below minCapacity of 2
      const lowTrafficResult = simulator.simulateTargetTracking(10, 2, config);
      expect(lowTrafficResult.desiredCapacity).toBe(2); // Clamped to minCapacity
    });

    test('should throw validation error on invalid configuration limits', () => {
      const invalidConfig: ScalingConfig = {
        minCapacity: 5,
        maxCapacity: 2, // invalid min > max
        targetCpuUtilization: 70
      };

      expect(() => {
        simulator.simulateTargetTracking(80, 3, invalidConfig);
      }).toThrow('minCapacity cannot exceed maxCapacity');
    });
  });
});
