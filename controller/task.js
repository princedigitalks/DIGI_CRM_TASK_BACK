const {
  createTaskService,
  fetchAllTasksService,
  fetchTaskByIdService,
  updateTaskService,
  deleteTaskService,
  reorderTasksService,
  addCommentService,
  addAttachmentService,
  toggleTimerService
} = require("../service/task");

exports.createTask = async (req, res) => {
  try {
    const task = await createTaskService(req.body);
    return res.status(201).json({ status: "Success", data: task });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.fetchAllTasks = async (req, res) => {
  try {
    const { tasks, total } = await fetchAllTasksService(req.query, req.user, req.role, req.permissions);
    return res.status(200).json({ status: "Success", data: tasks, total });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.fetchTaskById = async (req, res) => {
  try {
    const task = await fetchTaskByIdService(req.params.id);
    return res.status(200).json({ status: "Success", data: task });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await updateTaskService(req.params.id, req.body);
    return res.status(200).json({ status: "Success", data: task });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await deleteTaskService(req.params.id);
    return res.status(200).json({ status: "Success", message: "Task deleted successfully" });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.reorderTasks = async (req, res) => {
  try {
    const result = await reorderTasksService(req.body.reorderedIds);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const task = await addCommentService(req.params.id, req.body);
    return res.status(200).json({ status: "Success", data: task });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.addAttachment = async (req, res) => {
  try {
    const task = await addAttachmentService(req.params.id, req.body);
    return res.status(200).json({ status: "Success", data: task });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.toggleTimer = async (req, res) => {
  try {
    const task = await toggleTimerService(req.params.id);
    return res.status(200).json({ status: "Success", data: task });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};
