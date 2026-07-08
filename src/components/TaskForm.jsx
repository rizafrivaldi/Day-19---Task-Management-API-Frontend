function TaskForm({
  formData,
  editingId,
  handleChange,
  handleSubmit,
  resetForm,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-8"
    >
      <input
        className="w-full bg-gray-100 p-3 rounded mb-4"
        name="title"
        placeholder="Task Title"
        value={formData.title}
        onChange={handleChange}
      />

      <textarea
        className="w-full bg-gray-100 p-3 rounded mb-4"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

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
        className="w-full bg-gray-100 p-3 rounded mb-4"
      />

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

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        {editingId ? "Update" : "Create"}
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
    </form>
  );
}

export default TaskForm;
