const Project = require("../model/project");

exports.createProjectService = async (body) => {
  const project = await Project.create(body);
  return project;
};

exports.fetchAllProjectsService = async ({ page, limit, search }) => {
  const skip = (page - 1) * limit;
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    : {};
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
