import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  partnerID: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: true,
    enum: ["MALE", "FEMALE", "UNKNOWN"],
  },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = { Account };
