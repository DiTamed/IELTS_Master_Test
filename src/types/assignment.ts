/**
 * Domain types for IELTS Master - "Bài tập của tôi"
 */

export type SubmissionStatus = 'PENDING' | 'OVERDUE' | 'SUBMITTED';

export interface RawAssignment {
  id: string;
  studentId: string;
  title: string;
  dueDate: string; // ISO 8601 with timezone (e.g. 2026-11-13T23:59:00+07:00)
  submittedAt: string | null; // ISO 8601 or null if not submitted
}

export interface ComputedStatus {
  primaryStatus: SubmissionStatus; // PENDING | OVERDUE | SUBMITTED
  displayLabel: string; // "Chưa nộp" | "Quá hạn" | "Đã nộp"
  isLate: boolean; // true nếu nộp sau hạn (Nộp trễ)
  lateBadgeText?: string; // "Nộp trễ"
  formattedDueDate: string; // e.g. "13/11/2026 23:59 (GMT+7)"
  formattedSubmittedDate?: string; // e.g. "10/11/2026 20:00 (GMT+7)"
}

export interface StudentAssignment extends RawAssignment {
  status: ComputedStatus;
}

export interface CurrentUserSession {
  studentId: string;
  fullName: string;
  email: string;
  courseName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  referenceTime?: string;
}

