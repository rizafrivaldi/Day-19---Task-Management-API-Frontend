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
    await createTask(token, data);

    await fetchTasks();
  };

  const editTask = async (id, data) => {
    await updateTask(token, id, data);

    await fetchTasks();
  };

  const removeTask = async (id) => {
    await deleteTask(token, id);

    await fetchTasks();
  };

  const toggleStatus = async (task) => {
    const toatedId = toast.loading("Updating status...");

    try {
      const newStatus = task.status === "Pending" ? "Completed" : "Pending";

      await toggleTaskStatus(token, task.id, {
        title: task.title,
        description: task.description,
        status: task.status === "Pending" ? "Completed" : "Pending",
      });

      await fetchTasks();

      toast.success(
        newStatus === "Completed" ? "Task completed" : "Task moved to pending",
        { id: toatedId },
      );
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Something went wrong", {
        id: toatedId,
      });
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
