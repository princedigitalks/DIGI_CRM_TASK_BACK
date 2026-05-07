const express = require("express");
const router = express.Router();
const {
  createStatus,
  getAllStatuses,
  updateStatus,
  deleteStatus,
} = require("../controller/status");

router.post("/", createStatus);
router.get("/", getAllStatuses);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStatus);

module.exports = router;
