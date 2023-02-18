const express = require("express");

const {
  createTask,
  listTasks,
  editTask,
  deleteTask,
  toggleTaskState,
} = require("../controllers/tasks");
const {
  isIdValid,
  isTaskFilteringQueryValid,
  isSortingQueryValid,
  validateBody,
} = require("../middlewares/validators");
const tasksModel = require("../models/tasks");

const router = express.Router();

router.post(
  "/",
  validateBody(["name", "start_date", "due_date"], ["project_id"]),
  createTask
);
router.get(
  "/",
  isTaskFilteringQueryValid(),
  isSortingQueryValid(["start_date", "due_date", "done_date"]),
  listTasks
);
router.put(
  "/:id",
  validateBody([], ["name", "start_date", "due_date", "project_id"]),
  isIdValid(tasksModel, "task"),
  editTask
);
router.delete("/:id", isIdValid(tasksModel, "task"), deleteTask);
router.patch("/:id/status", isIdValid(tasksModel, "task"), toggleTaskState);

module.exports = router;
