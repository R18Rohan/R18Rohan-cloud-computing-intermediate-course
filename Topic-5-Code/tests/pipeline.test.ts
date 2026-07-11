import { PipelineAuditor } from '../src/pipelineAuditor';

describe('AWS DevOps & CI/CD Pipeline Configurations Auditor Tests', () => {
  let auditor: PipelineAuditor;

  beforeEach(() => {
    auditor = new PipelineAuditor();
  });

  describe('CodeBuild buildspec checks', () => {
    test('should pass validation on compliant buildspecs', () => {
      const content = `
        version: 0.2
        phases:
          build:
            commands:
              - npm run build
          post_build:
            commands:
              - npm run test
      `;
      const report = auditor.auditBuildspec(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag buildspecs missing build stages', () => {
      const content = `
        version: 0.2
        phases:
          install:
            commands:
              - echo installing
      `;
      const report = auditor.auditBuildspec(content);

      expect(report.valid).toBe(false);
      expect(report.violations).toContain("Configuration Error: buildspec.yml must declare a 'build' phase task.");
    });

    test('should flag buildspecs failing Shift-Left test rules', () => {
      const content = `
        version: 0.2
        phases:
          build:
            commands:
              - npm run build
          post_build:
            commands:
              - echo skipping tests
      `; // Missing npm run test or test command
      const report = auditor.auditBuildspec(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("Shift-Left Security Violation: buildspec.yml must run tests");
    });
  });

  describe('CodeDeploy appspec checks', () => {
    test('should pass verification on valid appspec files', () => {
      const content = `
        version: 0.0
        os: linux
        hooks:
          ValidateService:
            - location: scripts/validate.sh
      `;
      const report = auditor.auditAppspec(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag appspecs missing ValidateService deployment hooks', () => {
      const content = `
        version: 0.0
        os: linux
        hooks:
          ApplicationStart:
            - location: scripts/start.sh
      `; // Missing ValidateService
      const report = auditor.auditAppspec(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("appspec.yml must define a 'ValidateService' lifecycle hook");
    });
  });

  describe('GitHub Actions OIDC permissions checks', () => {
    test('should pass validation on workflows defining id-token: write', () => {
      const content = `
        name: deploy
        permissions:
          id-token: write
        jobs:
          run-deploy:
            steps:
              - uses: aws-actions/configure-aws-credentials@v2
                with:
                  role-to-assume: arn:aws:iam::123:role/deploy
      `;
      const report = auditor.auditGithubWorkflow(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag OIDC credentials actions missing token permissions', () => {
      const content = `
        name: deploy
        permissions:
          contents: read
        jobs:
          run-deploy:
            steps:
              - uses: aws-actions/configure-aws-credentials@v2
                with:
                  role-to-assume: arn:aws:iam::123:role/deploy
      `; // Missing id-token: write
      const report = auditor.auditGithubWorkflow(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("GitHub Actions OIDC logins require 'id-token: write' workflow permissions");
    });
  });
});
