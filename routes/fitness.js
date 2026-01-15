const router = require("express").Router();

router.get("/bmr", (req, res) => {
  const { weight, height, age } = req.query;
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  res.json({ bmr: Math.round(bmr) });
});

router.get("/calories", (req, res) => {
  const { steps } = req.query;
  const calories = steps * 0.04;
  res.json({ calories: Math.round(calories) });
});

module.exports = router;
