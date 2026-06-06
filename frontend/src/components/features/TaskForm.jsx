import { FileText, Plus, Tag } from "lucide-react";
import { Calendar,Loader2 } from "lucide-react";
import {useState} from "react";
import useTaskStore from "../../store/taskStore";

const TaskForm = () => {
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const {createTask} = useTaskStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({
    title: "",
    description: "",
  });

  const validate = () => {
    const newError = {
      title: "",
      description: "",
    };
    if (!title.trim()) newError.title = "Title is required";
    else if (title.trim().length < 3)
      newError.title = "Title must be at least 3 characters";

    if (!description.trim()) newError.description = "Description is required";
    else if (description.trim().length < 5)
      newError.description = "Description must be at least 5 characters";

    setError(newError);

    return !newError.title && !newError.description;
    
  }

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!validate()) return;


    try {
      setLoading(true);
      await createTask({ title, description, dueDate });
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
          <Plus className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Add New Task</h2>
      </div>
      <form className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            <Tag className="w-3.5 h-3.5 inline-block mr-1 text-muted-foreground" /> Task Title
          </label>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => {setTitle(e.target.value); if (error.title) setError((prev) => ({ ...prev, title: "" })); }}  
            className={"w-full " + (error.title ? "border-destructive" : "border-border") + " rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"}
          />
            {error.title && (
              <p className="text-xs text-red-600 mt-1">
                {error.title}
              </p>
            )}
        </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              <FileText className="w-3.5 h-3.5 inline-block mr-1 text-muted-foreground" /> Task Description
            </label>
          <textarea
            rows={3}
            type="text"
            placeholder="Task description"
            value={description}
            onChange={(e) => {setDescription(e.target.value); if (error.description) setError((prev) => ({ ...prev, description: "" })); }}
            className={"w-full " + (error.description ? "border-destructive" : "border-border") + " rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"}
          />
            {error.description && (
              <p className="text-xs text-red-600">
                {error.description}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
          <label
            htmlFor="task-due"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            Due Date{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            min={today}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full mb-3 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"/>
        </div>

        <button
          type="submit"
          disabled={loading}
          onClick={handleCreate}
          className="flex items-center justify-center border border-border rounded-lg w-full h-11 gradient-primary hover:opacity-90 text-white font-semibold text-sm transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Task...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default TaskForm