import { EventBridgeAuditor, SqsLambdaConfig } from '../src/eventBridgeAuditor';

describe('AWS Serverless & Event-Driven Architecture Auditor Tests', () => {
  let auditor: EventBridgeAuditor;

  beforeEach(() => {
    auditor = new EventBridgeAuditor();
  });

  describe('SQS & Lambda Timeouts checks', () => {
    test('should pass validation on correct timeout allocations', () => {
      const config: SqsLambdaConfig = {
        sqsVisibilityTimeoutSeconds: 180,
        lambdaTimeoutSeconds: 30 // 180 >= 30 * 6
      };
      const report = auditor.auditSqsTimeout(config);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag SQS visibility timeouts below recommended thresholds', () => {
      const config: SqsLambdaConfig = {
        sqsVisibilityTimeoutSeconds: 100,
        lambdaTimeoutSeconds: 30 // 100 < 180
      };
      const report = auditor.auditSqsTimeout(config);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain('should be at least 6 times the Lambda function timeout');
    });
  });

  describe('SNS Attribute Filtering checks', () => {
    test('should pass verification on valid JSON filters', () => {
      const policy = JSON.stringify({
        event_type: ['order_placed', 'order_shipped']
      });
      const report = auditor.auditSnsFilter(policy);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should warn on subscriptions missing message routing attribute filters', () => {
      const policy = JSON.stringify({});
      const report = auditor.auditSnsFilter(policy);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain('declare message attribute filters');
    });

    test('should flag syntax errors on malformed filter JSON strings', () => {
      const policy = '{ invalid_json ';
      const report = auditor.auditSnsFilter(policy);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain('must be a valid JSON string');
    });
  });

  describe('AWS Step Functions ASL logic checks', () => {
    test('should pass validation on ASL JSON definitions with error handling', () => {
      const definition = JSON.stringify({
        Comment: "Orchestrator",
        States: {
          RunJob: {
            Type: "Task",
            Resource: "arn:aws:lambda:us-east-1:1234:function:run-job",
            Retry: [{ ErrorEquals: ["States.ALL"], MaxAttempts: 3 }]
          }
        }
      });
      const report = auditor.auditStepFunctionsAsl(definition);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag task states missing retry and catch options', () => {
      const definition = JSON.stringify({
        Comment: "Orchestrator",
        States: {
          ProcessData: {
            Type: "Task",
            Resource: "arn:aws:lambda:us-east-1:1234:function:process-data"
          }
        }
      }); // Missing Retry or Catch blocks
      const report = auditor.auditStepFunctionsAsl(definition);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("lacks error handling configurations");
    });
  });
});
