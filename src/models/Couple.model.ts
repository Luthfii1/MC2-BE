import mongoose from "mongoose";

const coupleSchema = new mongoose.Schema({
  partnerID: {
    type: [String, String],
    required: true,
  },
  dateTogether: {
    type: Date,
    default: Date.now,
  },
});

const Couple = mongoose.model("Couple", coupleSchema);

module.exports = { Couple };
