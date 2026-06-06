import { ClipboardList, Plus, Search } from "lucide-react";

const EmptyState = ({ filter, searchQuery = "" }) => {
  if (searchQuery.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground/60" />
        </div>

        <h3 className="text-base font-semibold text-foreground mb-1">
          No matches found
        </h3>

        <p className="text-sm text-muted-foreground max-w-xs">
          No tasks match <span className="font-semibold">"{searchQuery}"</span>.
          Try a different keyword.
        </p>
      </div>
    );
  }

  const messages = {
    all: {
      title: "No tasks yet",
      subtitle: "Create your first task using the form to get started.",
    },
    active: {
      title: "No active tasks",
      subtitle: "All caught up! Add a new task or check completed ones.",
    },
    completed: {
      title: "No completed tasks",
      subtitle: "Tasks you complete will appear here.",
    },
    "due-today": {
      title: "Nothing due today",
      subtitle: "No tasks are scheduled for today. Enjoy the day!",
    },
  };

  const { title, subtitle } = messages[filter] || messages.all;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8 text-indigo-500" />
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground max-w-xs">
        {subtitle}
      </p>

      {filter === "all" && (
        <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
          <Plus className="text-indigo-500 w-3.5 h-3.5" />
          Use the form to add your first task
        </div>
      )}
    </div>
  );
};

export default EmptyState;