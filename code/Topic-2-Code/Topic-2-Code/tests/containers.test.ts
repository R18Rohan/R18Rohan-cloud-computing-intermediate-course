import { ContainerDeployer, TaskDefinitionConfig } from '../src/containerDeployer';

describe('AWS Containers Deployment Simulation Tests', () => {
  let auditor: ContainerDeployer;

  beforeEach(() => {
    auditor = new ContainerDeployer();
  });

  test('should pass validation on correct Fargate Task configurations', () => {
    const config: TaskDefinitionConfig = {
      cpu: 256,
      memory: 512,
      containerPort: 3000,
      imageTag: 'v1.0.0'
    };

    const report = auditor.auditConfiguration(config);

    expect(report.valid).toBe(true);
    expect(report.violations).toHaveLength(0);
  });

  test('should fail when using invalid CPU values', () => {
    const config: TaskDefinitionConfig = {
      cpu: 300, // Invalid Fargate CPU size
      memory: 1024,
      containerPort: 3000,
      imageTag: 'v1.0.0'
    };

    const report = auditor.auditConfiguration(config);

    expect(report.valid).toBe(false);
    expect(report.violations[0]).toContain('Invalid CPU value');
  });

  test('should fail when memory ratios do not match Fargate CPU allocations', () => {
    const config: TaskDefinitionConfig = {
      cpu: 256,
      memory: 4096, // Too large for 256 CPU units
      containerPort: 3000,
      imageTag: 'v1.0.0'
    };

    const report = auditor.auditConfiguration(config);

    expect(report.valid).toBe(false);
    expect(report.violations[0]).toContain('Invalid memory for 256 CPU');
  });

  test('should flag non-standard container port configurations', () => {
    const config: TaskDefinitionConfig = {
      cpu: 512,
      memory: 1024,
      containerPort: 8080, // Exposes 8080 instead of 3000
      imageTag: 'v1.0.0'
    };

    const report = auditor.auditConfiguration(config);

    expect(report.valid).toBe(false);
    expect(report.violations[0]).toContain('does not match Node.js default service port');
  });

  test('should flag mutable latest tags as production risks', () => {
    const config: TaskDefinitionConfig = {
      cpu: 256,
      memory: 1024,
      containerPort: 3000,
      imageTag: 'latest' // Mutable tag risk
    };

    const report = auditor.auditConfiguration(config);

    expect(report.valid).toBe(false);
    expect(report.violations[0]).toContain('Using \'latest\' image tag is not recommended');
  });
});
