const router = require("express").Router();
const DailyCalories = require("../models/DailyCalories");
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

// add kcal for today
router.post("/add", auth, async (req, res) => {
  const { kcal } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  let record = await DailyCalories.findOne({
    userId: req.userId,
    date: today,
  });

  if (record) {
    record.totalKcal += kcal;
    await record.save();
  } else {
    record = await DailyCalories.create({
      userId: req.userId,
      date: today,
      totalKcal: kcal,
    });
  }

  res.json(record);
});

// get all kcal history
router.get("/", auth, async (req, res) => {
  const data = await DailyCalories.find({ userId: req.userId }).sort({
    date: -1,
  });
  res.json(data);
});

module.exports = router;
