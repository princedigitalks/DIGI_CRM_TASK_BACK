var express = require("express");
var router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  createCustomer,
  fetchAllCustomers,
  fetchCustomerById,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
} = require("../controller/customer");

const { checkPermission } = require("../middleware/permission");

router.post("/login", loginCustomer);
router.post("/create", authMiddleware, checkPermission('Customers', 'create'), createCustomer);
router.get("/", authMiddleware, checkPermission('Customers', 'read'), fetchAllCustomers);
router.get("/:id", authMiddleware, checkPermission('Customers', 'read'), fetchCustomerById);
router.put("/:id", authMiddleware, checkPermission('Customers', 'update'), updateCustomer);
router.delete("/:id", authMiddleware, checkPermission('Customers', 'delete'), deleteCustomer);

module.exports = router;
