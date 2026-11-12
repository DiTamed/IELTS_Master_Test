'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CurrentUserSession, StudentAssignment } from '@/types/assignment';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { AssignmentTable } from '@/components/AssignmentTable';
import { AssignmentCard } from '@/components/AssignmentCard';
import { AssignmentDetailModal } from '@/components/AssignmentDetailModal';
import { SecurityNotice } from '@/components/SecurityNotice';
import { FIXED_REFERENCE_TIME_LABEL } from '@/lib/constants';
import {
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function MyAssignmentsPage() {
  const [activeSessionId, setActiveSessionId] = useState<string>('S01');
  const [user, setUser] = useState<CurrentUserSession | undefined>();
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Controls
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'id' | 'due-asc' | 'due-desc'>('id');
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null);

  const fetchAssignments = async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API GET /api/assignments
      // Đính kèm header session nếu muốn test session S02
      const res = await fetch('/api/assignments', {
        headers: {
          'x-mock-session-id': sessionId,
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Không thể tải danh sách bài tập');
      }

      setUser(json.data.user);
      setAssignments(json.data.assignments);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments(activeSessionId);
  }, [activeSessionId]);

  // Lọc và sắp xếp bài tập
  const filteredAndSortedAssignments = useMemo(() => {
    let result = [...assignments];

    // 1. Lọc theo trạng thái
    if (statusFilter !== 'ALL') {
      result = result.filter((item) => item.status.primaryStatus === statusFilter);
    }

    // 2. Tìm kiếm theo từ khóa
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.status.displayLabel.toLowerCase().includes(q)
      );
    }

    // 3. Sắp xếp
    result.sort((a, b) => {
      if (sortBy === 'due-asc') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'due-desc') {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      return a.id.localeCompare(b.id);
    });

    return result;
  }, [assignments, statusFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      {/* Top Header */}
      <Header
        user={user}
        activeSessionId={activeSessionId}
        onSwitchSession={(id) => {
          setActiveSessionId(id);
          setStatusFilter('ALL');
          setSearchQuery('');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Title Bar & Simulation Banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                <Sparkles className="w-3 h-3" />
                Khóa học: {user?.courseName || 'IELTS Foundation'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bài tập của tôi
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Theo dõi tiến độ, hạn nộp và trạng thái các bài tập kỹ năng IELTS.
            </p>
          </div>

          {/* Reference Time Notice banner for Mobile & Quick Glance */}
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5 max-w-md shadow-sm">
            <Clock className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0 animate-pulse" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Thời điểm giả lập đối chiếu: </strong>
              <span className="font-semibold text-amber-950 font-mono">
                {FIXED_REFERENCE_TIME_LABEL}
              </span>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Mọi trạng thái được tính theo mốc cố định đề bài, không phụ thuộc ngày giờ máy tính.
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice / IDOR Defense Panel */}
        <SecurityNotice />

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-600">
              Đang tải danh sách bài tập cho học viên {activeSessionId}...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-center my-8">
            <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Không thể tải dữ liệu</h3>
            <p className="text-sm text-rose-700 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => fetchAssignments(activeSessionId)}
              className="px-4 py-2 bg-rose-600 text-white font-medium text-xs rounded-lg hover:bg-rose-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Main Content when loaded */}
        {!loading && !error && (
          <>
            {/* Overview Cards */}
            <StatsOverview
              assignments={assignments}
              currentFilter={statusFilter}
              onSelectFilter={setStatusFilter}
            />

            {/* Filter Bar & Search */}
            <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm mb-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên bài, mã bài..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Status Filter & Sort Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lọc:</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {[
                    { key: 'ALL', label: 'Tất cả' },
                    { key: 'PENDING', label: 'Chưa nộp' },
                    { key: 'OVERDUE', label: 'Quá hạn' },
                    { key: 'SUBMITTED', label: 'Đã nộp' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setStatusFilter(tab.key)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        statusFilter === tab.key
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sort dropdown */}
                <div className="relative ml-auto sm:ml-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="id">Sắp xếp: Mã bài</option>
                    <option value="due-asc">Hạn nộp: Gần nhất trước</option>
                    <option value="due-desc">Hạn nộp: Xa nhất trước</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Assignments View */}
            {filteredAndSortedAssignments.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-semibold text-slate-700 text-sm mb-1">
                  Không tìm thấy bài tập nào
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Không có bài tập nào phù hợp với bộ lọc hiện tại.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <AssignmentTable
                  assignments={filteredAndSortedAssignments}
                  onSelectAssignment={setSelectedAssignment}
                />

                {/* Mobile Cards View */}
                <div className="md:hidden space-y-3">
                  {filteredAndSortedAssignments.map((item) => (
                    <AssignmentCard
                      key={item.id}
                      assignment={item}
                      onSelect={setSelectedAssignment}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Modal Chi Tiết */}
        <AssignmentDetailModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-700">
            IELTS Master E-Learning Platform • Bài Test Tuyển Dụng Junior Full-Stack Developer
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Mốc thời gian quy chiếu: 11/11/2026, 09:00 (GMT+7) • Next.js + TypeScript + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

