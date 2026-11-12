import { describe, it, expect } from 'vitest';
import { AssignmentService } from '@/lib/assignment-service';
import { FIXED_REFERENCE_TIME_ISO } from '@/lib/constants';

describe('Kiểm thử Dịch vụ Bài tập & Cô lập dữ liệu học viên (Assignment Service & Isolation)', () => {
  it('Yêu cầu chính: Lọc đúng các bài tập của học viên S01, không lẫn B01 của S02', () => {
    const s01Assignments = AssignmentService.getAssignmentsByStudentId(
      'S01',
      FIXED_REFERENCE_TIME_ISO
    );

    // 1. Phải có đúng 4 bài tập của S01 (A01, A02, A03, A04)
    expect(s01Assignments).toHaveLength(4);

    const ids = s01Assignments.map((a) => a.id);
    expect(ids).toEqual(['A01', 'A02', 'A03', 'A04']);

    // 2. Tuyệt đối không được chứa bài B01 của học viên S02
    expect(ids).not.toContain('B01');

    // 3. Toàn bộ các bài đều phải có studentId là 'S01'
    for (const item of s01Assignments) {
      expect(item.studentId).toBe('S01');
    }
  });

  it('Kiểm tra trạng thái hiển thị của từng bài tập theo kết quả cần đạt trong đề bài', () => {
    const s01Assignments = AssignmentService.getAssignmentsByStudentId(
      'S01',
      FIXED_REFERENCE_TIME_ISO
    );

    const map = new Map(s01Assignments.map((a) => [a.id, a]));

    // A01: Chưa nộp
    const a01 = map.get('A01')!;
    expect(a01.status.displayLabel).toBe('Chưa nộp');
    expect(a01.status.isLate).toBe(false);

    // A02: Quá hạn
    const a02 = map.get('A02')!;
    expect(a02.status.displayLabel).toBe('Quá hạn');
    expect(a02.status.isLate).toBe(false);

    // A03: Đã nộp (đúng hạn)
    const a03 = map.get('A03')!;
    expect(a03.status.displayLabel).toBe('Đã nộp');
    expect(a03.status.isLate).toBe(false);

    // A04: Đã nộp + Nộp trễ
    const a04 = map.get('A04')!;
    expect(a04.status.displayLabel).toBe('Đã nộp');
    expect(a04.status.isLate).toBe(true);
    expect(a04.status.lateBadgeText).toBe('Nộp trễ');
  });

  it('Kiểm tra cách ly dữ liệu ngược lại: Học viên S02 chỉ xem được B01, không thấy bài của S01', () => {
    const s02Assignments = AssignmentService.getAssignmentsByStudentId(
      'S02',
      FIXED_REFERENCE_TIME_ISO
    );

    expect(s02Assignments).toHaveLength(1);
    expect(s02Assignments[0].id).toBe('B01');
    expect(s02Assignments[0].studentId).toBe('S02');
  });

  it('Kiểm tra phương thức getMyAssignments với session mặc định S01', async () => {
    const result = await AssignmentService.getMyAssignments(
      undefined,
      FIXED_REFERENCE_TIME_ISO
    );

    expect(result.user.studentId).toBe('S01');
    expect(result.assignments).toHaveLength(4);
    expect(result.assignments.map((a) => a.id)).toEqual(['A01', 'A02', 'A03', 'A04']);
  });
});

