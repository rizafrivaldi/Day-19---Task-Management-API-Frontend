import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  isOverDue,
  getDaysLeft,
  priorityOrder,
  priorityColor,
  statusColor,
  filterAndSortTasks,
  paginateTasks,
  getTaskStats,
} from "../utils/taskUtils";
import TaskStats from "../components/TaskStats";
import ProgressBar from "../components/ProgressBar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import Pagination from "../components/Pagination";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

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

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      title: "",
      description: "",
      status: "Pending",
      dueDate: "",
      priority: "medium",
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
      resetForm();
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
          status: task.status === "Pending" ? "Completed" : "Pending",
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

  /* State */
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  /* Statistic */
  const { totalTasks, pendingTasks, completedTasks, progress } =
    getTaskStats(tasks);

  const filteredTasks = filterAndSortTasks(
    tasks,
    search,
    filterStatus,
    priorityOrder,
  );

  const { currentTasks, totalPages } = paginateTasks(
    filteredTasks,
    currentPage,
    tasksPerPage,
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name || user?.email}</p>
          <ProgressBar progress={progress} />
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <TaskForm
        formData={formData}
        editingId={editingId}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />

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
      <TaskStats
        totalTasks={totalTasks}
        pendingTasks={pendingTasks}
        completedTasks={completedTasks}
      />
      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold">No matching task found</h3>
          <p className="text-gray-500 mt-2">Create your task above</p>
        </div>
      )}
      {/* Task Card */}
      <div className="grid gap-4">
        {currentTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            handleEdit={handleEdit}
            handleDeleteTask={handleDeleteTask}
            toggleStatus={toggleStatus}
          />
        ))}
      </div>
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default Dashboard;
