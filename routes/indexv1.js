var express = require("express");
var router = express.Router();

router.use("/health", require("./health"));
router.use("/staff", require("./staff"));
router.use("/roles", require("./role"));
router.use("/teams", require("./team"));
router.use("/customers", require("./customer"));

module.exports = router;
