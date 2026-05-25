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
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      </div>

      {/* Create Task Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Task title"
        />

        <textarea
          className="w-full border p-3 rounded mb-4"
          placeholder="Description"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Task" : "Create Task"}
        </button>

      </div>

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
