const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const SECRET = "fittrack_secret";

router.post("/register", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashed
    });
    res.json(user);
  } catch (err) {
    res.status(500).json("Register failed");
  }
});

router.post("/login", async (req, res) => {
  console.log("LOGIN BODY:", req.body); // 🔥 DEBUG LINE

  const user = await User.findOne({ email: req.body.email });
  console.log("FOUND USER:", user);     // 🔥 DEBUG LINE

  if (!user) return res.status(400).json("Invalid credentials");

  const match = await bcrypt.compare(req.body.password, user.password);
  console.log("PASSWORD MATCH:", match); // 🔥 DEBUG LINE

  if (!match) return res.status(400).json("Invalid credentials");

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});

module.exports = router;
