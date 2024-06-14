const mongoose = require("mongoose");

exports.connectDB = async function () {
  const URI = process.env.MONGODB_URI;

  mongoose.set("strictQuery", false);

  mongoose
    .connect(URI)
    .then(() => console.info("Connection to database established"))
    .catch((err: Error) => console.error("Error " + err.message));
};
