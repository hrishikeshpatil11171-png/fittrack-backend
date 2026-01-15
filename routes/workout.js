const router = require("express").Router();
const Workout = require("../models/workout");
const jwt = require("jsonwebtoken");

const SECRET = "fittrack_secret";

// auth middleware
const auth = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json("Unauthorized");
  }
};

// CREATE
router.post("/", auth, async (req, res) => {
  const workout = await Workout.create({
    userId: req.userId,
    ...req.body,
  });
  res.json(workout);
});

// READ
router.get("/", auth, async (req, res) => {
  const workouts = await Workout.find({ userId: req.userId }).sort({
    createdAt: -1,
  });
  res.json(workouts);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const updated = await Workout.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Workout.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

module.exports = router;
