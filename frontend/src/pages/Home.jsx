import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import TaskForm from "../components/features/TaskForm";
import TaskList from "../components/features/TaskList";


import useTaskStore from "../store/taskStore";
import userStore from "../store/user";

const getTodayStr = () => new Date().toISOString().split("T")[0];
const getDateOnly = (date) => (date ? String(date).split("T")[0] : "");

const Index = () => {
  const navigate = useNavigate();

  const { user, logout } = userStore();

  const {
    tasks,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useTaskStore();

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const handleCreate = async (data) => {
    await createTask(data);
  };

  const handleUpdate = async (id, data) => {
    await updateTask(id, data);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
  };

  const handleToggle = async (id) => {
    await toggleTask(id);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const today = getTodayStr();

  const tabFiltered = useMemo(() => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed);

      case "completed":
        return tasks.filter((task) => task.completed);

      case "due-today":
        return tasks.filter(
          (task) =>
            !task.completed &&
            getDateOnly(task.dueDate) === today
        );

      default:
        return tasks;
    }
  }, [tasks, filter, today]);

  const displayedTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return tabFiltered;

    return tabFiltered.filter(
      (task) =>
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
    );
  }, [tabFiltered, searchQuery]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const activeCount = tasks.length - completedCount;

  const dueTodayCount = useMemo(
    () =>
      tasks.filter(
        (task) =>
          !task.completed &&
          getDateOnly(task.dueDate) === today
      ).length,
    [tasks, today]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        totalTasks={tasks.length}
        completedTasks={completedCount}
        username={user?.name || "User"}
        onLogout={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          
          {/* Left Section */}
          <div className="lg:sticky lg:top-6">
            <TaskForm onSubmit={handleCreate} />

            <div className="mt-4 bg-[hsl(243,75%,97%)] rounded-2xl border border-[hsl(243,75%,90%)] p-4">
              <h3 className="text-xs font-semibold text-[hsl(243,75%,45%)] uppercase tracking-wide mb-2">
                Quick Tips
              </h3>

              <ul className="space-y-1.5">
                {[
                  "Assign a due date when creating tasks",
                  "Use the search bar to quickly find any task",
                  "Click 'Due Today' tab to focus on today's work",
                ].map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-[hsl(243,75%,40%)]"
                  >
                    <span className="w-4 h-4 flex-shrink-0 bg-[hsl(243,75%,59%)] text-white rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5">
                      {index + 1}
                    </span>

                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div>
            <TaskList
              tasks={displayedTasks}
              allTasks={tabFiltered}
              filter={filter}
              searchQuery={searchQuery}
              onFilterChange={setFilter}
              onSearchChange={setSearchQuery}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onToggle={handleToggle}
              totalAll={tasks.length}
              totalActive={activeCount}
              totalCompleted={completedCount}
              totalDueToday={dueTodayCount}
            />
          </div>
        </div>
      </main>

      <footer className="mt-12 pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          Taskify - Tasks saved to your account
        </p>
      </footer>
    </div>
  );
};

export default Index;
