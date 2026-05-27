const TASK = require("../model/task");
const Project = require("../model/project");

exports.createTaskService = async (body) => {
  const task = await TASK.create(body);
  return task;
};

exports.fetchAllTasksService = async (query = {}, user, role) => {
  // Data Isolation: If user is a customer, only show tasks for their projects
  if (role === "Customer") {
    const customerProjects = await Project.find({ customerId: user._id.toString() }).select("_id");
    const projectIds = customerProjects.map(p => p._id.toString());
    query.projectId = { $in: projectIds };
  }

  // Can filter by projectId, assigneeId, status etc
  const tasks = await TASK.find(query).sort({ order: 1, createdAt: -1 });
  return tasks;
};


exports.fetchTaskByIdService = async (id) => {
  const task = await TASK.findById(id);
  if (!task) throw new Error("Task not found");
  return task;
};

exports.updateTaskService = async (id, body) => {
  const task = await TASK.findByIdAndUpdate(id, body, { new: true });
  if (!task) throw new Error("Task not found");
  return task;
};

exports.deleteTaskService = async (id) => {
  const task = await TASK.findByIdAndDelete(id);
  if (!task) throw new Error("Task not found");
  return task;
};

exports.reorderTasksService = async (reorderedIds) => {
  const updates = reorderedIds.map((id, index) =>
    TASK.findByIdAndUpdate(id, { order: index })
  );
  await Promise.all(updates);
  return { status: "Success", message: "Tasks reordered" };
};
