'use client';

import { useState } from 'react';
import { Plus, Calendar, BarChart2, Edit2, Trash2, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  progress: number;
}

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (id: string, updatedFields: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onCreateTask: (task: Omit<Task, 'id'>) => Promise<void>;
}

export default function KanbanBoard({ tasks, onUpdateTask, onDeleteTask, onCreateTask }: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalPriority, setModalPriority] = useState('MEDIUM');
  const [modalStatus, setModalStatus] = useState('TODO');
  const [modalDueDate, setModalDueDate] = useState('');
  const [modalProgress, setModalProgress] = useState(0);

  const columns = [
    { id: 'TODO', title: 'To Do', color: 'border-t-slate-400 bg-slate-100/40 dark:bg-slate-900/30' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'border-t-blue-500 bg-blue-50/10 dark:bg-blue-900/10' },
    { id: 'IN_REVIEW', title: 'In Review', color: 'border-t-amber-500 bg-amber-50/10 dark:bg-amber-900/10' },
    { id: 'DONE', title: 'Done', color: 'border-t-green-500 bg-green-50/10 dark:bg-green-900/10' },
  ];

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setActiveDropColumn(columnId);
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);
    setActiveDropColumn(null);

    if (taskId) {
      await onUpdateTask(taskId, { status: columnId });
    }
  };

  const handleOpenAddModal = (statusId: string) => {
    setEditingTask(null);
    setModalTitle('');
    setModalDesc('');
    setModalPriority('MEDIUM');
    setModalStatus(statusId);
    setModalDueDate('');
    setModalProgress(0);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setModalTitle(task.title);
    setModalDesc(task.description || '');
    setModalPriority(task.priority);
    setModalStatus(task.status);
    setModalDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setModalProgress(task.progress);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    const taskData = {
      title: modalTitle,
      description: modalDesc,
      status: modalStatus,
      priority: modalPriority,
      dueDate: modalDueDate || undefined,
      progress: Number(modalProgress),
    };

    if (editingTask) {
      await onUpdateTask(editingTask.id, taskData);
    } else {
      await onCreateTask(taskData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await onDeleteTask(id);
      setIsModalOpen(false);
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200/50 dark:border-red-900/50';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50';
      default:
        return 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200/50 dark:border-green-900/50';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Board Columns Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 p-6 overflow-y-auto">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col h-full min-h-[500px] max-h-[calc(100vh-14rem)] rounded-xl border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${col.color} p-4 transition-all duration-200 ${
                activeDropColumn === col.id ? 'ring-2 ring-brand-500/20 bg-slate-200/20 dark:bg-slate-900/40 scale-[1.01]' : ''
              }`}
            >
              {/* Header info */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-white">{col.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenAddModal(col.id)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Scrollable list of cards */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => handleOpenEditModal(task)}
                    className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 rounded-xl p-4 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 hover:-translate-y-0.5 border-l-3"
                    style={{
                      borderLeftColor:
                        task.priority === 'HIGH' ? '#ef4444' : task.priority === 'MEDIUM' ? '#f59e0b' : '#10b981',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-1.5 leading-snug line-clamp-2">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3.5 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Progress Bar & Indicators */}
                    <div className="space-y-2 mt-auto">
                      {task.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-medium text-slate-500">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-brand-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/40 text-[10px] font-medium text-slate-500">
                        {task.dueDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        ) : (
                          <div></div>
                        )}
                        <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800/60 rounded">
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-28 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400 dark:text-slate-600">
                    No tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Add Modal Panel */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                {editingTask ? 'Edit Caseload Task' : 'Add Caseload Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="E.g., Write IEP summary report"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  placeholder="Task details and target notes..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-800 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={modalPriority}
                    onChange={(e) => setModalPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-850 dark:text-white"
                  >
                    <option value="HIGH">High (Red)</option>
                    <option value="MEDIUM">Medium (Amber)</option>
                    <option value="LOW">Low (Green)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Column Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-850 dark:text-white"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={modalDueDate}
                    onChange={(e) => setModalDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Progress ({modalProgress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={modalProgress}
                    onChange={(e) => setModalProgress(Number(e.target.value))}
                    className="w-full h-10 mt-0.5 accent-brand-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(editingTask.id)}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-white hover:bg-red-500 px-3 py-2 rounded-lg border border-red-500/20 hover:border-transparent transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Task
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-brand-500 hover:bg-brand-600 rounded-lg font-medium shadow-md shadow-brand-500/10 hover:shadow-lg transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
