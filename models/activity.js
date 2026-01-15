const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    details: String,
    calories: Number,
    time: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
