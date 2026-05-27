const TASK = require("../model/task");
const Project = require("../model/project");

exports.createTaskService = async (body) => {
  const task = await TASK.create(body);
  return task;
};

exports.fetchAllTasksService = async (params = {}, user, role, permissions) => {
  const { page = 1, limit = 10, ...query } = params;
  const skip = (page - 1) * limit;

  // Data Isolation: If user is a customer, only show tasks for their projects
  if (role === "Customer") {
    const customerProjects = await Project.find({ customerId: user._id.toString() }).select("_id");
    const projectIds = customerProjects.map(p => p._id.toString());
    query.projectId = { $in: projectIds };
  } else {
    // Staff permission check
    const perms = permissions?.Tasks || {};
    if (!perms.read_all) {
      if (perms.read_own) {
        // Only show tasks where user is assignee
        query.assigneeIds = user._id.toString();
      } else {
        // No permission to read any
        return { tasks: [], total: 0 };
      }
    }
  }

  const total = await TASK.countDocuments(query);
  const tasks = await TASK.find(query)
    .sort({ order: 1, createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  return { tasks, total };
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

exports.addCommentService = async (id, comment) => {
  const task = await TASK.findByIdAndUpdate(
    id,
    { $push: { comments: comment } },
    { new: true }
  );
  return task;
};

exports.addAttachmentService = async (id, attachment) => {
  const task = await TASK.findByIdAndUpdate(
    id,
    { $push: { attachments: attachment } },
    { new: true }
  );
  return task;
};

exports.toggleTimerService = async (id) => {
  const task = await TASK.findById(id);
  if (!task) throw new Error("Task not found");

  if (task.timerRunning) {
    // Stop
    const elapsed = Math.floor((Date.now() - task.timerStartedAt) / 1000);
    task.actualSeconds += elapsed;
    task.timerRunning = false;
    task.timerStartedAt = null;
  } else {
    // Start
    task.timerRunning = true;
    task.timerStartedAt = Date.now();
  }

  await task.save();
  return task;
};
