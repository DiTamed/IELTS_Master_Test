import React from 'react';
import { StudentAssignment } from '@/types/assignment';
import { BookOpen, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StatsOverviewProps {
  assignments: StudentAssignment[];
  currentFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  assignments,
  currentFilter,
  onSelectFilter,
}) => {
  const total = assignments.length;
  const pending = assignments.filter((a) => a.status.primaryStatus === 'PENDING').length;
  const overdue = assignments.filter((a) => a.status.primaryStatus === 'OVERDUE').length;
  const submitted = assignments.filter((a) => a.status.primaryStatus === 'SUBMITTED').length;
  const submittedLate = assignments.filter(
    (a) => a.status.primaryStatus === 'SUBMITTED' && a.status.isLate
  ).length;

  const cards = [
    {
      id: 'ALL',
      title: 'Tất cả bài tập',
      count: total,
      subtitle: `${total} bài được giao`,
      icon: BookOpen,
      color: 'blue',
      borderColor: currentFilter === 'ALL' ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-slate-200',
      badgeBg: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'PENDING',
      title: 'Chưa nộp',
      count: pending,
      subtitle: 'Cần hoàn thành',
      icon: Clock,
      color: 'amber',
      borderColor: currentFilter === 'PENDING' ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200',
      badgeBg: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'OVERDUE',
      title: 'Quá hạn',
      count: overdue,
      subtitle: 'Đã trễ thời hạn chót',
      icon: AlertCircle,
      color: 'rose',
      borderColor: currentFilter === 'OVERDUE' ? 'border-rose-600 ring-2 ring-rose-500/20' : 'border-slate-200',
      badgeBg: 'bg-rose-50 text-rose-700',
    },
    {
      id: 'SUBMITTED',
      title: 'Đã nộp',
      count: submitted,
      subtitle: submittedLate > 0 ? `Bao gồm ${submittedLate} bài nộp trễ` : 'Hoàn thành đúng hạn',
      icon: CheckCircle2,
      color: 'emerald',
      borderColor: currentFilter === 'SUBMITTED' ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200',
      badgeBg: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = currentFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`text-left bg-white rounded-xl p-4 sm:p-5 border transition-all duration-200 shadow-sm hover:shadow-md ${card.borderColor} ${
              isActive ? 'bg-slate-50/50' : 'hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.badgeBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {card.count}
              </span>
              <span className="text-xs text-slate-500 truncate">
                {card.subtitle}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

