const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getCustomersDropdown,
  getStaffByTeam,
} = require("../controller/project");

const authMiddleware = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission");

router.post("/", authMiddleware, checkPermission('Projects', 'create'), createProject);
router.get("/", authMiddleware, checkPermission('Projects', 'read'), getAllProjects);
router.get("/customers-dropdown", authMiddleware, getCustomersDropdown);
router.get("/staff-by-team/:teamId", authMiddleware, getStaffByTeam);
router.get("/:id", authMiddleware, checkPermission('Projects', 'read'), getProjectById);
router.put("/:id", authMiddleware, checkPermission('Projects', 'update'), updateProject);
router.delete("/:id", authMiddleware, checkPermission('Projects', 'delete'), deleteProject);

module.exports = router;
