// LMS Learner Portal Progress Logic Mocks & Simulators

export interface LearnerProgress {
  learnerId: string;
  courseId: string;
  completedLessonIds: string[];
}

export function calculateProgressPercentage(completedCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  const percentage = (completedCount / totalCount) * 100;
  // Round to nearest integer for clean dashboard visual updates
  return Math.round(percentage);
}

export class ProgressTracker {
  private progressRecords: LearnerProgress[] = [];

  initializeProgress(learnerId: string, courseId: string): LearnerProgress {
    const record: LearnerProgress = { learnerId, courseId, completedLessonIds: [] };
    this.progressRecords.push(record);
    return record;
  }

  markLessonComplete(learnerId: string, courseId: string, lessonId: string): boolean {
    const record = this.progressRecords.find(r => r.learnerId === learnerId && r.courseId === courseId);
    if (!record) return false;
    if (record.completedLessonIds.includes(lessonId)) return false; // Duplicate block
    record.completedLessonIds.push(lessonId);
    return true;
  }

  getProgress(learnerId: string, courseId: string): LearnerProgress | undefined {
    return this.progressRecords.find(r => r.learnerId === learnerId && r.courseId === courseId);
  }
}
