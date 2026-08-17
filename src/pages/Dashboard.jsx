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

  const {
    tasks,
    loading,
    error,
    submitting,
    addTask,
    editTask,
    removeTask,
    toggleStatus,
  } = useTasks();

  const {
    formData,
    editingId,
    errors,
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
        errors={errors}
        submitting={submitting}
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
      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading tasks...</div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-6 text-center">
          <p className="font-medium text-red-600">Failed to load tasks.</p>

          <p className="mt-1 text-sm text-red-500">
            Something went wrong while loading your tasks.
          </p>

          <button
            type="button"
            onClick={fetchTasks}
            className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {filteredTasks.length === 0 && (
            <EmptyState type={tasks.length === 0 ? "empty" : "no-results"} />
          )}

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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
