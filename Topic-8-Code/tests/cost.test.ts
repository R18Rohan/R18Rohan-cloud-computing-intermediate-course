import { CloudResource, isOverprovisioned } from '../src/costMocks';
import { CostAuditor } from '../src/costAuditor';

describe('AWS Cost Optimization & Well-Architected Framework Tests', () => {
  let auditor: CostAuditor;

  beforeEach(() => {
    auditor = new CostAuditor();
  });

  describe('Resource sizing recommendations simulator', () => {
    test('isOverprovisioned identifies oversized instances', () => {
      expect(isOverprovisioned('t3.micro')).toBe(false);
      expect(isOverprovisioned('m5.large')).toBe(false);
      expect(isOverprovisioned('c5.4xlarge')).toBe(true);
      expect(isOverprovisioned('r5.8xlarge')).toBe(true);
    });
  });

  describe('Cost optimization configurations auditor', () => {
    test('should pass validation on correct tags and sizing settings', () => {
      const resource: CloudResource = {
        id: 'ec2-orion-prod',
        type: 'ec2',
        instanceType: 't3.micro',
        tags: {
          Environment: 'production',
          Project: 'orion-lms',
          Owner: 'devops-team'
        }
      };

      const report = auditor.auditResource(resource);
      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag resources missing cost allocation tags', () => {
      const resource: CloudResource = {
        id: 'ec2-orion-dev',
        type: 'ec2',
        instanceType: 't3.micro',
        tags: {
          Environment: 'development' // Missing Project and Owner
        }
      };
      const report = auditor.auditResource(resource);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("missing the required Cost Allocation tag");
    });

    test('should flag oversized instance types with sizing warnings', () => {
      const resource: CloudResource = {
        id: 'ec2-orion-heavy',
        type: 'ec2',
        instanceType: 'm5.8xlarge',
        tags: {
          Environment: 'production',
          Project: 'orion-lms',
          Owner: 'devops'
        }
      };
      const report = auditor.auditResource(resource);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("is provisioned on an oversized instance type");
    });

    test('should flag spot instances specifying invalid bid pricing values', () => {
      const resource: CloudResource = {
        id: 'ec2-orion-spot',
        type: 'ec2',
        instanceType: 't3.micro',
        tags: {
          Environment: 'development',
          Project: 'orion-lms',
          Owner: 'devops'
        },
        spotEnabled: true,
        spotBidPrice: -0.05 // Invalid negative price
      };
      const report = auditor.auditResource(resource);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("specifies an invalid spot bid price");
    });
  });
});
