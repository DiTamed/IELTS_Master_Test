import React from 'react';
import { StudentAssignment } from '@/types/assignment';
import { StatusBadge } from './StatusBadge';
import { getSkillInfo } from './AssignmentTable';
import { FIXED_REFERENCE_TIME_LABEL } from '@/lib/constants';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface AssignmentDetailModalProps {
  assignment: StudentAssignment | null;
  onClose: () => void;
}

export const AssignmentDetailModal: React.FC<AssignmentDetailModalProps> = ({
  assignment,
  onClose,
}) => {
  if (!assignment) return null;

  const skill = getSkillInfo(assignment.title);
  const SkillIcon = skill.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded">
            {assignment.id}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded border ${skill.color}`}
          >
            <SkillIcon className="w-3.5 h-3.5" />
            {skill.skill}
          </span>
          <span className="text-xs text-slate-500">
            Học viên: <strong className="text-slate-700">{assignment.studentId}</strong>
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-4">
          {assignment.title}
        </h3>

        {/* Current Status Banner */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-5">
          <div className="text-xs font-medium text-slate-500 mb-1.5">
            Trạng thái hiện tại:
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={assignment.status} size="md" />
          </div>
        </div>

        {/* Detailed Timeline */}
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <Calendar className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-slate-800">Hạn nộp bài</div>
              <div className="text-slate-600 font-mono text-xs mt-0.5">
                {assignment.status.formattedDueDate} (GMT+7)
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-slate-800">Mốc thời gian đối chiếu</div>
              <div className="text-slate-600 font-mono text-xs mt-0.5">
                {FIXED_REFERENCE_TIME_LABEL}
              </div>
              <div className="text-[11px] text-amber-700 mt-1">
                *Thời điểm cố định theo yêu cầu đề bài
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <CheckCircle2
              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                assignment.status.formattedSubmittedDate
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            />
            <div className="flex-1">
              <div className="font-semibold text-slate-800">Thời điểm nộp bài thực tế</div>
              <div className="text-slate-600 font-mono text-xs mt-0.5">
                {assignment.status.formattedSubmittedDate ? (
                  `${assignment.status.formattedSubmittedDate} (GMT+7)`
                ) : (
                  <span className="italic text-slate-400">Chưa ghi nhận lượt nộp</span>
                )}
              </div>
              {assignment.status.isLate && (
                <div className="flex items-center gap-1 text-xs text-amber-700 font-medium mt-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Nộp sau hạn chót quy định
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Explain Rule */}
        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/60 text-xs text-blue-900 flex items-start gap-2 mb-6">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Giải thích logic: </strong>
            {assignment.status.primaryStatus === 'SUBMITTED' && !assignment.status.isLate && (
              <span>Học viên đã nộp bài trước hoặc đúng thời hạn chót.</span>
            )}
            {assignment.status.primaryStatus === 'SUBMITTED' && assignment.status.isLate && (
              <span>Học viên đã nộp bài nhưng thời gian nộp trễ hơn hạn chót.</span>
            )}
            {assignment.status.primaryStatus === 'OVERDUE' && (
              <span>Bài tập chưa được nộp và thời điểm đối chiếu (11/11/2026 09:00) đã vượt quá hạn nộp.</span>
            )}
            {assignment.status.primaryStatus === 'PENDING' && (
              <span>Bài tập chưa được nộp nhưng thời điểm đối chiếu vẫn còn trước hạn nộp.</span>
            )}
          </div>
        </div>

        {/* Footer Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

