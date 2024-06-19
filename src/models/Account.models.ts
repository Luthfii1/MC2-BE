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
  coupleID: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: true,
    enum: ["MALE", "FEMALE", "UNKNOWN"],
  },
  loveLanguage: {
    type: String,
    required: false,
    enum: [
      "WORDS_OF_AFFIRMATION",
      "ACTS_OF_SERVICE",
      "RECEIVING_GIFTS",
      "QUALITY_TIME",
      "PHYSICAL_TOUCH",
    ],
  },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = { Account };
