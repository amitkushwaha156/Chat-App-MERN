const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide Name"],
    },

    email: {
      type: String,
      required: [true, "Provide Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Provide Password"],
    },
    profile_pic: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema); //user is table name

module.exports = userModel;
