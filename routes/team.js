var express = require("express");
var router  = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  createTeam,
  fetchAllTeams,
  fetchTeamById,
  updateTeam,
  deleteTeam,
} = require("../controller/team");

router.post("/create",  authMiddleware, createTeam);
router.get("/",         authMiddleware, fetchAllTeams);
router.get("/:id",      authMiddleware, fetchTeamById);
router.put("/:id",      authMiddleware, updateTeam);
router.delete("/:id",   authMiddleware, deleteTeam);

module.exports = router;
