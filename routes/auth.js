const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const SECRET = "fittrack_secret";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
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
