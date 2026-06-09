import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

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

  const handleEdit = (task) => {
    setEditingId(task.id);

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
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
        status: "pending",
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

  const userData = localStorage.getItem("user");

  const user =
    userData && userData !== "undefined" ? JSON.parse(userData) : null;

  console.log("USER FROM STORAGE:", user);
  console.log("RAW USER:", localStorage.getItem("user"));

  const toggleStatus = async (task) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `tasks/${task.id}`,
        {
          title: task.title,
          desciption: task.description,
          status: task.status === "pending" ? "completed" : "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>

          <p className="text-gray-600">Welcome, {user?.name || user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <input
          className="w-full border p-3 rounded mb-4"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          className="w-full border p-3 rounded mb-4"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      {/*Create Task  From*/}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        ...
      </form>

      {/*Empty State*/}
      {tasks.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold">No task yet</h3>
          <p className="text-gray-500 mt-2">Create your task above</p>
        </div>
      )}

      {/* Task List */}
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-5 rounded-xl shadow">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.status === "completed"}
                onChange={() => toggleStatus(task)}
                className="w-5 h-5 mt-1"
              />

              <div className="flex-1">
                <h2
                  className={`text-xl font-semibold ${task.status === "completed" ? "line-through text-gray-400" : ""}`}
                >
                  {task.title}
                </h2>
                <p className="text-gray-600 mt-2">{task.description}</p>
              </div>
            </div>
            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-sm ${task.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {task.status}
                <p className="text-sm text-gray-500 mt-2">
                  Created:{" "}
                  {new Date(task.createdAt).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                className="bg-yellow-400 px-4 py-2 rounded"
                onClick={() => handleEdit(task)}
              >
                Edit
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
