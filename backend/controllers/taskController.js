const Task = require("../models/task");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const calculateLevel = require("../helpers/levelCalculator");
const checkBadges = require("../helpers/badgeChecker");

// ---------------- CREATE TASK ----------------
const createTask = async (req, res) => {
  try {
    const { title, description, difficulty, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      difficulty,
      dueDate,
      userId: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET TASKS ----------------
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET TASK BY ID ----------------
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- UPDATE TASK ----------------
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- DELETE TASK ----------------
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- COMPLETE TASK ----------------
const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    if (task.completed) {
      return res.status(400).json({
        message: "Task already completed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Proof image required",
      });
    }

    // CLOUDINARY UPLOAD
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "tasks",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadStream();

    task.proofImage = result.secure_url;
    task.proofNote = req.body.proofNote || "";
    task.completed = true;
    task.completedAt = new Date();

    // XP SYSTEM
    let xpGain = 10;

    if (task.difficulty === "Medium") xpGain = 25;
    if (task.difficulty === "Hard") xpGain = 50;

    task.xpEarned = xpGain;

    const user = req.user;

    user.xp += xpGain;
    user.level = calculateLevel(user.xp);

    // STREAK SYSTEM
    const today = new Date().toDateString();

    const lastDate = user.lastActiveDate
      ? new Date(user.lastActiveDate).toDateString()
      : null;

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate === yesterday.toDateString()) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }

      user.lastActiveDate = new Date();
    }

    // COMPLETED TASK COUNT
    const completedCount =
      (await Task.countDocuments({
        userId: user._id,
        completed: true,
      })) + 1;

    const proofCount = completedCount;

    // BADGES
    const newBadges = checkBadges(
      user,
      completedCount,
      proofCount
    );

    newBadges.forEach((badge) => {
      if (!user.badges.some((b) => b === badge)) {
        user.badges.push(badge);
      }
    });

    // REMOVE DUPLICATES
    user.badges = [...new Set(user.badges)];

    await task.save();
    await user.save();

    res.json({
      message: "Task completed successfully",
      xpEarned: xpGain,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: user.badges,
      task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
};