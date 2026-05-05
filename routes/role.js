var express = require("express");
var router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  createRole,
  fetchAllRoles,
  fetchRoleById,
  updateRole,
  deleteRole,
} = require("../controller/role");

router.post("/create", authMiddleware, createRole);
router.get("/", authMiddleware, fetchAllRoles);
router.get("/:id", authMiddleware, fetchRoleById);
router.put("/:id", authMiddleware, updateRole);
router.delete("/:id", authMiddleware, deleteRole);

module.exports = router;
