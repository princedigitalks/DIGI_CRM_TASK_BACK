const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    company:   { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    phone:     { type: String, default: "" },
    website:   { type: String, default: "" },
    industry:  { type: String, default: "Technology" },
    address:   { type: String, default: "" },
    city:      { type: String, default: "" },
    country:   { type: String, default: "India" },
    currency:  { type: String, default: "INR ₹" },
    budget:    { type: String, default: "" },
    priority:  { type: String, default: "Medium" },
    status:    { type: String, default: "Active" },
    notes:     { type: String, default: "" },
    color:     { type: String, default: "bg-indigo-500" },
    initials:  { type: String, default: "" },
    password:  { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
