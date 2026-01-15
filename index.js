require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/activity", require("./routes/activity"));
app.use("/api/kcal", require("./routes/kcal"));
app.use("/api/workout", require("./routes/workout"));



// ✅ MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/fittrack_db")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ✅ AUTH ROUTES (THIS WAS MISSING / BROKEN BEFORE)
app.use("/api/auth", require("./routes/auth"));

// test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = 5000;
app.get("/", (req, res) => {
  res.send("FitTrack Backend is running");
});

app.listen(PORT, () => {
  console.log("BACKEND IS RUNNING");
  console.log(`Server running on http://localhost:${PORT}`);
});
