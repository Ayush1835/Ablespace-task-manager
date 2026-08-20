'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Kanban, List, Search, Loader2, Sparkles, Plus, AlertCircle, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import KanbanBoard from '@/components/KanbanBoard';
import ListView from '@/components/ListView';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  progress: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Add Task Modal (Shared)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskStatus, setNewTaskStatus] = useState('TODO');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskProgress, setNewTaskProgress] = useState(0);

  // Edit Task Modal (Needed for List View)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDesc, setEditTaskDesc] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState('MEDIUM');
  const [editTaskStatus, setEditTaskStatus] = useState('TODO');
  const [editTaskDueDate, setEditTaskDueDate] = useState('');
  const [editTaskProgress, setEditTaskProgress] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return null;
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchTasks = async () => {
    const headers = getHeaders();
    if (!headers) return;

    try {
      setErrorMsg('');
      const res = await fetch('http://localhost:3001/api/tasks', { headers });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Could not load tasks from API');
      }
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to server');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id'>) => {
    const headers = getHeaders();
    if (!headers) return;

    setIsSyncing(true);
    try {
      const res = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers,
        body: JSON.stringify(taskData),
      });

      if (!res.ok) throw new Error('Failed to create task');
      await fetchTasks();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateTask = async (id: string, updatedFields: Partial<Task>) => {
    const headers = getHeaders();
    if (!headers) return;

    setIsSyncing(true);
    try {
      const res = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) throw new Error('Failed to update task');
      await fetchTasks();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const headers = getHeaders();
    if (!headers) return;

    setIsSyncing(true);
    try {
      const res = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) throw new Error('Failed to delete task');
      await fetchTasks();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Add Task submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await handleCreateTask({
      title: newTaskTitle,
      description: newTaskDesc,
      status: newTaskStatus,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined,
      progress: Number(newTaskProgress),
    });

    setIsAddModalOpen(false);
    // Reset fields
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority('MEDIUM');
    setNewTaskStatus('TODO');
    setNewTaskDueDate('');
    setNewTaskProgress(0);
  };

  // Edit Task modal trigger (for List View list rows)
  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDesc(task.description || '');
    setEditTaskPriority(task.priority);
    setEditTaskStatus(task.status);
    setEditTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setEditTaskProgress(task.progress);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !editTaskTitle.trim()) return;

    await handleUpdateTask(selectedTask.id, {
      title: editTaskTitle,
      description: editTaskDesc,
      status: editTaskStatus,
      priority: editTaskPriority,
      dueDate: editTaskDueDate || undefined,
      progress: Number(editTaskProgress),
    });

    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 text-brand-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading your board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar onLogout={handleLogout} />

      {/* Main dashboard content panel */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Block */}
        <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/80 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-lg text-slate-800 dark:text-white leading-none">Caseload Tasks</h1>
            {isSyncing && (
              <span className="flex items-center gap-1 text-[10px] text-brand-500 font-semibold uppercase animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving...
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Search Input */}
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-800 dark:text-white"
              />
            </div>

            {/* Toggle View switches */}
            <div className="bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
                title="Kanban Board View"
              >
                <Kanban className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Syncing/Connection Errors */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-xs text-red-500 dark:text-red-400 rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}. Make sure your NestJS backend server is running on port 3001.</span>
          </div>
        )}

        {/* Active Content view */}
        {viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={filteredTasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onCreateTask={handleCreateTask}
          />
        ) : (
          <ListView
            tasks={filteredTasks}
            onOpenEditModal={handleOpenEditModal}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}
      </main>

      {/* Shared Add Modal (For List view) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Add Caseload Task</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="E.g., Complete speech evaluation summary"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-850 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Task details and student tracking notes..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-850 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-850 dark:text-white"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Column Status</label>
                  <select
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value)}
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
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Progress ({newTaskProgress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={newTaskProgress}
                    onChange={(e) => setNewTaskProgress(Number(e.target.value))}
                    className="w-full h-10 mt-0.5 accent-brand-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-brand-500 hover:bg-brand-600 rounded-lg font-medium shadow-md shadow-brand-500/10 hover:shadow-lg transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Edit Modal (For List view) */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Edit Caseload Task</h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-850 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  value={editTaskDesc}
                  onChange={(e) => setEditTaskDesc(e.target.value)}
                  placeholder="Notes..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-850 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={editTaskPriority}
                    onChange={(e) => setEditTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-850 dark:text-white"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Column Status</label>
                  <select
                    value={editTaskStatus}
                    onChange={(e) => setEditTaskStatus(e.target.value)}
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
                    value={editTaskDueDate}
                    onChange={(e) => setEditTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Progress ({editTaskProgress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={editTaskProgress}
                    onChange={(e) => setEditTaskProgress(Number(e.target.value))}
                    className="w-full h-10 mt-0.5 accent-brand-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteTask(selectedTask.id);
                    setSelectedTask(null);
                  }}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-white hover:bg-red-500 px-3 py-2 rounded-lg border border-red-500/20 hover:border-transparent transition-all"
                >
                  Delete Task
                </button>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTask(null)}
                    className="px-4 py-2 text-sm text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg font-medium transition-colors"
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
