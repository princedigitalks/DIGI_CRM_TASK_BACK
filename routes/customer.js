var express = require("express");
var router  = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  createCustomer,
  fetchAllCustomers,
  fetchCustomerById,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
} = require("../controller/customer");

router.post("/login", loginCustomer);
router.post("/create",  authMiddleware, createCustomer);
router.get("/",         authMiddleware, fetchAllCustomers);
router.get("/:id",      authMiddleware, fetchCustomerById);
router.put("/:id",      authMiddleware, updateCustomer);
router.delete("/:id",   authMiddleware, deleteCustomer);

module.exports = router;
