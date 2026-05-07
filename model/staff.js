const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true, default: "+91 " },
    password: { type: String },
    status: { type: String, default: "active" },
    designation: { type: String, default: "" },
    department: { type: String, default: "" },
    role: { type: String, required: true, default: "Developer" },
    teamId: { type: String, default: "" },
    color: { type: String, default: "bg-indigo-500" },
    googleId: { type: String, default: "" },
    googlePassword: { type: String, default: "" },
    salary: { type: String, default: "" },
    currency: { type: String, default: "INR ₹" },
    joinDate: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "India" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", StaffSchema);
