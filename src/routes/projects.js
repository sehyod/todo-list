const express = require("express");

const {
  createProject,
  listProjects,
  editProject,
  deleteProject,
} = require("../controllers/projects");
const {
  isIdValid,
  isSortingQueryValid,
  validateBody,
} = require("../middlewares/validators");
const projectsModel = require("../models/projects");

const router = express.Router();

router.post(
  "/",
  validateBody(["name", "start_date", "due_date"]),
  createProject
);
router.get("/", isSortingQueryValid(["start_date", "due_date"]), listProjects);
router.put(
  "/:id",
  validateBody([], ["name", "start_date", "due_date"]),
  isIdValid({ model: projectsModel, documentName: "project" }),
  editProject
);
router.delete(
  "/:id",
  isIdValid({ model: projectsModel, documentName: "project" }),
  deleteProject
);

module.exports = router;
