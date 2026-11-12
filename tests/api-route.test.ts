import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/assignments/route';
import { NextRequest } from 'next/server';

describe('Kiểm thử API Route GET /api/assignments & Bảo mật ngăn chặn lộ dữ liệu (IDOR Prevention)', () => {
  it('API trả về danh sách bài tập của học viên S01 theo session server mặc định', async () => {
    const req = new NextRequest('http://localhost:3000/api/assignments');
    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.user.studentId).toBe('S01');
    expect(body.data.assignments).toHaveLength(4);

    const ids = body.data.assignments.map((item: { id: string }) => item.id);
    expect(ids).toEqual(['A01', 'A02', 'A03', 'A04']);
    expect(ids).not.toContain('B01');
  });

  it('Bảo mật: Từ chối truy cập 403 Forbidden nếu client cố tình truyền ?studentId=S02 trong URL', async () => {
    // Kẻ tấn công hoặc học viên S01 cố tình sửa URL params ?studentId=S02 để đọc trộm dữ liệu
    const req = new NextRequest('http://localhost:3000/api/assignments?studentId=S02');
    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error).toContain('Truy cập bị từ chối');
    expect(body.data).toBeUndefined();
  });

  it('Bảo mật: Xác thực dựa trên session context chứ không phải URL param', async () => {
    // Session context S02 giả lập hợp lệ qua header token
    const req = new NextRequest('http://localhost:3000/api/assignments', {
      headers: {
        'x-mock-session-id': 'S02',
      },
    });
    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.user.studentId).toBe('S02');
    expect(body.data.assignments).toHaveLength(1);
    expect(body.data.assignments[0].id).toBe('B01');
  });
});

