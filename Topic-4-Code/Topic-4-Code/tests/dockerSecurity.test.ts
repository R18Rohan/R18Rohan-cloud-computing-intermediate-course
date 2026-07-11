import { DockerSecurityAuditor } from '../src/dockerSecurityAuditor';

describe('Advanced Docker & Container Security Auditor Tests', () => {
  let auditor: DockerSecurityAuditor;

  beforeEach(() => {
    auditor = new DockerSecurityAuditor();
  });

  describe('Dockerfile Security checks', () => {
    test('should pass validation on compliant multi-stage non-root Dockerfiles', () => {
      const content = `
        FROM node:18 AS builder
        WORKDIR /app
        COPY . .
        RUN npm run build

        FROM node:18-alpine AS runner
        USER node
        COPY --from=builder /app/dist ./dist
      `;
      const report = auditor.auditDockerfile(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag missing USER non-root statements', () => {
      const content = `
        FROM node:18 AS builder
        WORKDIR /app
        COPY . .
        RUN npm run build

        FROM node:18-alpine AS runner
        COPY --from=builder /app/dist ./dist
      `; // Missing USER node
      const report = auditor.auditDockerfile(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must declare a non-root 'USER' statement");
    });

    test('should flag single stage Dockerfiles', () => {
      const content = `
        FROM node:18
        USER node
        COPY . .
      `; // Single FROM stage
      const report = auditor.auditDockerfile(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("should utilize multi-stage builds");
    });
  });

  describe('Docker Compose security checks', () => {
    test('should pass compliance on standard, secure compose configurations', () => {
      const content = `
        version: "3"
        services:
          web:
            image: nginx
            read_only: true
            networks:
              - bridge-net
        networks:
          bridge-net:
            driver: bridge
      `;
      const report = auditor.auditDockerCompose(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag containers running with writeable filesystems', () => {
      const content = `
        version: "3"
        services:
          web:
            image: nginx
            networks:
              - bridge-net
        networks:
          bridge-net:
            driver: bridge
      `; // Missing read_only: true
      const report = auditor.auditDockerCompose(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("run with read-only filesystems");
    });
  });
});
