import { CurrentUserSession, RawAssignment } from '@/types/assignment';

/**
 * Danh sách người dùng giả lập trong hệ thống
 */
export const MOCK_USERS: Record<string, CurrentUserSession> = {
  S01: {
    studentId: 'S01',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana.s01@ieltsmaster.edu.vn',
    courseName: 'IELTS Foundation Band 4.5 - 5.5',
  },
  S02: {
    studentId: 'S02',
    fullName: 'Trần Thị B',
    email: 'tranthib.s02@ieltsmaster.edu.vn',
    courseName: 'IELTS Intensive Band 6.5 - 7.5',
  },
};

/**
 * Dữ liệu bài tập mẫu theo đặc tả đề bài (Múi giờ +07:00).
 * Lưu ý: Có cả bài của S01 và S02 để kiểm thử tính năng cách ly dữ liệu.
 */
export const MOCK_ASSIGNMENTS: RawAssignment[] = [
  {
    id: 'A01',
    studentId: 'S01',
    title: 'Foundation U1 – Reading',
    dueDate: '2026-11-13T23:59:00+07:00',
    submittedAt: null,
  },
  {
    id: 'A02',
    studentId: 'S01',
    title: 'Foundation U2 – Listening',
    dueDate: '2026-11-09T23:59:00+07:00',
    submittedAt: null,
  },
  {
    id: 'A03',
    studentId: 'S01',
    title: 'Foundation U3 – Writing',
    dueDate: '2026-11-10T23:59:00+07:00',
    submittedAt: '2026-11-10T20:00:00+07:00',
  },
  {
    id: 'A04',
    studentId: 'S01',
    title: 'Foundation U4 – Speaking',
    dueDate: '2026-11-08T23:59:00+07:00',
    submittedAt: '2026-11-10T12:00:00+07:00',
  },
  {
    id: 'B01',
    studentId: 'S02',
    title: 'Foundation U1 – Reading',
    dueDate: '2026-11-13T23:59:00+07:00',
    submittedAt: null,
  },
];

