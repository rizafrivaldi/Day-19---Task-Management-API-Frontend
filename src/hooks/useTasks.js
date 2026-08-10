import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../services/taskServices";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks();

      setTasks(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (data) => {
    const toastId = toast.loading("Creating task...");

    setSubmitting(true);

    try {
      await createTask(data);

      await fetchTasks();

      toast.success("Task created successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to create task", { id: toastId });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const editTask = async (id, data) => {
    const toastId = toast.loading("Updating task...");

    setSubmitting(true);

    try {
      await updateTask(id, data);

      await fetchTasks();

      toast.success("Task updated successfully", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Something went wrong", {
        id: toastId,
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const removeTask = async (id) => {
    const toastId = toast.loading("Deleting task...");
    setSubmitting(true);

    try {
      await deleteTask(id);

      await fetchTasks();

      toast.success("Task deleted successfully", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Something went wrong", {
        id: toastId,
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (task) => {
    const toastId = toast.loading("Updating status...");
    setSubmitting(true);

    try {
      const newStatus = task.status === "Pending" ? "Completed" : "Pending";

      await toggleTaskStatus(task.id, {
        title: task.title,
        description: task.description,
        status: newStatus,
      });

      await fetchTasks();

      toast.success(
        newStatus === "Completed" ? "Task completed" : "Task moved to pending",
        { id: toastId },
      );
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Something went wrong", {
        id: toastId,
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
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
