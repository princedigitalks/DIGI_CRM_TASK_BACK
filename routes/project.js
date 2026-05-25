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

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/customers-dropdown", getCustomersDropdown);
router.get("/staff-by-team/:teamId", getStaffByTeam);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
