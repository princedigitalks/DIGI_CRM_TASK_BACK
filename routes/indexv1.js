var express = require("express");
var router = express.Router();

router.use("/health", require("./health"));
router.use("/staff", require("./staff"));
router.use("/roles", require("./role"));
router.use("/teams", require("./team"));
router.use("/customers", require("./customer"));
router.use("/projects", require("./project"));
router.use("/statuses", require("./status"));
router.use("/tasks", require("./task"));

module.exports = router;
