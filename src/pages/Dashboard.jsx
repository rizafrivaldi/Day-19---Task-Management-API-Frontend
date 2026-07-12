import { useEffect, useState } from "react";
import { paginateTasks, getTaskStats } from "../utils/taskUtils";
import TaskStats from "../components/TaskStats";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import Pagination from "../components/Pagination";
import useTasks from "../hooks/useTasks";
import SearchFilter from "../components/SearchFilter";
import DashboardHeader from "../components/DashboardHeader";
import EmptyState from "../components/EmptyState";
import useAuth from "../hooks/useAuth";
import useTaskFilter from "../hooks/useTaskFilter";

function Dashboard() {
  const { user, logout } = useAuth();

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

  // Fetch tasks
  const { tasks, addTask, editTask, removeTask, toggleStatus } = useTasks();
  const { search, setSearch, filterStatus, setFilterStatus, filteredTasks } =
    useTaskFilter(tasks);

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
      if (editingId) {
        await editTask(editingId, formData);
        alert("Task updated");
      } else {
        await addTask(formData);
        alert("Task created");
      }

      resetForm();
    } catch (error) {
      console.log(error);
      alert("Action failed");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await removeTask(id);

      alert("Task deleted");
    } catch (error) {
      console.log(error);
      alert("Failed to delete task");
    }
  };

  /* Statistic */
  const { totalTasks, pendingTasks, completedTasks, progress } =
    getTaskStats(tasks);

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
      <DashboardHeader user={user} progress={progress} handleLogout={logout} />

      <TaskForm
        formData={formData}
        editingId={editingId}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />

      <SearchFilter
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Stats */}
      <TaskStats
        totalTasks={totalTasks}
        pendingTasks={pendingTasks}
        completedTasks={completedTasks}
      />
      {/* Empty State */}
      {filteredTasks.length === 0 && <EmptyState />}

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
