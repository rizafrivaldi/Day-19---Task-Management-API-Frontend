import { useState } from "react";
import validationTask from "../utils/taskValidation";

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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const resetForm = () => {
    setEditingId(null);

    setErrors({});

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

  const [errors, setErrors] = useState({});

  // Create / update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = validationTask(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});

      if (editingId) {
        await editTask(editingId, formData);
      } else {
        await addTask(formData);
      }

      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeTask(id);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    formData,
    editingId,
    errors,
    setEditingId,
    setFormData,
    handleChange,
    resetForm,
    handleEdit,
    handleSubmit,
    handleDelete,
  };
}
