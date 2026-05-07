const express = require("express");
const router = express.Router();
const {
  createTask,
  fetchAllTasks,
  fetchTaskById,
  updateTask,
  deleteTask,
  reorderTasks
} = require("../controller/task");

router.post("/", createTask);
router.get("/", fetchAllTasks);
router.get("/:id", fetchTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/reorder", reorderTasks);

module.exports = router;
