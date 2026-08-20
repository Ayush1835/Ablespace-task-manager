'use client';

import { useState } from 'react';
import { Calendar, BarChart2, Plus, Edit2, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  progress: number;
}

interface ListViewProps {
  tasks: Task[];
  onOpenEditModal: (task: Task) => void;
  onOpenAddModal: () => void;
}

export default function ListView({ tasks, onOpenEditModal, onOpenAddModal }: ListViewProps) {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200/50 dark:border-red-900/50';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50';
      default:
        return 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200/50 dark:border-green-900/50';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
      case 'IN_REVIEW':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
      default:
        return 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400';
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const priorityMatch = filterPriority === 'ALL' || task.priority === filterPriority;
    const statusMatch = filterStatus === 'ALL' || task.status === filterStatus;
    return priorityMatch && statusMatch;
  });

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      {/* Filtering Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-4 rounded-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium text-xs shadow-md shadow-brand-500/10 hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Table Content panel */}
      <div className="flex-1 border border-slate-200/60 dark:border-slate-800/80 rounded-xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th className="py-3.5 px-6">Task Name</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => onOpenEditModal(task)}
                  className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-6 max-w-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-slate-800 dark:text-white leading-normal truncate">
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="text-xs text-slate-500 truncate mt-0.5">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${getStatusBadgeClass(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                    {task.dueDate ? (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>
                          {new Date(task.dueDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4 min-w-[120px]">
                    <div className="flex items-center gap-3">
                      <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-brand-500 h-1.5 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditModal(task);
                      }}
                      className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors inline-flex"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTasks.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-600">
              No matching tasks found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
