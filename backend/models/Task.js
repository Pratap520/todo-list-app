const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },

    isCompleted: {
      type: Boolean,
      default: false
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);