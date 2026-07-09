import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  priorityOrder,
  filterAndSortTasks,
  paginateTasks,
  getTaskStats,
} from "../utils/taskUtils";
import TaskStats from "../components/TaskStats";
import ProgressBar from "../components/ProgressBar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import Pagination from "../components/Pagination";
import useTasks from "../hooks/useTasks";

function Dashboard() {
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
  const { tasks, fetchTasks, addTask, editTask, removeTask, toggleStatus } =
    useTasks();

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
        await editTask(editingId, formData);
        alert("Task updated");
      } else {
        await addTask(formData);
        alert("Task created");
      }

      await fetchTasks();
      resetForm();
    } catch (error) {
      console.log(error);
      alert("Action failed");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await removeTask(id);

      alert("Task deleted");
    } catch (error) {
      console.log(error);
      alert("Failed to delete task");
    }
  };

  /* State */
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const userData = localStorage.getItem("user");

  const user =
    userData && userData !== "undefined" ? JSON.parse(userData) : null;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);

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
          <TaskCard key={task.id} task={task} toggleStatus={toggleStatus} />
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
