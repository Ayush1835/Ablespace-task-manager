export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  isGuest: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date;
  progress: number;
  assigneeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const usersStore = new Map<string, User>();
export const tasksStore = new Map<string, Task>();

export function seedDefaultTasks(userId: string) {
  const defaults = [
    {
      title: "Write IEP goal report for Alex Smith",
      description: "Draft progress summary based on speech production accuracy data.",
      status: "TODO",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 86400000 * 2),
      progress: 0,
    },
    {
      title: "Prepare target materials for articulation session",
      description: "Print /s/ blend word lists and flashcards.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      dueDate: new Date(Date.now() + 86400000 * 1),
      progress: 50,
    },
    {
      title: "Sync caseload data with district repository",
      description: "Completed import of student roster from district database.",
      status: "DONE",
      priority: "LOW",
      dueDate: new Date(),
      progress: 100,
    }
  ];

  defaults.forEach((t, i) => {
    const taskId = `task-default-${userId}-${i}`;
    tasksStore.set(taskId, {
      id: taskId,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      progress: t.progress,
      assigneeId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
}
