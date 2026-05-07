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

const jwt = require("jsonwebtoken");
const { encryptData } = require("../utils/crypto");

exports.loginCustomerService = async ({ email, password }) => {
  const customer = await Customer.findOne({ email });
  if (!customer) throw new Error("Customer not found");
  
  const encryptedPassword = encryptData(password);
  if (customer.password !== encryptedPassword) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: customer._id, role: "Customer", email: customer.email },
    process.env.JWT_SECRET || "digitalks_secret_key",
    { expiresIn: "7d" }
  );

  return { customer, token };
};

exports.deleteCustomerService = async (id) => {
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) throw new Error("Customer not found");
};
