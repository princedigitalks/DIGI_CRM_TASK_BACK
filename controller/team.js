const {
  createTeamService,
  fetchAllTeamsService,
  fetchTeamByIdService,
  updateTeamService,
  deleteTeamService,
  fetchTeamsDropdownService,
} = require("../service/team");

exports.createTeam = async (req, res) => {
  try {
    const team = await createTeamService(req.body);
    return res.status(201).json({ status: "Success", message: "Team created successfully", data: team });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.fetchAllTeams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const { totalTeams, teamsData } = await fetchAllTeamsService({ page, limit, search, user: req.user, role: req.role, permissions: req.permissions });
    return res.status(200).json({
      status: "Success",
      message: "Teams fetched successfully",
      pagination: { totalRecords: totalTeams, currentPage: page, totalPages: Math.ceil(totalTeams / limit), limit },
      data: teamsData,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.fetchTeamById = async (req, res) => {
  try {
    const team = await fetchTeamByIdService(req.params.id);
    return res.status(200).json({ status: "Success", message: "Team fetched successfully", data: team });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const team = await updateTeamService(req.params.id, req.body);
    return res.status(200).json({ status: "Success", message: "Team updated successfully", data: team });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    await deleteTeamService(req.params.id);
    return res.status(200).json({ status: "Success", message: "Team deleted successfully" });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.fetchTeamsDropdown = async (req, res) => {
  try {
    const teams = await fetchTeamsDropdownService();
    return res.status(200).json({ status: "Success", message: "Teams dropdown fetched", data: teams });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
