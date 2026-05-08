const dotenv = require("dotenv");
dotenv.config(); // MUST be first

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const PrayerLogRoutes = require("./routes/PrayerLogRoutes");
const goalRoutes = require("./routes/GoalRoutes");
const ibaadatScoreRoutes = require("./routes/IbaadatScoreRoutes");
const aiAssistantRoutes = require("./routes/AiAssistantRoutes");
const fastingLogRoutes = require("./routes/FastingLogRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const isTest = process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID;

if (!isTest) {
  connectDB();
}


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ramadan-serenity.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ramadan Serenity server is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/prayer-log", PrayerLogRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/ibaadat-score", ibaadatScoreRoutes);
app.use("/api/ai-assistant", aiAssistantRoutes);
app.use("/api/fasting-log", fastingLogRoutes);

if (!isTest) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;