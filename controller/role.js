const {
  createRoleService,
  fetchAllRolesService,
  fetchRoleByIdService,
  updateRoleService,
  deleteRoleService,
} = require("../service/role");

exports.createRole = async (req, res) => {
  try {
    const role = await createRoleService(req.body);
    return res.status(201).json({ status: "Success", message: "Role created successfully", data: role });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.fetchAllRoles = async (req, res) => {
  try {
    const roles = await fetchAllRolesService();
    return res.status(200).json({ status: "Success", message: "Roles fetched successfully", data: roles });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.fetchRoleById = async (req, res) => {
  try {
    const role = await fetchRoleByIdService(req.params.id);
    return res.status(200).json({ status: "Success", message: "Role fetched successfully", data: role });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const updated = await updateRoleService(req.params.id, req.body);
    return res.status(200).json({ status: "Success", message: "Role updated successfully", data: updated });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await deleteRoleService(req.params.id);
    return res.status(200).json({ status: "Success", message: "Role deleted successfully" });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};
