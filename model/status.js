const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    color: { type: String, default: "bg-slate-100 text-slate-500" },
    type: { type: String, default: "Project" }, // e.g., Project, Task
  },
  { timestamps: true }
);

module.exports = mongoose.model("Status", StatusSchema);
