import { CurrentUserSession } from '@/types/assignment';
import { MOCK_USERS } from './mock-data';

/**
 * Server-side Authentication & Session Resolver
 * 
 * NGUYÊN TẮC BẢO MẬT:
 * 1. Danh tính học viên (Identity) được xác thực và trích xuất HOÀN TOÀN ở phía SERVER
 *    (thông qua Session Cookie, Server-side Session Store, hoặc Server Context giả lập).
 * 2. TUYỆT ĐỐI KHÔNG tin cậy và KHÔNG sử dụng `studentId` từ URL (Query string/Path param)
 *    để quyết định dữ liệu trả về, nhằm triệt tiêu hoàn toàn lỗ hổng IDOR (Insecure Direct Object Reference).
 */

export const DEFAULT_STUDENT_ID = 'S01';

export async function getServerSession(request?: Request): Promise<CurrentUserSession> {
  // Trong môi trường production, session được đọc từ HTTP-only Cookie hoặc JWT Bearer token
  // Giả lập tại server: Mặc định luôn là tài khoản S01
  let targetStudentId = DEFAULT_STUDENT_ID;

  if (request) {
    // Tùy chọn: Cho phép kiểm thử với các session khác thông qua Header chuyên biệt "x-mock-session-id"
    // (Header này đại diện cho Bearer Token đã được verify bởi API Gateway/Auth Middleware)
    const customSessionHeader = request.headers.get('x-mock-session-id');
    if (customSessionHeader && MOCK_USERS[customSessionHeader]) {
      targetStudentId = customSessionHeader;
    }
  }

  const user = MOCK_USERS[targetStudentId] || MOCK_USERS[DEFAULT_STUDENT_ID];
  return user;
}

