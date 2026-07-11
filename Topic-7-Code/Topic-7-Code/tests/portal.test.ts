import { calculateProgressPercentage, ProgressTracker, LearnerProgress } from '../src/portalMocks';
import { PortalAuditor } from '../src/portalAuditor';

describe('Learner Portal Progress Tracking Tests', () => {
  let tracker: ProgressTracker;
  let auditor: PortalAuditor;

  beforeEach(() => {
    tracker = new ProgressTracker();
    auditor = new PortalAuditor();
  });

  describe('Progress Mathematics & Mutations', () => {
    test('calculateProgressPercentage rounds and handles zero cases', () => {
      expect(calculateProgressPercentage(1, 3)).toBe(33); // 33.333% -> 33
      expect(calculateProgressPercentage(2, 3)).toBe(67); // 66.666% -> 67
      expect(calculateProgressPercentage(0, 5)).toBe(0);
      expect(calculateProgressPercentage(5, 0)).toBe(0); // Zero divisor guard
    });

    test('ProgressTracker marks completions and blocks duplicates', () => {
      tracker.initializeProgress('learner-1', 'course-1');
      expect(tracker.markLessonComplete('learner-1', 'course-1', 'lesson-a')).toBe(true);
      expect(tracker.markLessonComplete('learner-1', 'course-1', 'lesson-a')).toBe(false); // Block duplicate

      const progress = tracker.getProgress('learner-1', 'course-1');
      expect(progress).toBeDefined();
      expect(progress?.completedLessonIds).toEqual(['lesson-a']);
    });
  });

  describe('Portal Auditor Configuration & Calculations Checks', () => {
    test('should pass validation on correct metrics and records', () => {
      const record: LearnerProgress = {
        learnerId: 'student-42',
        courseId: 'ts-advanced',
        completedLessonIds: ['lesson-1', 'lesson-2']
      };

      const metricsReport = auditor.auditProgressMetrics(2, 10);
      const recordReport = auditor.auditProgressRecord(record);

      expect(metricsReport.valid).toBe(true);
      expect(recordReport.valid).toBe(true);
    });

    test('should flag calculations with negative counts parameters', () => {
      const report = auditor.auditProgressMetrics(-2, 10);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("cannot be negative numbers");
    });

    test('should flag calculations where completed count exceeds total count', () => {
      const report = auditor.auditProgressMetrics(15, 10);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("cannot exceed the total lessons count");
    });

    test('should flag records missing learner identification keys', () => {
      const record: LearnerProgress = {
        learnerId: '', // Blank
        courseId: 'ts-advanced',
        completedLessonIds: ['lesson-1']
      };
      const report = auditor.auditProgressRecord(record);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("Learner ID cannot be blank");
    });

    test('should flag records containing duplicate completed lesson entries', () => {
      const record: LearnerProgress = {
        learnerId: 'student-42',
        courseId: 'ts-advanced',
        completedLessonIds: ['lesson-1', 'lesson-1'] // Duplicate
      };
      const report = auditor.auditProgressRecord(record);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("duplicate completed lesson allocations");
    });
  });
});
