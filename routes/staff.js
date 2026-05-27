var express = require("express");
var router = express.Router();
const createUploader = require("../utils/multer");
const upload = createUploader("images/StaffProfileImages");
let {
  createStaff,
  loginStaff,
  fetchAllStaffs,
  fetchStaffById,
  staffUpdate,
  staffDelete,
  getCurrentStaff,
  fetchStaffDropdown,
} = require("../controller/staff");
const authMiddleware = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission");

router.post("/create", authMiddleware, checkPermission('Staff', 'create'), createStaff);
router.post("/login", loginStaff);
router.get("/me", authMiddleware, getCurrentStaff);
router.get("/", authMiddleware, checkPermission('Staff', 'read'), fetchAllStaffs);
router.get("/dropdown", authMiddleware, fetchStaffDropdown);
router.get("/:id", authMiddleware, checkPermission('Staff', 'read'), fetchStaffById);
router.put("/:id", authMiddleware, checkPermission('Staff', 'update'), staffUpdate);
router.delete("/:id", authMiddleware, checkPermission('Staff', 'delete'), staffDelete);
module.exports = router;   
