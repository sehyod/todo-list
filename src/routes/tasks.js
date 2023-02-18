const express = require("express");

const {
  createTask,
  listTasks,
  editTask,
  deleteTask,
  toggleTaskStatus,
  assignTaskProject,
} = require("../controllers/tasks");
const {
  isIdValid,
  isTaskFilteringQueryValid,
  isSortingQueryValid,
  validateBody,
} = require("../middlewares/validators");
const tasksModel = require("../models/tasks");
const projectsModel = require("../models/tasks");

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
  isIdValid({ tasksModel, documentName: "task" }),
  editTask
);
router.delete(
  "/:id",
  isIdValid({ tasksModel, documentName: "task" }),
  deleteTask
);
router.patch(
  "/:id/status",
  isIdValid({ tasksModel, documentName: "task" }),
  toggleTaskStatus
);
router.patch(
  "/:id_task/project/:id_project",
  isIdValid({ paramName: "id_task", tasksModel, documentName: "task" }),
  isIdValid({
    paramName: "id_project",
    projectsModel,
    documentName: "project",
  }),
  assignTaskProject
);

module.exports = router;
