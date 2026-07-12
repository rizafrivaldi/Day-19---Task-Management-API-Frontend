function EmptyState() {
  return (
    <div className="bg-white p-8 rounded-xl shadow text-center">
      <h3 className="text-xl font-semibold">No matching task found</h3>

      <p className="text-gray-500 mt-2">Create your task above</p>
    </div>
  );
}

export default EmptyState;
