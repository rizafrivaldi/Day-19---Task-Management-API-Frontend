import ProgressBar from "./ProgressBar";

function DashboardHeader({ user, progress, handleLogout }) {
  return (
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
  );
}

export default DashboardHeader;
