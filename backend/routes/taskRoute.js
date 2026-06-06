import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/taskController.js";

import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, createTask);

router.get("/", protectRoute, getTasks);

router.get("/:id", protectRoute, getTask);

router.put("/:id", protectRoute, updateTask);

router.patch("/:id/toggle", protectRoute, toggleTask);

router.delete("/:id", protectRoute, deleteTask);

export default router;