import { describe, it, expect } from 'vitest';
import { computeAssignmentStatus } from '@/lib/status-calculator';
import { FIXED_REFERENCE_TIME_ISO } from '@/lib/constants';

describe('Kiểm thử Logic Trạng thái Bài tập (Status Calculator)', () => {
  const REF_TIME = FIXED_REFERENCE_TIME_ISO; // 2026-11-11T09:00:00+07:00

  describe('4 Trường hợp theo đề bài với mốc thời gian 11/11/2026 09:00 (GMT+7)', () => {
    it('Trường hợp 1 (A01): Chưa nộp và còn hạn nộp -> "Chưa nộp"', () => {
      // Hạn nộp: 13/11/2026 23:59, Đã nộp: null
      const status = computeAssignmentStatus(
        '2026-11-13T23:59:00+07:00',
        null,
        REF_TIME
      );

      expect(status.primaryStatus).toBe('PENDING');
      expect(status.displayLabel).toBe('Chưa nộp');
      expect(status.isLate).toBe(false);
      expect(status.lateBadgeText).toBeUndefined();
    });

    it('Trường hợp 2 (A02): Chưa nộp và đã hết hạn -> "Quá hạn"', () => {
      // Hạn nộp: 09/11/2026 23:59, Đã nộp: null
      const status = computeAssignmentStatus(
        '2026-11-09T23:59:00+07:00',
        null,
        REF_TIME
      );

      expect(status.primaryStatus).toBe('OVERDUE');
      expect(status.displayLabel).toBe('Quá hạn');
      expect(status.isLate).toBe(false);
      expect(status.lateBadgeText).toBeUndefined();
    });

    it('Trường hợp 3 (A03): Đã nộp trước hạn -> "Đã nộp" (không có nhãn nộp trễ)', () => {
      // Hạn nộp: 10/11/2026 23:59, Đã nộp: 10/11/2026 20:00
      const status = computeAssignmentStatus(
        '2026-11-10T23:59:00+07:00',
        '2026-11-10T20:00:00+07:00',
        REF_TIME
      );

      expect(status.primaryStatus).toBe('SUBMITTED');
      expect(status.displayLabel).toBe('Đã nộp');
      expect(status.isLate).toBe(false);
      expect(status.lateBadgeText).toBeUndefined();
      expect(status.formattedSubmittedDate).toBe('10/11/2026 20:00');
    });

    it('Trường hợp 4 (A04): Đã nộp sau hạn -> "Đã nộp" + "Nộp trễ"', () => {
      // Hạn nộp: 08/11/2026 23:59, Đã nộp: 10/11/2026 12:00
      const status = computeAssignmentStatus(
        '2026-11-08T23:59:00+07:00',
        '2026-11-10T12:00:00+07:00',
        REF_TIME
      );

      expect(status.primaryStatus).toBe('SUBMITTED');
      expect(status.displayLabel).toBe('Đã nộp');
      expect(status.isLate).toBe(true);
      expect(status.lateBadgeText).toBe('Nộp trễ');
      expect(status.formattedSubmittedDate).toBe('10/11/2026 12:00');
    });
  });

  describe('Kiểm thử các trường hợp biên (Edge Cases)', () => {
    it('Nộp đúng vào giây cuối cùng của hạn nộp -> Tính là đúng hạn ("Đã nộp", không trễ)', () => {
      const status = computeAssignmentStatus(
        '2026-11-10T23:59:00+07:00',
        '2026-11-10T23:59:00+07:00',
        REF_TIME
      );

      expect(status.primaryStatus).toBe('SUBMITTED');
      expect(status.isLate).toBe(false);
    });

    it('Nộp trễ 1 phút so với hạn nộp -> Phải đánh dấu "Nộp trễ"', () => {
      const status = computeAssignmentStatus(
        '2026-11-10T23:59:00+07:00',
        '2026-11-11T00:00:00+07:00',
        REF_TIME
      );

      expect(status.primaryStatus).toBe('SUBMITTED');
      expect(status.isLate).toBe(true);
      expect(status.lateBadgeText).toBe('Nộp trễ');
    });

    it('Mốc thời gian đúng bằng hạn nộp và chưa nộp -> Vẫn còn hạn ("Chưa nộp")', () => {
      const status = computeAssignmentStatus(
        '2026-11-11T09:00:00+07:00',
        null,
        '2026-11-11T09:00:00+07:00'
      );

      expect(status.primaryStatus).toBe('PENDING');
      expect(status.displayLabel).toBe('Chưa nộp');
    });

    it('Mốc thời gian trễ hơn hạn nộp 1 giây và chưa nộp -> Đã chuyển sang "Quá hạn"', () => {
      const status = computeAssignmentStatus(
        '2026-11-11T09:00:00+07:00',
        null,
        '2026-11-11T09:00:01+07:00'
      );

      expect(status.primaryStatus).toBe('OVERDUE');
      expect(status.displayLabel).toBe('Quá hạn');
    });
  });
});

