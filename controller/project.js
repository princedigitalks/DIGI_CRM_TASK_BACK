const {
  createProjectService,
  fetchAllProjectsService,
  fetchProjectByIdService,
  updateProjectService,
  deleteProjectService,
  fetchCustomersDropdownService,
  fetchStaffByTeamService,
} = require("../service/project");

exports.createProject = async (req, res) => {
  try {
    const project = await createProjectService(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await fetchAllProjectsService({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
    });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await fetchProjectByIdService(req.params.id);
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await updateProjectService(req.params.id, req.body);
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await deleteProjectService(req.params.id);
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

exports.getCustomersDropdown = async (req, res) => {
  try {
    const customers = await fetchCustomersDropdownService();
    res.status(200).json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStaffByTeam = async (req, res) => {
  try {
    const staff = await fetchStaffByTeamService(req.params.teamId);
    res.status(200).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
