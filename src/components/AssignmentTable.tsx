import React from 'react';
import { StudentAssignment } from '@/types/assignment';
import { StatusBadge } from './StatusBadge';
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
} from 'lucide-react';

interface AssignmentTableProps {
  assignments: StudentAssignment[];
  onSelectAssignment: (assignment: StudentAssignment) => void;
}

export function getSkillInfo(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes('reading')) {
    return {
      skill: 'Reading',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      icon: BookOpen,
    };
  }
  if (lower.includes('listening')) {
    return {
      skill: 'Listening',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      icon: Headphones,
    };
  }
  if (lower.includes('writing')) {
    return {
      skill: 'Writing',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      icon: PenTool,
    };
  }
  if (lower.includes('speaking')) {
    return {
      skill: 'Speaking',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      icon: Mic,
    };
  }
  return {
    skill: 'General',
    color: 'text-slate-600 bg-slate-50 border-slate-200',
    icon: FileText,
  };
}

export const AssignmentTable: React.FC<AssignmentTableProps> = ({
  assignments,
  onSelectAssignment,
}) => {
  return (
    <div className="hidden md:block overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50/80">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-6 pr-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Mã bài / Kỹ năng
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Tên bài tập
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Hạn nộp (GMT+7)
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Thời gian nộp (GMT+7)
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Trạng thái
              </th>
              <th
                scope="col"
                className="py-3.5 pl-3 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {assignments.map((item) => {
              const skill = getSkillInfo(item.title);
              const SkillIcon = skill.icon;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectAssignment(item)}
                >
                  {/* ID & Skill */}
                  <td className="whitespace-nowrap py-4 pl-6 pr-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                        {item.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${skill.color}`}
                      >
                        <SkillIcon className="w-3 h-3" />
                        {skill.skill}
                      </span>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-4">
                    <div className="font-semibold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      Học viên: {item.studentId}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{item.status.formattedDueDate}</span>
                    </div>
                  </td>

                  {/* Submitted At */}
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {item.status.formattedSubmittedDate ? (
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>{item.status.formattedSubmittedDate}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">— Chưa nộp —</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <StatusBadge status={item.status} size="md" />
                  </td>

                  {/* Action */}
                  <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAssignment(item);
                      }}
                      className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

