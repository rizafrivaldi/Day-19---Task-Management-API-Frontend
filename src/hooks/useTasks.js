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
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks(token);

      setTasks(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (data) => {
    const toastId = toast.loading("Creating task...");

    try {
      await createTask(token, data);

      await fetchTasks();

      toast.success("Task created successfully", { id: toastId });
    } catch (error) {
      toast.error("failed to create task", { id: toastId });
      throw error;
    }
  };

  const editTask = async (id, data) => {
    const toastId = toast.loading("Updating task...");

    try {
      await updateTask(token, id, data);

      await fetchTasks();

      toast.success("Task updated successfully", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Something went wrong", {
        id: toastId,
      });
      throw error;
    }
  };

  const removeTask = async (id) => {
    const toastId = toast.loading("Deleting task...");

    try {
      await deleteTask(token, id);

      await fetchTasks();

      toast.success("Task deleted successfully", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Something went wrong", {
        id: toastId,
      });
      throw error;
    }
  };

  const toggleStatus = async (task) => {
    const toastId = toast.loading("Updating status...");

    try {
      const newStatus = task.status === "Pending" ? "Completed" : "Pending";

      await toggleTaskStatus(token, task.id, {
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
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    editTask,
    removeTask,
    toggleStatus,
    fetchTasks,
  };
}
