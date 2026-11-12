import React from 'react';
import { CurrentUserSession } from '@/types/assignment';
import { FIXED_REFERENCE_TIME_LABEL } from '@/lib/constants';
import { GraduationCap, Clock, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  user?: CurrentUserSession;
  activeSessionId: string;
  onSwitchSession: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeSessionId,
  onSwitchSession,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  IELTS MASTER
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  E-Learning
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Hệ thống Quản lý & Học tập Trực tuyến
              </p>
            </div>
          </div>

          {/* Right Section: Time Reference & Student Session */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Simulation Time indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>
                Mốc đối chiếu:{' '}
                <strong className="font-semibold">{FIXED_REFERENCE_TIME_LABEL}</strong>
              </span>
            </div>

            {/* Current Student Profile Box */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3 sm:border-l border-slate-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-700 font-bold text-sm">
                {user ? user.studentId : activeSessionId}
              </div>
              <div className="hidden md:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-slate-800">
                    {user?.fullName || 'Học viên'}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    <User className="w-2.5 h-2.5" />
                    {user?.studentId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate max-w-[180px]">
                  {user?.courseName || 'Khóa học IELTS'}
                </p>
              </div>

              {/* Demo Session Switcher (To test and demonstrate data isolation) */}
              <div className="relative">
                <select
                  value={activeSessionId}
                  onChange={(e) => onSwitchSession(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium cursor-pointer transition-colors"
                  title="Chuyển phiên giả lập để kiểm tra cách ly dữ liệu"
                >
                  <option value="S01">Phiên S01 (Chính thức)</option>
                  <option value="S02">Phiên S02 (Học viên khác)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

