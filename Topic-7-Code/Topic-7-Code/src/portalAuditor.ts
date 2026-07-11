// LMS Learner Portal Progress Calculations & Configurations Auditor
import { LearnerProgress, calculateProgressPercentage } from './portalMocks';

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class PortalAuditor {
  // 1. Audit progress calculation parameters
  auditProgressMetrics(completedCount: number, totalCount: number): AuditReport {
    const violations: string[] = [];

    if (completedCount < 0 || totalCount < 0) {
      violations.push("Calculation Error: Completed lessons count and total lessons count cannot be negative numbers.");
      return { valid: false, violations };
    }

    if (completedCount > totalCount) {
      violations.push(`Calculation Error: Completed lessons count (${completedCount}) cannot exceed the total lessons count (${totalCount}).`);
    }

    const percentage = calculateProgressPercentage(completedCount, totalCount);
    if (percentage < 0 || percentage > 100) {
      violations.push(`Calculated bounds violation: Percentage value (${percentage}%) must fall within the range 0 to 100.`);
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit database record formats
  auditProgressRecord(record: LearnerProgress): AuditReport {
    const violations: string[] = [];

    if (!record.learnerId || record.learnerId.trim() === "") {
      violations.push("Configuration Error: Learner ID cannot be blank.");
    }

    if (!record.courseId || record.courseId.trim() === "") {
      violations.push("Configuration Error: Course ID cannot be blank.");
    }

    // Check for duplicate completed lesson logs
    const hasDuplicates = record.completedLessonIds.length !== new Set(record.completedLessonIds).size;
    if (hasDuplicates) {
      violations.push("Data Integrity Error: Progress logs contain duplicate completed lesson allocations.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
