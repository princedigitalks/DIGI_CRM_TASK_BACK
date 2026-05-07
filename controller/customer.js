const {
  createCustomerService,
  fetchAllCustomersService,
  fetchCustomerByIdService,
  updateCustomerService,
  deleteCustomerService,
} = require("../service/customer");

exports.createCustomer = async (req, res) => {
  try {
    const data = await createCustomerService(req.body);
    return res.status(201).json({ status: "Success", message: "Customer created successfully", data });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.fetchAllCustomers = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 100;
    const search = req.query.search || "";
    const { total, data } = await fetchAllCustomersService({ page, limit, search });
    return res.status(200).json({
      status: "Success",
      message: "Customers fetched successfully",
      pagination: { totalRecords: total, currentPage: page, totalPages: Math.ceil(total / limit), limit },
      data,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.fetchCustomerById = async (req, res) => {
  try {
    const data = await fetchCustomerByIdService(req.params.id);
    return res.status(200).json({ status: "Success", message: "Customer fetched successfully", data });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const data = await updateCustomerService(req.params.id, req.body);
    return res.status(200).json({ status: "Success", message: "Customer updated successfully", data });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await deleteCustomerService(req.params.id);
    return res.status(200).json({ status: "Success", message: "Customer deleted successfully" });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};
