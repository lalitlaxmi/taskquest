const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

require("./config/mailer"); // verifies SMTP connection at boot

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// SECURITY
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 300, // global ceiling; auth routes have their own tighter limiter
  })
);

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Task Manager API Running 🚀");
});

console.log("MONGODB_URI =", process.env.MONGODB_URI ? "Loaded ✅" : "Missing ❌");
console.log("EMAIL_USER  =", process.env.EMAIL_USER ? "Loaded ✅" : "Missing ❌");

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err.message);
  });

// CENTRALIZED ERROR HANDLER (catches anything controllers throw/forget to catch)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
