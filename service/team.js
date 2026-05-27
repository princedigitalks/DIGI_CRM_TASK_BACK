const TEAM = require("../model/team");
const STAFF = require("../model/staff");

exports.createTeamService = async (body) => {
  const { name, description, color, memberIds, customerId } = body;
  const team = await TEAM.create({ name, description, color, memberIds: memberIds || [], customerId: customerId || "" });
  // Clear teamId for these members in case they were in other teams, and set to this one
  if (memberIds && memberIds.length > 0) {
    await STAFF.updateMany({ _id: { $in: memberIds } }, { teamId: team._id });
  }
  const members = await STAFF.find({ teamId: team._id });
  const t = team.toObject();
  t.memberIds = members;
  return t;
};

exports.fetchAllTeamsService = async ({ page, limit, search, user, role, permissions }) => {
  const skip = (page - 1) * limit;
  let query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  };

  if (role !== "Customer") {
    const perms = permissions?.Teams || {};
    if (!perms.read_all) {
      if (perms.read_own && user.teamId) {
        query._id = user.teamId;
      } else {
        return { totalTeams: 0, teamsData: [] };
      }
    }
  }
  const totalTeams = await TEAM.countDocuments(query);
  const teamsData = await TEAM.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

  // Dynamically fetch members for each team to ensure sync
  const populatedTeams = await Promise.all(teamsData.map(async (team) => {
    const members = await STAFF.find({ teamId: team._id.toString() });
    const t = team.toObject();
    t.memberIds = members; // Override with actual staff members found
    return t;
  }));

  return { totalTeams, teamsData: populatedTeams };
};

exports.fetchTeamByIdService = async (teamId) => {
  const team = await TEAM.findById(teamId);
  if (!team) throw new Error("Team not found");
  const members = await STAFF.find({ teamId: teamId });
  const t = team.toObject();
  t.memberIds = members;
  return t;
};

exports.updateTeamService = async (teamId, body) => {
  const team = await TEAM.findById(teamId);
  if (!team) throw new Error("Team not found");
  const updated = await TEAM.findByIdAndUpdate(teamId, body, { new: true });

  if (body.memberIds) {
    // Clear teamId for staff who were PREVIOUSLY in this team but are now REMOVED
    await STAFF.updateMany({ teamId: teamId, _id: { $nin: body.memberIds } }, { teamId: "" });
    // Set teamId for staff who are NOW in this team
    await STAFF.updateMany({ _id: { $in: body.memberIds } }, { teamId: teamId });
  }

  const members = await STAFF.find({ teamId: teamId });
  const t = updated.toObject();
  t.memberIds = members;
  return t;
};

exports.deleteTeamService = async (teamId) => {
  const team = await TEAM.findById(teamId);
  if (!team) throw new Error("Team not found");
  await TEAM.findByIdAndDelete(teamId);
};

exports.fetchTeamsDropdownService = async () => {
  return await TEAM.find({}).select("name color description").sort({ name: 1 });
};
