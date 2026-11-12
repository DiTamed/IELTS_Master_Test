import { StudentAssignment } from '@/types/assignment';
import { FIXED_REFERENCE_TIME_ISO } from './constants';
import { MOCK_ASSIGNMENTS } from './mock-data';
import { getServerSession } from './server-auth';
import { enrichAssignmentWithStatus } from './status-calculator';

export class AssignmentService {
  /**
   * Lấy danh sách bài tập cho một học viên cụ thể (đã được lọc ở tầng dữ liệu/service).
   * Đảm bảo tính cô lập dữ liệu (Data Isolation): học viên A không thể thấy bài của học viên B.
   */
  static getAssignmentsByStudentId(
    studentId: string,
    referenceTimeIso: string = FIXED_REFERENCE_TIME_ISO
  ): StudentAssignment[] {
    // 1. Lọc chính xác theo studentId
    const studentRawAssignments = MOCK_ASSIGNMENTS.filter(
      (item) => item.studentId === studentId
    );

    // 2. Tính toán trạng thái cho từng bài tập theo mốc thời gian cố định
    const enriched = studentRawAssignments.map((item) =>
      enrichAssignmentWithStatus(item, referenceTimeIso)
    );

    // 3. Sắp xếp thứ tự hiển thị: có thể theo ID hoặc hạn nộp
    return enriched.sort((a, b) => a.id.localeCompare(b.id));
  }

  /**
   * Lấy danh sách bài tập cho phiên đăng nhập hiện tại từ server session.
   * Đây là phương thức an toàn nhất được API route gọi.
   */
  static async getMyAssignments(
    request?: Request,
    referenceTimeIso: string = FIXED_REFERENCE_TIME_ISO
  ) {
    const session = await getServerSession(request);
    const assignments = this.getAssignmentsByStudentId(
      session.studentId,
      referenceTimeIso
    );

    return {
      user: session,
      assignments,
      referenceTime: referenceTimeIso,
      totalCount: assignments.length,
    };
  }
}

