import React from 'react';
import { ComputedStatus } from '@/types/assignment';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: ComputedStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSmall = size === 'sm';

  const renderBadge = () => {
    switch (status.primaryStatus) {
      case 'PENDING':
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 ${
              isSmall ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
            }`}
          >
            <Clock className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            {status.displayLabel}
          </span>
        );

      case 'OVERDUE':
        return (
          <span
            className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${
              isSmall ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
            }`}
          >
            <AlertCircle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            {status.displayLabel}
          </span>
        );

      case 'SUBMITTED':
        return (
          <div className="inline-flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${
                isSmall ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
              }`}
            >
              <CheckCircle2 className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
              {status.displayLabel}
            </span>

            {status.isLate && (
              <span
                className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-300 animate-pulse-subtle ${
                  isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs'
                }`}
                title="Bài tập được nộp sau thời hạn chót"
              >
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                {status.lateBadgeText || 'Nộp trễ'}
              </span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="inline-block">{renderBadge()}</div>;
};

