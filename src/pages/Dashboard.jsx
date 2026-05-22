import { useEffect, useState } from "react";

import api from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data.data);
    } catch (error) {
      console.log(error);

      alert("Failed to fetch tasks");
    }
  };

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create task
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post("/tasks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Task created 🚀");

      // Refresh tasks
      fetchTasks();
      await fetchTasks();

      // Reset form
      setFormData({
        title: "",
        description: "",
      });
    } catch (error) {
      console.log(error);

      alert("Failed to create task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <hr />

      {/* Create Task Form */}
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Task description"
          value={formData.description}
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">Create Task</button>
      </form>

      <hr />

      {/* Task List */}
      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>

          <p>{task.description}</p>
          <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

//Delete Task
const handleDeleteTask = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await api.delete(`/tasks/$(id)`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Task deleted");

    await fetchTasks();
  } catch (error) {
    console.log(error);

    alert("Failed to delete task");
  }
};

export default Dashboard;
