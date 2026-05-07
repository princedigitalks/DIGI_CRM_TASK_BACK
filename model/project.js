const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    customerId: { type: String, required: true },
    teamId: { type: String, default: "" },
    assignedMemberIds: [{ type: String }],
    status: { type: String, default: "Active" },
    dueDate: { type: String, default: "" },
    budget: { type: String, default: "" },
    currency: { type: String, default: "INR ₹" },
    color: { type: String, default: "bg-indigo-500" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
