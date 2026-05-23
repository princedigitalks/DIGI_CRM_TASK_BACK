const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    color: { type: String, default: "bg-blue-500" },
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    customerId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", TeamSchema);
