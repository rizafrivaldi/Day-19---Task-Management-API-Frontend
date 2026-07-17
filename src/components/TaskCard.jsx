import {
  isOverDue,
  getDaysLeft,
  priorityColor,
  statusColor,
} from "../utils/taskUtils";

function TaskCard({ task, handleEdit, handleDelete, toggleStatus }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2
            className={`text-xl font-semibold ${
              task.status === "Completed" ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </h2>

          <p className="text-gray-600 mt-2">{task.description}</p>
        </div>

        <input
          type="checkbox"
          checked={task.status === "Completed"}
          onChange={(e) => {
            e.stopPropagation();
            toggleStatus(task);
          }}
          className="w-6 h-6 mt-1 cursor-pointer"
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

        <p className="text-sm text-gray-500 mt-2">
          Created:{" "}
          {new Date(task.createdAt).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {task.dueDate && (
          <p className="text-sm text-gray-500 mt-1">
            {getDaysLeft(task.dueDate)} days left
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="bg-gray-100 hover:bg-yellow-300 px-4 py-2 rounded"
          onClick={() => handleEdit(task)}
        >
          Edit
        </button>

        <button
          type="button"
          className="bg-gray-100 hover:bg-red-400 px-4 py-2 rounded"
          onClick={() => handleDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
