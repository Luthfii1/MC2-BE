import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  assignUser: {
    type: [String],
    required: true,
  },
  dateQuest: {
    type: Date,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  type: {
    type: String,
    required: true,
    enum: ["DAILY", "COUPLE", "EVENT"],
  },
  description: {
    type: String,
    required: true,
  },
});

const Log = mongoose.model("Log", logSchema);

module.exports = { Log };
