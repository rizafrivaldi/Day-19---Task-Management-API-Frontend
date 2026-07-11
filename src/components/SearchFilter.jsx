function SearchFilter({ search, setSearch, filterStatus, setFilterStatus }) {
  return (
    <>
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
    </>
  );
}

export default SearchFilter;
