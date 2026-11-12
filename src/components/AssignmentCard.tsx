import React from 'react';
import { StudentAssignment } from '@/types/assignment';
import { StatusBadge } from './StatusBadge';
import { getSkillInfo } from './AssignmentTable';
import { Calendar, CheckCircle2, ChevronRight, Clock } from 'lucide-react';

interface AssignmentCardProps {
  assignment: StudentAssignment;
  onSelect: (assignment: StudentAssignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onSelect,
}) => {
  const skill = getSkillInfo(assignment.title);
  const SkillIcon = skill.icon;

  return (
    <div
      onClick={() => onSelect(assignment)}
      className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
    >
      {/* Top Header: ID, Skill, Status */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {assignment.id}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${skill.color}`}
          >
            <SkillIcon className="w-3 h-3" />
            {skill.skill}
          </span>
        </div>
        <StatusBadge status={assignment.status} size="sm" />
      </div>

      {/* Assignment Title */}
      <h3 className="text-base font-bold text-slate-900 mb-3 leading-snug">
        {assignment.title}
      </h3>

      {/* Date Details */}
      <div className="space-y-1.5 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Hạn nộp:
          </span>
          <span className="font-semibold text-slate-800">
            {assignment.status.formattedDueDate}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
            Thời gian nộp:
          </span>
          {assignment.status.formattedSubmittedDate ? (
            <span className="font-semibold text-slate-900">
              {assignment.status.formattedSubmittedDate}
            </span>
          ) : (
            <span className="text-slate-400 italic">— Chưa nộp —</span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
        <span>Mã học viên: {assignment.studentId}</span>
        <span className="inline-flex items-center font-semibold text-brand-600">
          Chi tiết <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>
    </div>
  );
};

