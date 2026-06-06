import {
  ListFilter,
  CheckCheck,
  Circle,
  LayoutList,
  CalendarClock,
} from "lucide-react";
import SearchBar from "./SearchBar";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";

const FILTER_TABS = [
  {
    key: "all",
    label: "All",
    icon: <LayoutList className="w-3.5 h-3.5" />,
  },
  {
    key: "active",
    label: "Active",
    icon: <Circle className="w-3.5 h-3.5" />,
  },
  {
    key: "completed",
    label: "Completed",
    icon: <CheckCheck className="w-3.5 h-3.5" />,
  },
  {
    key: "due-today",
    label: "Due Today",
    icon: <CalendarClock className="w-3.5 h-3.5" />,
  },
];

const TaskList = ({
  tasks,
  allTasks,
  filter,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onUpdate,
  onDelete,
  onToggle,
  totalAll,
  totalActive,
  totalCompleted,
  totalDueToday,
}) => {
  const counts = {
    all: totalAll,
    active: totalActive,
    completed: totalCompleted,
    "due-today": totalDueToday,
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          resultCount={tasks.length}
          totalCount={allTasks.length}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-border bg-muted/30 overflow-x-auto">
        <ListFilter className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />

        {FILTER_TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap
              ${
                filter === key
                  ? key === "due-today"
                    ? "bg-orange-50 text-orange-700 shadow-sm border border-orange-200"
                    : "bg-primary/10 text-primary-dark shadow-sm border border-primary/20"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
              }
            `}
          >
            {icon}
            {label}

            <span
              className={`
                ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                ${
                  filter === key
                    ? key === "due-today"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-primary/15 text-primary-dark"
                    : "bg-muted text-muted-foreground"
                }
              `}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="p-4 space-y-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <EmptyState
            filter={filter}
            searchQuery={searchQuery}
          />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id || task.id}
              task={task}
              searchQuery={searchQuery}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {tasks.length > 0 && (
        <div className="px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {tasks.length}
            </span>{" "}
            task{tasks.length !== 1 ? "s" : ""}
            {searchQuery.trim()
              ? ` matching "${searchQuery}"`
              : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
