import { useState } from "react";
import {
  isOverDue,
  getDaysLeft,
  priorityColor,
  statusColor,
} from "../utils/taskUtils";
import DeleteTaskDialog from "../components/dialogs/DeleteTaskDialog";

function TaskCard({ task, handleEdit, handleDelete, toggleStatus }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const createdDate = new Date(task.createdAt).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isCompleted = task.status === "Completed";

  const daysLeft = task.dueDate ? getDaysLeft(task.dueDate) : null;

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2
            className={`text-xl font-semibold ${
              isCompleted ? "text-gray-400" : ""
            }`}
          >
            {task.title}
          </h2>

          <p className="text-gray-600 mt-2">{task.description}</p>
        </div>

        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => {
            e.stopPropagation();
            toggleStatus(task);
          }}
          aria-label={
            isCompleted
              ? `Mark "${task.title}" as pending`
              : `Mark "${task.title}" as completed`
          }
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      <div className="mt-2">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            statusColor[task.status]
          }`}
        >
          {task.status.toUpperCase()}
        </span>

        {isOverDue(task) && (
          <span className="ml-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
            OVERDUE
          </span>
        )}

        <span
          className={`ml-2 px-3 py-1 rounded-full text-sm ${
            priorityColor[task.priority]
          }`}
        >
          {task.priority.toUpperCase()}
        </span>

        <p className="text-sm text-gray-500 mt-2">Created: {createdDate}</p>

        {task.dueDate && (
          <p className="text-sm text-gray-500 mt-1">{daysLeft} days left</p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="
    rounded-lg
    bg-gray-100
    px-4
    py-2
    text-sm
    font-medium
    hover:bg-yellow-100
    transition
  "
          onClick={() => handleEdit(task)}
        >
          Edit
        </button>

        <button
          type="button"
          className="
    rounded-lg
    bg-gray-100
    px-4
    py-2
    text-sm
    font-medium
    hover:bg-red-100
    transition
  "
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </button>
      </div>

      <DeleteTaskDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => handleDelete(task.id)}
      />
    </div>
  );
}

export default TaskCard;
