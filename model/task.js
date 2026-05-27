const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    projectId: { type: String, required: true },
    assigneeId: { type: String, default: "" },
    status: { type: String, default: "todo" }, // backlog, todo, in-progress, review, done
    priority: { type: String, default: "Medium" }, // Low, Medium, High
    dueDate: { type: String, default: "" },
    color: { type: String, default: "bg-indigo-500" },
    order: { type: Number, default: 0 },
    dueTime: { type: String, default: "" },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    actualSeconds: { type: Number, default: 0 },
    extraSeconds: { type: Number, default: 0 },
    timerRunning: { type: Boolean, default: false },
    timerStartedAt: { type: Number, default: null },
    completed: { type: Boolean, default: false },
    comments: [
      {
        text: { type: String, required: true },
        authorId: { type: String },
        authorName: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
