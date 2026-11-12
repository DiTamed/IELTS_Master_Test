'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ChevronDown, ChevronUp, Lock, Terminal } from 'lucide-react';

export const SecurityNotice: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    status?: number;
    message?: string;
    isSafe?: boolean;
    loading?: boolean;
  }>({ tested: false });

  const runIdorTest = async () => {
    setTestResult({ tested: true, loading: true });
    try {
      // Cố tình gửi query param studentId=S02 để giả lập tấn công IDOR
      const res = await fetch('/api/assignments?studentId=S02');
      const data = await res.json();

      if (res.status === 403) {
        setTestResult({
          tested: true,
          status: res.status,
          message: data.error || 'Server đã chặn thành công hành vi truy cập trái phép!',
          isSafe: true,
          loading: false,
        });
      } else {
        setTestResult({
          tested: true,
          status: res.status,
          message: 'Cảnh báo: Dữ liệu bị rò rỉ!',
          isSafe: false,
          loading: false,
        });
      }
    } catch (err: any) {
      setTestResult({
        tested: true,
        status: 500,
        message: 'Lỗi mạng khi thực hiện test: ' + err.message,
        isSafe: false,
        loading: false,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-8">
      {/* Header Banner */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Kiến trúc Bảo mật & Cơ chế Cách ly Dữ liệu Học viên
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Chống IDOR
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Tìm hiểu cách hệ thống ngăn chặn việc lộ bài tập B01 của học viên S02
            </p>
          </div>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 text-xs sm:text-sm text-slate-600 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <h5 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                1. Xác thực Server-Side (Không tin cậy Client)
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Định danh học viên (<code className="text-brand-600 font-mono">S01</code>) được phân giải trực tiếp từ phiên đăng nhập máy chủ (Session / Cookie / Token context). Hệ thống <strong>tuyệt đối không</strong> lấy <code className="text-rose-600 font-mono">studentId</code> từ URL (query hoặc path) làm tham số xác thực.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <h5 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-brand-600" />
                2. Phân quyền cấp độ dữ liệu (Row-Level Security)
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tầng Service thực thi truy vấn với bộ lọc cố định <code className="text-brand-600 font-mono">WHERE student_id = session.studentId</code>. Dữ liệu bài tập B01 thuộc S02 hoàn toàn bị loại trừ ngay từ tầng logic trước khi dữ liệu được serialize trả về client.
              </p>
            </div>
          </div>

          {/* Interactive IDOR Test */}
          <div className="p-4 bg-slate-900 rounded-xl text-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
                <Terminal className="w-4 h-4" />
                <span>Kiểm tra trực tiếp phòng thủ IDOR: GET /api/assignments?studentId=S02</span>
              </div>
              <button
                type="button"
                onClick={runIdorTest}
                disabled={testResult.loading}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                {testResult.loading ? 'Đang gửi request...' : 'Bấm để Test IDOR'}
              </button>
            </div>

            {testResult.tested && (
              <div
                className={`mt-3 p-2.5 rounded-lg text-xs font-mono border ${
                  testResult.isSafe
                    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-600 text-rose-200'
                }`}
              >
                <div className="font-bold mb-0.5">
                  Mã phản hồi HTTP: {testResult.status} {testResult.status === 403 ? '(Forbidden)' : ''}
                </div>
                <div>{testResult.message}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

