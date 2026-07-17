import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";
import useTasks from "../hooks/useTasks";
import useTaskForm from "../hooks/useTaskForm";
import useTaskFilter from "../hooks/useTaskFilter";

import { paginateTasks, getTaskStats } from "../utils/taskUtils";

import DashboardHeader from "../components/DashboardHeader";
import TaskForm from "../components/TaskForm";
import SearchFilter from "../components/SearchFilter";
import TaskStats from "../components/TaskStats";
import TaskCard from "../components/TaskCard";
import Pagination from "../components/Pagination";

import EmptyState from "../components/EmptyState";

function Dashboard() {
  const { user, logout } = useAuth();

  const { tasks, addTask, editTask, removeTask, toggleStatus } = useTasks();

  const {
    formData,
    editingId,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  } = useTaskForm({ addTask, editTask, removeTask });

  const { search, setSearch, filterStatus, setFilterStatus, filteredTasks } =
    useTaskFilter(tasks);

  /* Statistic */
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

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
            handleDelete={handleDelete}
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
