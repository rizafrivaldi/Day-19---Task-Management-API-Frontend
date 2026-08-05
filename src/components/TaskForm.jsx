import { Loader2 } from "lucide-react";

function TaskForm({
  formData,
  editingId,
  errors,
  handleChange,
  handleSubmit,
  resetForm,
  submitting,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-8"
    >
      <input
        className={`w-full p-3 rounded ${
          errors.title ? "border border-red-500 bg-red-50" : "bg-gray-100"
        }`}
        name="title"
        placeholder="Task Title"
        value={formData.title}
        onChange={handleChange}
      />

      {errors.title && (
        <p className="mt-1 mb-3 text-sm text-red-500">{errors.title}</p>
      )}

      <textarea
        className={`w-full p-3 rounded ${
          errors.description ? "border border-red-500 bg-red-50" : "bg-gray-100"
        }`}
        name="description"
        placeholder="Task Description"
        value={formData.description}
        onChange={handleChange}
      />

      {errors.description && (
        <p className="mt-1 mb-3 text-sm text-red-500">{errors.description}</p>
      )}

      <select
        name="status"
        value={formData.status}
        placeholder="Status"
        onChange={handleChange}
        className="w-full bg-gray-100 p-3 rounded mb-4"
      >
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>

      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        className={`w-full p-3 rounded ${
          errors.dueDate ? "border border-red-500 bg-red-50" : "bg-gray-100"
        }`}
      />

      {errors.dueDate && (
        <p className="mt-1 mb-3 text-sm text-red-500">{errors.dueDate}</p>
      )}

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full bg-gray-100 p-3 rounded mb-4"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={submitting}
          className="
        flex items-center justify-center
        bg-blue-500
        hover:bg-blue-600
        text-white
        px-4
        py-2
        rounded
        disabled:bg-gray-400
        disabled:cursor-not-allowed
    "
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Saving...
            </>
          ) : editingId ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>

        {editingId && (
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded ml-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
