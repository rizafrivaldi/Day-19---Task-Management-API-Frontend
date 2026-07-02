export const isOverDue = (task) => {
  if (!task.dueDate) return false;

  return task.status !== "Completed" && new Date(task.dueDate) < new Date();
};

export const getDaysLeft = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);

  const diff = due.getTime() - now.getTime();

  return Math.ceil(diff / (1000 * 60 * 24));
};

{
  /* Priority Sorting */
}
export const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

{
  /* Priority Badge Color */
}
export const priorityColor = {
  high: "bg-red-100 text-red-700",
  medium: "bg-orange-100 text-orange-700",
  low: "bg-blue-100 text-blue-700",
};
{
  /* Status Badge Color */
}
export const statusColor = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
};
