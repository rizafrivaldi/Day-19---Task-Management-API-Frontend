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
import useTaskForm from "../hooks/useTaskForm";

function Dashboard() {
  const { user, logout } = useAuth();

  const { search, setSearch, filterStatus, setFilterStatus, filteredTasks } =
    useTaskFilter(tasks);

  const { tasks, addTask, editTask, removeTask, toggleStatus } = useTasks();
  const {
    formData,
    editingId,
    handleChange,
    handleSubmit,
    resetForm,
    handleEdit,
  } = useTaskForm({ addTask, editTask });

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
