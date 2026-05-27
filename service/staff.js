const STAFF = require("../model/staff");
const TEAM = require("../model/team");
const { encryptData, decryptData } = require("../utils/crypto");
const jwt = require("jsonwebtoken");

exports.createStaffService = async (body) => {
  const { fullName, email, phone, password, googlePassword, status, designation, department, role, teamId, color, googleId, salary, currency, joinDate, address, city, country, notes } = body;
  const encryptedPassword = password ? encryptData(password) : undefined;
  const encryptedGooglePassword = googlePassword ? encryptData(googlePassword) : undefined;
  const staffData = {
    fullName, email, phone,
    status: status || "active",
    ...(encryptedPassword && { password: encryptedPassword }),
    ...(encryptedGooglePassword && { googlePassword: encryptedGooglePassword }),
    designation, department, role, teamId, color, googleId, salary, currency, joinDate, address, city, country, notes,
  };
  const staffDetails = await STAFF.create(staffData);

  if (teamId) {
    await TEAM.findByIdAndUpdate(teamId, { $addToSet: { memberIds: staffDetails._id } });
  }

  const s = staffDetails.toObject();
  if (s.googlePassword) s.googlePassword = decryptData(s.googlePassword);
  if (s.password) s.password = decryptData(s.password);
  return s;
};

exports.loginStaffService = async ({ email, password }) => {
  const staffverify = await STAFF.findOne({ email }).select("+password +googlePassword");
  if (!staffverify) throw new Error("Invalid Email or password");

  const decryptedPassword = decryptData(staffverify.password);
  if (String(decryptedPassword) !== password) throw new Error("Invalid password");

  const s = staffverify.toObject();
  delete s.password;
  if (s.googlePassword) s.googlePassword = decryptData(s.googlePassword);
  s.name = s.fullName;

  const ROLE = require("../model/role");
  const roleData = await ROLE.findOne({ name: s.role });
  let permissions = roleData ? roleData.permissions : {};

  // Special handling for Admin: ensure full access to all panels
  if (s.role === "Admin") {
    const PANELS = ["Dashboard", "Staff", "Customers", "Projects", "Tasks", "Teams", "Reports", "Roles", "Archive", "Support", "Finance"];
    const ACTIONS = ["create", "read_all", "read_own", "update", "delete"];
    PANELS.forEach(p => {
      permissions[p] = {};
      ACTIONS.forEach(a => permissions[p][a] = true);
    });
  }
  s.permissions = permissions;

  const hasFinanceRead = permissions?.Finance?.read_all || permissions?.Finance?.read_own;
  if (!hasFinanceRead) {
    delete s.salary;
    delete s.currency;
    delete s.bankName;
    delete s.accountNumber;
    delete s.ifscCode;
  }

  const token = jwt.sign({ id: staffverify._id, role: s.role }, process.env.JWT_SECRET_KEY);
  return { staff: s, token };
};

exports.fetchAllStaffsService = async ({ page, limit, search, user, permissions }) => {
  const skip = (page - 1) * limit;
  let query = {
    $or: [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
    ],
  };

  const perms = permissions?.Staff || {};
  if (!perms.read_all) {
    if (perms.read_own) {
      query._id = user._id;
    } else {
      return { totalStaff: 0, staffsData: [] };
    }
  }
  const totalStaff = await STAFF.countDocuments(query);
  const staffsData = await STAFF.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

  const hasFinanceRead = permissions?.Finance?.read_all || permissions?.Finance?.read_own;

  const decryptedStaffs = staffsData.map(staff => {
    const s = staff.toObject();
    if (s.googlePassword) s.googlePassword = decryptData(s.googlePassword);
    if (s.password) s.password = decryptData(s.password);
    if (!hasFinanceRead) {
      delete s.salary;
      delete s.currency;
      delete s.bankName;
      delete s.accountNumber;
      delete s.ifscCode;
    }
    return s;
  });

  return { totalStaff, staffsData: decryptedStaffs, page, limit };
};

exports.fetchStaffByIdService = async (staffId, permissions) => {
  const hasFinanceRead = permissions?.Finance?.read_all || permissions?.Finance?.read_own;

  const staffData = await STAFF.findById(staffId);
  if (!staffData) throw new Error("Staff not found");
  const s = staffData.toObject();
  if (s.googlePassword) s.googlePassword = decryptData(s.googlePassword);
  if (s.password) s.password = decryptData(s.password);
  if (!hasFinanceRead) {
    delete s.salary;
    delete s.currency;
    delete s.bankName;
    delete s.accountNumber;
    delete s.ifscCode;
  }
  return s;
};

exports.staffUpdateService = async (staffId, body) => {
  const oldStaff = await STAFF.findById(staffId);
  if (!oldStaff) throw new Error("Staff not found");
  if (body.password) {
    body.password = encryptData(body.password);
  } else {
    delete body.password;
  }

  if (body.googlePassword) {
    body.googlePassword = encryptData(body.googlePassword);
  } else {
    delete body.googlePassword;
  }

  const updatedStaff = await STAFF.findByIdAndUpdate(staffId, body, { new: true });

  // Sync team memberIds
  if (body.teamId !== undefined) {
    // If team changed, remove from old team
    if (oldStaff.teamId && oldStaff.teamId !== body.teamId) {
      await TEAM.findByIdAndUpdate(oldStaff.teamId, { $pull: { memberIds: staffId } });
    }
    // Add to new team
    if (body.teamId) {
      await TEAM.findByIdAndUpdate(body.teamId, { $addToSet: { memberIds: staffId } });
    }
  }

  const s = updatedStaff.toObject();
  if (s.googlePassword) s.googlePassword = decryptData(s.googlePassword);
  if (s.password) s.password = decryptData(s.password);
  return s;
};

exports.staffDeleteService = async (staffId) => {
  const oldStaff = await STAFF.findById(staffId);
  if (!oldStaff) throw new Error("Staff not found");
  await STAFF.findByIdAndDelete(staffId);
};

exports.fetchStaffDropdownService = async () => {
  return await STAFF.find({}).select("fullName initials color status").sort({ fullName: 1 });
};
