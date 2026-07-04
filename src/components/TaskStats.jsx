function TaskStats({ totalTasks, pendingTasks, completedTasks, progress }) {
  return (
    <>
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
    </>
  );
}

export default TaskStats;
