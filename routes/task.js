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

router.post("/", createTask);
router.get("/", fetchAllTasks);
router.get("/:id", fetchTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/reorder", reorderTasks);
router.post("/:id/comments", addComment);
router.post("/:id/attachments", addAttachment);
router.post("/:id/timer", toggleTimer);

module.exports = router;
