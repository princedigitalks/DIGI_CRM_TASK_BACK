const express = require("express");
const router = express.Router();
const {
  createTask,
  fetchAllTasks,
  fetchTaskById,
  updateTask,
  deleteTask,
  reorderTasks,
  addComment,
  addAttachment,
  toggleTimer
} = require("../controller/task");

const authMiddleware = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission");

router.post("/", authMiddleware, checkPermission('Tasks', 'create'), createTask);
router.get("/", authMiddleware, checkPermission('Tasks', 'read'), fetchAllTasks);
router.get("/:id", authMiddleware, checkPermission('Tasks', 'read'), fetchTaskById);
router.put("/:id", authMiddleware, checkPermission('Tasks', 'update'), updateTask);
router.delete("/:id", authMiddleware, checkPermission('Tasks', 'delete'), deleteTask);
router.post("/reorder", authMiddleware, checkPermission('Tasks', 'update'), reorderTasks);
router.post("/:id/comments", authMiddleware, checkPermission('Tasks', 'read'), addComment);
router.post("/:id/attachments", authMiddleware, checkPermission('Tasks', 'read'), addAttachment);
router.post("/:id/timer", authMiddleware, checkPermission('Tasks', 'read'), toggleTimer);

module.exports = router;
