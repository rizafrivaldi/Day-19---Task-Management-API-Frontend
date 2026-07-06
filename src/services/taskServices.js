import api from "../services/api";

// GET TASKS
export const getTasks = async (token) => {
  const response = await api.get("/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

// CREATE TASK
export const createTask = async (token, data) => {
  const response = await api.post("/tasks", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// UPDATE TASK
export const updateTask = async (token, id, data) => {
  const response = await api.put(`/tasks/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// DELETE TASK
export const deleteTask = async (token, id) => {
  const response = await api.delete(`/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// TOGGLE STATUS
export const toggleTaskStatus = async (token, task) => {
  const response = await api.put(
    `/tasks/${task.id}`,
    {
      title: task.title,
      description: task.description,
      status: task.status === "Pending" ? "Completed" : "Pending",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
