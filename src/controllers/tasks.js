const tasksModel = require("../models/tasks");
const projectsModel = require("../models/projects");

async function createTask(req, res) {
  await tasksModel.create({
    name: req.body.name,
    start_date: new Date(req.body.start_date),
    due_date: new Date(req.body.due_date),
  });

  res.sendStatus(204);
}

async function listTasks(req, res) {
  let filter = {};
  let sortBy = {};

  // Add filtering by status
  if (req.query?.status) {
    filter = { ...filter, done: req.query?.status === "done" };
  }

  // Add search by name
  if (req.query?.name) {
    const regex = new RegExp(req.query.name, "gi");
    filter = { ...filter, name: { $regex: regex } };
  }

  // Add sorting by date
  if (req.query?.sort) {
    // sort is '+' or '-' followed by the name of the attribute to sort by. '+' means ascending order and '-' descending order
    const order = req.query.sort[0] === "+" ? 1 : -1;
    const orderBy = req.query.sort.slice(1);
    sortBy = {
      [orderBy]: order,
    };
  }

  let result;
  // If there is a filter on the project name, we use the aggregation with the projects collection
  if (req.query?.project_name) {
    result = await tasksModel.listByProjectName(
      req.query.project_name,
      filter,
      sortBy
    );
  } else {
    result = await tasksModel.list(filter, sortBy);
  }

  res.status(200).send(result);
}

async function editTask(req, res) {
  const attributesToUpdate = { ...req.body };
  // Only update start_date and due_date if the corresponding fields have been passed in the request
  if (req.body.start_date) {
    attributesToUpdate.start_date = new Date(req.body.start_date);
  }
  if (req.body.due_date) {
    attributesToUpdate.due_date = new Date(req.body.due_date);
  }

  await tasksModel.update(req.task._id, attributesToUpdate);

  res.sendStatus(204);
}

async function deleteTask(req, res) {
  await tasksModel.del(req.task._id);

  res.sendStatus(204);
}

async function toggleTaskStatus(req, res) {
  let attributesToUpdate;
  if (req.task.done) {
    // If the task was already done, we mark it as to-do and reset the start and done dates
    attributesToUpdate = {
      done: false,
      start_date: null,
      done_date: null,
    };
  } else {
    // Otherwise, we mark the task as done and update the done date
    attributesToUpdate = {
      done: true,
      done_date: new Date(),
    };
  }
  await tasksModel.update(req.task._id, attributesToUpdate);

  res.sendStatus(204);
}

async function assignTaskProject(req, res) {
  await tasksModel.update(req.task._id, { project_id: req.project._id });

  res.sendStatus(204);
}

module.exports = {
  createTask,
  listTasks,
  editTask,
  deleteTask,
  toggleTaskStatus,
  assignTaskProject,
};
