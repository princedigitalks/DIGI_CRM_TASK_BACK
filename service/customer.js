const Customer = require("../model/customer");
const { encryptData } = require("../utils/crypto");

exports.createCustomerService = async (body) => {
  if (body.password) {
    body.password = encryptData(body.password);
  }
  const customer = await Customer.create(body);
  return customer;
};

exports.fetchAllCustomersService = async ({ page, limit, search }) => {
  const skip = (page - 1) * limit;
  const query = search
    ? {
        $or: [
          { name:    { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
          { email:   { $regex: search, $options: "i" } },
          { industry:{ $regex: search, $options: "i" } },
        ],
      }
    : {};
  const total = await Customer.countDocuments(query);
  const data  = await Customer.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
  return { total, data };
};

exports.fetchCustomerByIdService = async (id) => {
  const customer = await Customer.findById(id);
  if (!customer) throw new Error("Customer not found");
  return customer;
};

exports.updateCustomerService = async (id, body) => {
  if (body.password) {
    body.password = encryptData(body.password);
  } else {
    delete body.password;
  }
  const customer = await Customer.findByIdAndUpdate(id, body, { new: true });
  if (!customer) throw new Error("Customer not found");
  return customer;
};

exports.deleteCustomerService = async (id) => {
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) throw new Error("Customer not found");
};
