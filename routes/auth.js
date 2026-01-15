const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "fittrack_secret";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔴 CHECK IF USER EXISTS
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json(user);
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("User not found");

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
