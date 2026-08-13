import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskServices";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getTasks();

      setTasks(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const executeTaskAction = async ({
    loadingMessage,
    successMessage,
    errorMessage,
    action,
  }) => {
    const toastId = toast.loading(loadingMessage);
    setSubmitting(true);

    try {
      await action();
      await fetchTasks();
      toast.success(successMessage, { id: toastId });
    } catch (error) {
      toast.error(errorMessage, { id: toastId });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const addTask = async (data) => {
    await executeTaskAction({
      loadingMessage: "Creating task...",
      successMessage: "Task created successfully",
      errorMessage: "Failed to create task",
      action: () => createTask(data),
    });
  };

  const editTask = async (id, data) => {
    await executeTaskAction({
      loadingMessage: "Updating task...",
      successMessage: "Task updated successfully",
      errorMessage: "Failed to update task",
      action: () => updateTask(id, data),
    });
  };

  const removeTask = async (id) => {
    await executeTaskAction({
      loadingMessage: "Deleting task...",
      successMessage: "Task deleted successfully",
      errorMessage: "Failed to delete task",
      action: () => deleteTask(id),
    });
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    await executeTaskAction({
      loadingMessage: "Updating status...",
      successMessage:
        task.status === "Pending" ? "Task completed" : "Task moved to pending",
      errorMessage: "Failed to update task status",
      action: () => {
        return updateTask(task.id, {
          title: task.title,
          description: task.description,
          status: newStatus,
        });
      },
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    submitting,
    error,
    addTask,
    editTask,
    removeTask,
    toggleStatus,
    fetchTasks,
  };
}
