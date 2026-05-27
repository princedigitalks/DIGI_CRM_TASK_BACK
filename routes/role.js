var express = require("express");
var router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  createRole,
  fetchAllRoles,
  fetchRoleById,
  updateRole,
  deleteRole,
  fetchRolesDropdown,
} = require("../controller/role");

const { checkPermission } = require("../middleware/permission");

router.post("/create", authMiddleware, checkPermission('Roles', 'create'), createRole);
router.get("/", authMiddleware, checkPermission('Roles', 'read'), fetchAllRoles);
router.get("/dropdown", authMiddleware, fetchRolesDropdown);
router.get("/:id", authMiddleware, checkPermission('Roles', 'read'), fetchRoleById);
router.put("/:id", authMiddleware, checkPermission('Roles', 'update'), updateRole);
router.delete("/:id", authMiddleware, checkPermission('Roles', 'delete'), deleteRole);

module.exports = router;
