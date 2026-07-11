// Advanced Serverless & Event-Driven Architecture Auditor

export interface SqsLambdaConfig {
  sqsVisibilityTimeoutSeconds: number;
  lambdaTimeoutSeconds: number;
}

export interface AslStateConfig {
  Type: string;
  Retry?: any[];
  Catch?: any[];
}

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class EventBridgeAuditor {
  // 1. Audit SQS Visibility Timeout against Lambda Timeouts
  auditSqsTimeout(config: SqsLambdaConfig): AuditReport {
    const violations: string[] = [];

    // AWS Best Practice: SQS visibility timeout must be at least 6 times the Lambda timeout
    const recommendedTimeout = config.lambdaTimeoutSeconds * 6;
    if (config.sqsVisibilityTimeoutSeconds < recommendedTimeout) {
      violations.push(
        `Configuration Error: SQS visibility timeout (${config.sqsVisibilityTimeoutSeconds}s) should be at least 6 times the Lambda function timeout (${config.lambdaTimeoutSeconds}s) to prevent duplicate processing. Recommended: >= ${recommendedTimeout}s.`
      );
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit SNS Filter Policies configurations
  auditSnsFilter(filterPolicyJson: string): AuditReport {
    const violations: string[] = [];

    try {
      const policy = JSON.parse(filterPolicyJson);
      if (Object.keys(policy).length === 0) {
        violations.push("Best Practice Violation: SNS subscription should declare message attribute filters to avoid over-subscribing to unnecessary events.");
      }
    } catch {
      violations.push("Syntax Error: SNS subscription filter policy must be a valid JSON string.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 3. Audit AWS Step Functions Amazon States Language (ASL) Task States
  auditStepFunctionsAsl(aslContent: string): AuditReport {
    const violations: string[] = [];

    try {
      const definition = JSON.parse(aslContent);
      const states = definition.States || {};

      for (const [stateName, state] of Object.entries<AslStateConfig>(states)) {
        if (state.Type === 'Task') {
          const hasRetry = state.Retry && state.Retry.length > 0;
          const hasCatch = state.Catch && state.Catch.length > 0;

          if (!hasRetry && !hasCatch) {
            violations.push(
              `Resilience Warning: Task state '${stateName}' lacks error handling configurations ('Retry' or 'Catch' block).`
            );
          }
        }
      }
    } catch {
      violations.push("Syntax Error: Step Functions definition must be a valid ASL JSON string.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
