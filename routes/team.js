var express = require("express");
var router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  createTeam,
  fetchAllTeams,
  fetchTeamById,
  updateTeam,
  deleteTeam,
  fetchTeamsDropdown,
} = require("../controller/team");

const { checkPermission } = require("../middleware/permission");

router.post("/create", authMiddleware, checkPermission('Teams', 'create'), createTeam);
router.get("/", authMiddleware, checkPermission('Teams', 'read'), fetchAllTeams);
router.get("/dropdown", authMiddleware, fetchTeamsDropdown);
router.get("/:id", authMiddleware, checkPermission('Teams', 'read'), fetchTeamById);
router.put("/:id", authMiddleware, checkPermission('Teams', 'update'), updateTeam);
router.delete("/:id", authMiddleware, checkPermission('Teams', 'delete'), deleteTeam);

module.exports = router;
