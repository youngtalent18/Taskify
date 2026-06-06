import { useState } from "react";
import {
  Pencil,
  Trash2,
  Check,
  X,
  CheckCircle2,
  Circle,
  Loader2,
  FileText,
  Tag,
  Clock,
  Calendar,
  AlertTriangle,
} from "lucide-react";



const formatDate = (date) => {
  if (!date) return "No date";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "No date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getTodayStr = () => new Date().toISOString().split("T")[0];
const getDateOnly = (date) => (date ? String(date).split("T")[0] : "");

const getDueDateStatus = (dueDate) => {
  if (!dueDate) return null;
  const today = getTodayStr();
  const due = getDateOnly(dueDate);
  if (due < today) return "overdue";
  if (due === today) return "today";
  return "upcoming";
};

const DUE_STATUS_STYLES = {
  overdue: "bg-red-50 text-red-700 border-red-200",
  today: "bg-orange-50 text-orange-700 border-orange-200",
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
};


const HighlightText = ({
  text,
  query,
}) => {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200 text-yellow-900 rounded px-0.5 not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};


const TaskCard = ({
  task,
  searchQuery = "",
  onUpdate,
  onDelete,
  onToggle,
}) => {
  const taskId = task._id || task.id;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDueDate, setEditDueDate] = useState(getDateOnly(task.dueDate));
  const [editErrors, setEditErrors] = useState({
    title: "",
    description: "",
  });
  const [deleting, setDeleting] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const dueDateStatus = !task.completed ? getDueDateStatus(task.dueDate) : null;
  const today = new Date().toISOString().split("T")[0];

  // Left border accent based on due status
  const leftBorder =
    !task.completed && dueDateStatus === "overdue"
      ? "border-l-4 border-l-red-400"
      : !task.completed && dueDateStatus === "today"
      ? "border-l-4 border-l-orange-400"
      : task.completed
      ? "border-l-4 border-l-emerald-400"
      : "border-l-4 border-l-[hsl(243,75%,59%)]";

  const validateEdit = () => {
    const errs = {
        title: "",
        description: "",
    };
    if (!editTitle.trim()) errs.title = "Title is required";
    if (!editDescription.trim()) errs.description = "Description is required";
    setEditErrors(errs);
    return !errs.title && !errs.description;
  };

  const handleSave = async () => {
    if (pendingAction) return;
    if (!validateEdit()) return;

    try {
      setPendingAction("save");
      await onUpdate(taskId, {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        dueDate: editDueDate || null,
      });
      setIsEditing(false);
    } finally {
      setPendingAction(null);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditCategory(task.category);
    setEditDueDate(getDateOnly(task.dueDate));
    setEditErrors({});
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (pendingAction) return;

    setDeleting(true);
    setPendingAction("delete");

    try {
      await onDelete(taskId);
    } catch {
      setDeleting(false);
      setPendingAction(null);
    }
  };

  const handleToggle = async () => {
    if (pendingAction) return;

    try {
      setPendingAction("toggle");
      await onToggle(taskId);
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div
      className={`
        bg-white rounded-xl border shadow-sm task-card-hover overflow-hidden
        ${leftBorder}
        ${deleting ? "opacity-0 scale-95 transition-all duration-300" : ""}
      `}
    >
      <div className="p-4 sm:p-5">
        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Tag className="w-3 h-3" /> Title
              </label>
              <input
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (editErrors.title)
                    setEditErrors((p) => ({ ...p, title: undefined }));
                }}
                className={`h-10 px-3 text-sm ${
                  editErrors.title ? "border-destructive" : ""
                }`}
                autoFocus
              />
              {editErrors.title && (
                <p className="text-destructive text-xs">{editErrors.title}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" /> Description
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => {
                  setEditDescription(e.target.value);
                  if (editErrors.description)
                    setEditErrors((p) => ({ ...p, description: undefined }));
                }}
                rows={2}
                className={`min-h-24 px-3 py-2 text-sm resize-none ${
                  editErrors.description ? "border-destructive" : ""
                }`}
              />
              {editErrors.description && (
                <p className="text-destructive text-xs">
                  {editErrors.description}
                </p>
              )}
            </div>

          

            {/* Due date picker */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Due Date (optional)
              </label>
              <input
                type="date"
                value={editDueDate}
                min={today}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="h-10 px-3 text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={pendingAction === "save"}
                className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-xs gradient-primary text-white border-0 hover:opacity-90"
              >
                {pendingAction === "save" ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5 mr-1" />
                )}
                Save
              </button>
              <button
                onClick={handleCancel}
                disabled={Boolean(pendingAction)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-white px-3 text-xs text-foreground hover:bg-muted"
              >
                <X className="w-3.5 h-3.5 mr-1" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="flex items-start gap-3">
            {/* Toggle checkbox */}
            <button
              onClick={handleToggle}
              disabled={Boolean(pendingAction)}
              className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/10 hover:scale-105 transition"
              aria-label={
                task.completed ? "Mark as incomplete" : "Mark as complete"
              }
            >
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <h3
                  className={`font-semibold text-sm leading-snug ${
                    task.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  <HighlightText text={task.title} query={searchQuery} />
                </h3>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      task.completed
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-[hsl(243,75%,95%)] text-[hsl(243,75%,45%)]"
                    }`}
                  >
                    {task.completed ? "Done" : "Active"}
                  </span>
                </div>
              </div>

              <p
                className={`text-sm mt-1 leading-relaxed ${
                  task.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground/70"
                }`}
              >
                <HighlightText text={task.description} query={searchQuery} />
              </p>

              {/* Meta row */}
              <div className="flex items-center flex-wrap gap-3 mt-2.5">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDate(task.createdAt)}
                </span>

                {/* Due date */}
                {task.dueDate && !task.completed && (
                  <span
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${
                      dueDateStatus && DUE_STATUS_STYLES[dueDateStatus]
                    }`}
                  >
                    {dueDateStatus === "overdue" && (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {dueDateStatus !== "overdue" && (
                      <Calendar className="w-3 h-3" />
                    )}
                    {dueDateStatus === "overdue"
                      ? "Overdue - "
                      : dueDateStatus === "today"
                      ? "Due today - "
                      : ""}
                    {new Date(task.dueDate + "T12:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </span>
                )}

                {task.updatedAt !== task.createdAt && (
                  <span className="text-xs text-muted-foreground">- edited</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                disabled={Boolean(pendingAction)}
                className="inline-flex w-8 h-8 items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                aria-label="Edit task"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex w-8 h-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                aria-label="Delete task"
                disabled={deleting || Boolean(pendingAction)}
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
