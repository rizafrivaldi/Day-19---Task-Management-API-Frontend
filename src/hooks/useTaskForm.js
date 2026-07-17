import { useState } from "react";

export default function useTaskForm({ addTask, editTask, removeTask }) {
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
    priority: "medium",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      title: "",
      description: "",
      status: "Pending",
      dueDate: "",
      priority: "medium",
    });
  };

  const handleEdit = (task) => {
    setEditingId(task.id);

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      priority: task.priority,
    });
  };

  // Create / update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await editTask(editingId, formData);
        alert("Task updated");
      } else {
        await addTask(formData);
        alert("Task created");
      }

      resetForm();
    } catch (error) {
      console.log(error);
      alert("Action failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeTask(id);
      alert("Task deleted");
    } catch (error) {
      console.log(error);

      alert("Failed to delete task");
    }
  };

  return {
    formData,
    editingId,
    setEditingId,
    setFormData,
    handleChange,
    resetForm,
    handleEdit,
    handleSubmit,
    handleDelete,
  };
}
