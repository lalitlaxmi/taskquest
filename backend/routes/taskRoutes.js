const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

// FIXED IMPORT
const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
} = require("../controllers/taskController");

// CREATE TASK
router.post("/create", protect, createTask);

// GET ALL TASKS
router.get("/", protect, getTasks);

// GET SINGLE TASK
router.get("/:id", protect, getTaskById);

// UPDATE TASK
router.put("/:id", protect, updateTask);

// DELETE TASK
router.delete("/:id", protect, deleteTask);

// COMPLETE TASK WITH IMAGE
router.patch(
  "/:id/complete",
  protect,
  upload.single("proofImage"),
  completeTask
);

module.exports = router;