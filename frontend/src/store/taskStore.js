import { create } from "zustand";
import api from "../lib/axios";
import toast from "react-hot-toast";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,

  // ================= CREATE TASK =================
  createTask: async ({ title, description, dueDate }) => {
    if (!title || !description) {
      toast.error("All fields are required");
      return;
    }

    set({ loading: true });

    try {
      const res = await api.post("/task/create", {
        title,
        description,
        dueDate: dueDate || null,
      });

      set((state) => ({
        tasks: [res.data.task, ...state.tasks],
      }));

      toast.success(res.data.message || "Task created successfully");

      return res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Task creation failed"
      );

      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // ================= GET TASKS =================
  getTasks: async () => {
    set({ loading: true });

    try {
      const res = await api.get("/task");

      set({
        tasks: res.data.tasks || [],
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    } finally {
      set({ loading: false });
    }
  },

  // ================= UPDATE TASK =================
  updateTask: async (id, updates) => {
    try {
      const res = await api.put(`/task/${id}`, updates);

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? res.data.task : task
        ),
      }));

      toast.success("Task updated", { id: `task-update-${id}` });

      return res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update task"
      );
      throw error;
    }
  },

  // ================= DELETE TASK =================
  deleteTask: async (id) => {
    try {
      await api.delete(`/task/${id}`);

      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      }));

      toast.success("Task deleted", { id: `task-delete-${id}` });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete task"
      );
      throw error;
    }
  },

  // ================= TOGGLE COMPLETE =================
  toggleTask: async (id) => {
    const task = get().tasks.find((t) => t._id === id);

    if (!task) return;

    try {
      const res = await api.patch(`/task/${id}/toggle`);

      set((state) => ({
        tasks: state.tasks.map((t) =>
          t._id === id ? res.data.task : t
        ),
      }));

      toast.success(
        task.completed
          ? "Task marked active"
          : "Task completed",
        { id: `task-toggle-${id}` }
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update task"
      );
      throw error;
    }
  },
}));

export default useTaskStore;
