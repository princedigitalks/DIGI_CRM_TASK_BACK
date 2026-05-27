const Project = require("../model/project");
const Customer = require("../model/customer");
const Staff = require("../model/staff");

exports.createProjectService = async (body) => {
  const project = await Project.create(body);
  return project;
};

exports.fetchAllProjectsService = async ({ page, limit, search, user, role }) => {
  const skip = (page - 1) * limit;
  let query = search
    ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    }
    : {};

  // Data Isolation: If user is a customer, only show their projects
  if (role === "Customer") {
    query.customerId = user._id.toString();
  }

  const total = await Project.countDocuments(query);
  const data = await Project.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
  return { total, data };
};


exports.fetchProjectByIdService = async (id) => {
  const project = await Project.findById(id);
  if (!project) throw new Error("Project not found");
  return project;
};

exports.updateProjectService = async (id, body) => {
  const project = await Project.findByIdAndUpdate(id, body, { new: true });
  if (!project) throw new Error("Project not found");
  return project;
};

exports.deleteProjectService = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) throw new Error("Project not found");
};

exports.fetchCustomersDropdownService = async () => {
  return await Customer.find({}).select("name company color initials status").sort({ company: 1 });
};

exports.fetchStaffByTeamService = async (teamId) => {
  return await Staff.find({ teamId }).select("fullName color status designation").sort({ fullName: 1 });
};
