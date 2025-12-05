import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    number: {
      type: String,
      required: true,
      unique: true, // phone must be unique
      trim: true,
      match: /^[0-9]{10}$/ // <- only 10 digit Indian mobile format (editable)
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
