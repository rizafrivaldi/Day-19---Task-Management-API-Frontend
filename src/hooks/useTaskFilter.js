import { useEffect, useState } from "react";

import { filterAndSortTasks, priorityOrder } from "../utils/taskUtils";

export default function useTaskFilter(tasks) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTasks = filterAndSortTasks(
    tasks,
    search,
    filterStatus,
    priorityOrder,
  );

  return {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filteredTasks,
  };
}
