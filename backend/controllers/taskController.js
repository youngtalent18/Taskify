import Task from "../models/TaskModel.js";

// ================= CREATE TASK =================
export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      priority,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.log("Error in createTask controller:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= GET ALL TASKS =================
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("Error in getTasks controller:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= GET SINGLE TASK =================
export const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.log("Error in getTask controller:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= UPDATE TASK =================
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, priority } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (priority !== undefined) updates.priority = priority;

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log("Error in updateTask controller:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= TOGGLE TASK =================
export const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.completed = !task.completed;

    await task.save();

    res.status(200).json({
      success: true,
      message: task.completed
        ? "Task completed"
        : "Task marked active",
      task,
    });
  } catch (error) {
    console.log("Error in toggleTask controller:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= DELETE TASK =================
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteTask controller:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
