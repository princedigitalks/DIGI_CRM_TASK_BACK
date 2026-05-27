const mongoose = require("mongoose");

const PANELS = ["Dashboard", "Staff", "Customers", "Projects", "Tasks", "Teams", "Reports", "Roles", "Archive", "Support", "Finance"];
const ACTIONS = ["create", "read_all", "read_own", "update", "delete"];

const permissionSchema = {};
PANELS.forEach((panel) => {
  permissionSchema[panel] = {};
  ACTIONS.forEach((action) => {
    permissionSchema[panel][action] = { type: Boolean, default: false };
  });
});

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    color: { type: String, default: "bg-indigo-500" },
    permissions: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
