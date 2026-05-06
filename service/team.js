const TEAM = require("../model/team");

exports.createTeamService = async (body) => {
  const { name, description, color, memberIds } = body;
  const team = await TEAM.create({ name, description, color, memberIds: memberIds || [] });
  return team;
};

exports.fetchAllTeamsService = async ({ page, limit, search }) => {
  const skip = (page - 1) * limit;
  const query = {
    $or: [
      { name:        { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  };
  const totalTeams = await TEAM.countDocuments(query);
  const teamsData  = await TEAM.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
  return { totalTeams, teamsData };
};

exports.fetchTeamByIdService = async (teamId) => {
  const team = await TEAM.findById(teamId);
  if (!team) throw new Error("Team not found");
  return team;
};

exports.updateTeamService = async (teamId, body) => {
  const team = await TEAM.findById(teamId);
  if (!team) throw new Error("Team not found");
  const updated = await TEAM.findByIdAndUpdate(teamId, body, { new: true });
  return updated;
};

exports.deleteTeamService = async (teamId) => {
  const team = await TEAM.findById(teamId);
  if (!team) throw new Error("Team not found");
  await TEAM.findByIdAndDelete(teamId);
};
