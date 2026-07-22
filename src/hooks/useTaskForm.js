import { useState } from "react";
import { toast } from "sonner";

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

    const toastedId = toast.loading(
      editingId ? "Updating task..." : "Creating task...",
    );

    try {
      if (editingId) {
        await editTask(editingId, formData);
        toast.success("Task updated successfully", { id: toastedId });
      } else {
        await addTask(formData);
        toast.success("Task created successfully", { id: toastedId });
      }

      resetForm();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message ?? "Something went wrong", {
        id: toastedId,
      });
    }
  };

  const handleDelete = async (id) => {
    const toastedId = toast.loading("Deleting task...");
    try {
      await removeTask(id);
      toast.success("Task deleted successfully", { id: toastedId });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message ?? "Something went wrong", {
        id: toastedId,
      });
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
