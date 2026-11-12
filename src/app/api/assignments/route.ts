import { AssignmentService } from '@/lib/assignment-service';
import { FIXED_REFERENCE_TIME_ISO } from '@/lib/constants';
import { getServerSession } from '@/lib/server-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/assignments
 * API trả về danh sách bài tập của học viên hiện tại (giả lập S01 ở server).
 * 
 * BẢO MẬT:
 * - Xác thực định danh hoàn toàn từ Server Session.
 * - Không lấy studentId từ URL làm xác thực.
 * - Ngăn chặn IDOR: Nếu phát hiện cố tình truyền ?studentId khác session, từ chối với 403 Forbidden.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. Xác thực người dùng hiện tại từ Server Session
    const session = await getServerSession(request);

    // 2. Kiểm tra xem client có cố tình truyền query param studentId để giả mạo/đọc trộm dữ liệu không
    const searchParams = request.nextUrl.searchParams;
    const requestedStudentId = searchParams.get('studentId');

    if (requestedStudentId && requestedStudentId !== session.studentId) {
      return NextResponse.json(
        {
          success: false,
          error: `Truy cập bị từ chối: Không được phép truy vấn dữ liệu của học viên [${requestedStudentId}]. Dữ liệu chỉ được trả về dựa trên phiên xác thực server của [${session.studentId}].`,
        },
        { status: 403 }
      );
    }

    // 3. Cho phép override referenceTime nếu muốn test (mặc định luôn là 11/11/2026 09:00 GMT+7)
    const customRefTime = searchParams.get('referenceTime') || FIXED_REFERENCE_TIME_ISO;

    // 4. Lấy dữ liệu qua service
    const data = await AssignmentService.getMyAssignments(request, customRefTime);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Đã xảy ra lỗi máy chủ nội bộ khi tải danh sách bài tập.',
      },
      { status: 500 }
    );
  }
}
