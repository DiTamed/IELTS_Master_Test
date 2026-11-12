import { ComputedStatus, RawAssignment, StudentAssignment, SubmissionStatus } from '@/types/assignment';
import { FIXED_REFERENCE_TIME_ISO, formatToVNDateTime } from './constants';

/**
 * Tính toán trạng thái bài tập dựa trên hạn nộp, thời gian nộp và thời điểm mốc (reference time).
 * 
 * Quy tắc:
 * 1. Đã nộp:
 *    - Nộp trước hoặc đúng hạn (submittedAt <= dueDate) => "Đã nộp"
 *    - Nộp sau hạn (submittedAt > dueDate) => "Đã nộp" kèm huy hiệu / ghi chú "Nộp trễ"
 * 2. Chưa nộp (submittedAt == null):
 *    - Đã qua thời hạn tính đến thời điểm mốc (referenceDate > dueDate) => "Quá hạn"
 *    - Vẫn còn thời hạn tính đến thời điểm mốc (referenceDate <= dueDate) => "Chưa nộp"
 */
export function computeAssignmentStatus(
  dueDateIso: string,
  submittedAtIso: string | null,
  referenceTimeIso: string = FIXED_REFERENCE_TIME_ISO
): ComputedStatus {
  const dueTime = new Date(dueDateIso).getTime();
  const refTime = new Date(referenceTimeIso).getTime();

  const formattedDueDate = formatToVNDateTime(dueDateIso);
  const formattedSubmittedDate = submittedAtIso ? formatToVNDateTime(submittedAtIso) : undefined;

  // Trường hợp 1: Đã nộp bài
  if (submittedAtIso !== null) {
    const submittedTime = new Date(submittedAtIso).getTime();
    const isLate = submittedTime > dueTime;

    return {
      primaryStatus: 'SUBMITTED',
      displayLabel: 'Đã nộp',
      isLate,
      lateBadgeText: isLate ? 'Nộp trễ' : undefined,
      formattedDueDate,
      formattedSubmittedDate,
    };
  }

  // Trường hợp 2: Chưa nộp bài
  const isOverdue = refTime > dueTime;
  const primaryStatus: SubmissionStatus = isOverdue ? 'OVERDUE' : 'PENDING';
  const displayLabel = isOverdue ? 'Quá hạn' : 'Chưa nộp';

  return {
    primaryStatus,
    displayLabel,
    isLate: false,
    formattedDueDate,
  };
}

/**
 * Gắn trạng thái đã tính toán vào bài tập
 */
export function enrichAssignmentWithStatus(
  raw: RawAssignment,
  referenceTimeIso: string = FIXED_REFERENCE_TIME_ISO
): StudentAssignment {
  return {
    ...raw,
    status: computeAssignmentStatus(raw.dueDate, raw.submittedAt, referenceTimeIso),
  };
}

