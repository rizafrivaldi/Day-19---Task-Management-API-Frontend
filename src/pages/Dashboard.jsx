import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
    priority: "medium",
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
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
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      priority: task.priority,
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
        status: "PENDING",
        dueDate: "",
      });

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full border p-3 rounded mb-4"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>;

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
    console.log("Clicked:", task.id);
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/tasks/${task.id}`,
        {
          title: task.title,
          description: task.description,
          status: task.status === "PENDING" ? "COMPLETED" : "PENDING",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchTasks();
    } catch (error) {
      console.log(error);

      alert("Failed to update status");
    }
  };

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const filteredTasks = [...tasks].filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === "all" ? true : task.status === filterStatus),
  );

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter((task) => task.status === "PENDING").length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const isOverDue = (task) => {
    if (!task.dueDate) return false;
    return task.status !== "COMPLETED" && new Date(task.dueDate) < new Date();
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    const timeDiff = due - today;

    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>

          <p className="text-gray-600">Welcome, {user?.name || user?.email}</p>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <input
          className="w-full bg-gray-100 p-3 rounded mb-4"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          className="w-full bg-gray-100 p-3 rounded mb-4"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-gray-100 p-3 rounded mb-4"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full bg-gray-100 p-3 rounded mb-4"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Create"}
        </button>

        {editingId && (
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded ml-2"
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: "",
                description: "",
                status: "Pending",
                dueDate: "",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-white p-3 rounded mb-4"
      />

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="w-full bg-white p-3 rounded mb-4"
      >
        <option value="all">All Tasks</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">Total Tasks</h3>
          <p className="text-3xl font-bold">{totalTasks}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-yellow-600">Pending</h3>

          <p className="text-3xl font-bold">{pendingTasks}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-green-600">Completed</h3>

          <p className="text-3xl font-bold">{completedTasks}</p>
        </div>
      </div>

      {/*Empty State*/}
      {tasks.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold">No matching task found</h3>
          <p className="text-gray-500 mt-2">Create your task above</p>
        </div>
      )}

      {/* Task List */}
      <div className="grid gap-4">
        {[...tasks]
          .filter((task) =>
            `${task.title || ""} ${task.description || ""}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          )

          .filter((task) =>
            filterStatus === "all" ? true : task.status === filterStatus,
          )
          .sort((a, b) => {
            const priorityOrder = {
              high: 3,
              medium: 2,
              low: 1,
            };

            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            }

            if (a.status === "compeleted" && b.status === "completed") return 1;

            if (a.status !== "completed" && b.status === "completed") return -1;
            return 0;
          })
          .map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-xl shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2
                    className={`text-xl font-semibold ${task.status === "completed" ? "line-through text-gray-400" : ""}`}
                  >
                    {task.title}
                  </h2>

                  <p className="text-gray-600 mt-2">{task.description}</p>
                </div>

                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleStatus(task);
                  }}
                  className="w-6 h-6 mt-1 cursor-pointer"
                />
              </div>

              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${task.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {task.status.toUpperCase()}
                </span>

                {isOverDue(task) && (
                  <span className="ml-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                    OVERDUE
                  </span>
                )}
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "medium"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {task.priority.toUpperCase()}
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  Created:{" "}
                  {new Date(task.createdAt).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {task.dueDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {getDaysLeft(task.dueDate)} days left
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="bg-gray-100 hover:bg-yellow-300 px-4 py-2 rounded"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="bg-gray-100 hover:bg-red-400 px-4 py-2 rounded"
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
