const router = require("express").Router();
const Activity = require("../models/activity");
const jwt = require("jsonwebtoken");

const SECRET = "fittrack_secret";

// middleware to get logged-in user
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

// ➕ Add activity (User A / User B separate)
router.post("/", authMiddleware, async (req, res) => {
  const activity = await Activity.create({
    ...req.body,
    userId: req.userId,
  });
  res.json(activity);
});

// 📥 Get activities for logged-in user only
router.get("/", authMiddleware, async (req, res) => {
  const activities = await Activity.find({ userId: req.userId });
  res.json(activities);
});

module.exports = router;
