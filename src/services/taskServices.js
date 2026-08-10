import api from "../services/api";

// GET TASKS
export const getTasks = async () => {
  const response = await api.get("/tasks");

  return response.data.data;
};

// CREATE TASK
export const createTask = async (data) => {
  const response = await api.post("/tasks", data);

  return response.data;
};

// UPDATE TASK
export const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);

  return response.data;
};

// DELETE TASK
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);

  return response.data;
};

// TOGGLE STATUS
export const toggleTaskStatus = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);

  return response.data;
};
