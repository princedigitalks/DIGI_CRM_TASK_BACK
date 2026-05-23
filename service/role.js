const Role = require("../model/role");

exports.createRoleService = async ({ name, description, color, permissions }) => {
  const existing = await Role.findOne({ name });
  if (existing) throw new Error("Role with this name already exists");
  const role = await Role.create({ name, description, color, permissions });
  return role;
};

exports.fetchAllRolesService = async ({ page, limit, search }) => {
  const skip = (page - 1) * limit;
  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  };
  const totalRoles = await Role.countDocuments(query);
  const rolesData = await Role.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
  return { totalRoles, rolesData };
};

exports.fetchRoleByIdService = async (roleId) => {
  const role = await Role.findById(roleId);
  if (!role) throw new Error("Role not found");
  return role;
};

exports.updateRoleService = async (roleId, body) => {
  const role = await Role.findById(roleId);
  if (!role) throw new Error("Role not found");
  const updated = await Role.findByIdAndUpdate(roleId, body, { new: true });
  return updated;
};

exports.deleteRoleService = async (roleId) => {
  const role = await Role.findById(roleId);
  if (!role) throw new Error("Role not found");
  await Role.findByIdAndDelete(roleId);
};

exports.fetchRolesDropdownService = async () => {
  return await Role.find({}).select("name color permissions").sort({ name: 1 });
};
