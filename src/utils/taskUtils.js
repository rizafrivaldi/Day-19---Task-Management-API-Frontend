export const isOverDue = (task) => {
  if (!task.dueDate) return false;

  return task.status !== "Completed" && new Date(task.dueDate) < new Date();
};

export const getDaysLeft = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);

  const msPerDay = 1000 * 60 * 60 * 24;

  const diff = due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);

  return Math.ceil(diff / msPerDay);
};

// Priority Sorting
export const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

// Priority Badge Color
export const priorityColor = {
  high: "bg-red-100 text-red-700",
  medium: "bg-orange-100 text-orange-700",
  low: "bg-blue-100 text-blue-700",
};

// Status Badge Color
export const statusColor = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

export const filterAndSortTasks = (
  tasks,
  search,
  filterStatus,
  priorityOrder,
) => {
  return [...tasks]
    .filter((task) =>
      `${task.title || ""} ${task.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .filter((task) =>
      filterStatus === "all" ? true : task.status === filterStatus,
    )
    .sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") return 1;

      if (a.status !== "Completed" && b.status === "Completed") return -1;

      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
};

export const paginateTasks = (tasks, currentPage, tasksPerPage) => {
  const last = currentPage * tasksPerPage;
  const first = last - tasksPerPage;

  return {
    currentTasks: tasks.slice(first, last),
    totalPages: Math.ceil(tasks.length / tasksPerPage),
  };
};

export const getTaskStats = (tasks) => {
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status.toLowerCase() === "pending",
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status.toLowerCase() === "completed",
  ).length;

  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    pendingTasks,
    completedTasks,
    progress,
  };
};
