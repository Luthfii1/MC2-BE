import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    require: true,
  },
});

const Badge = mongoose.model("Badge", badgeSchema);
exports.module = { Badge };
