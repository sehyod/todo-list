const express = require("express");

const {
  createTask,
  listTasks,
  editTask,
  deleteTask,
  toggleTaskState,
} = require("../controllers/tasks");
const {
  isTaskIdValid,
  isFilteringQueryValid,
  isSortingQueryValid,
  validateTask,
} = require("../middlewares/tasks");

const router = express.Router();

router.post("/", validateTask(true), createTask);
router.get("/", isFilteringQueryValid, isSortingQueryValid, listTasks);
router.put("/:id", validateTask(false), isTaskIdValid, editTask);
router.delete("/:id", isTaskIdValid, deleteTask);
router.patch("/:id/status", isTaskIdValid, toggleTaskState);

module.exports = router;
