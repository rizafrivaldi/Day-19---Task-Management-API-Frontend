import { useEffect, useState } from "react";

import api from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };

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

  // Create / update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (editingId) {
        // Update
        await api.put(`/tasks/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Task updated");
        setEditingId(null);
      } else {
        // Create
        await api.post("/tasks", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Task created");
      }

      await fetchTasks();

      //Reset form
      setFormData({
        title: "",
        description: "",
      });

      setEditingId(null);
    } catch (error) {
      console.log(error);

      alert("Action failed");
    }
  };

  //Delete Task
  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/tasks/${id}`, {
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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <hr />

      {/* Create Task Form */}
      <form onSubmit={handleSubmit}>
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

        <button type="submit">
          {editingId ? "Update Task" : "Create Task"}
        </button>
      </form>

      <hr />

      {/* Task List */}
      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>

          <p>{task.description}</p>
          <button
            onClick={() => {
              setEditingId(task.id);

              setFormData({
                title: task.title,
                description: task.description,
              });
            }}
          >
            Edit
          </button>
          <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
