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
  const staffverify = await STAFF.findOne({ email });
  if (!staffverify) throw new Error("Invalid Email or password");

  const decryptedPassword = decryptData(staffverify.password);
  if (String(decryptedPassword) !== password) throw new Error("Invalid password");

  const s = staffverify.toObject();
  if (s.googlePassword) s.googlePassword = decryptData(s.googlePassword);
  if (s.password) s.password = decryptData(s.password);

  const token = jwt.sign({ id: staffverify._id }, process.env.JWT_SECRET_KEY);
  return { staff: s, token };
};

exports.fetchAllStaffsService = async ({ page, limit, search }) => {
  const skip = (page - 1) * limit;
  const query = {
    $or: [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
    ],
  };
  const totalStaff = await STAFF.countDocuments(query);
  const staffsData = await STAFF.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
  const decryptedStaffs = staffsData.map(staff => {
    const s = staff.toObject();
    if (s.googlePassword) s.googlePassword = decryptData(s.googlePassword);
    if (s.password) s.password = decryptData(s.password);
    return s;
  });
  return { totalStaff, staffsData: decryptedStaffs, page, limit };
};

exports.fetchStaffByIdService = async (staffId) => {
  const staffData = await STAFF.findById(staffId);
  if (!staffData) throw new Error("Staff not found");
  const s = staffData.toObject();
  if (s.googlePassword) s.googlePassword = decryptData(s.googlePassword);
  if (s.password) s.password = decryptData(s.password);
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
