const projectsModel = require("../models/projects");

async function createProject(req, res) {
  await projectsModel.create({
    name: req.body.name,
    startDate: new Date(req.body.start_date),
    dueDate: new Date(req.body.due_date),
  });

  res.sendStatus(204);
}

async function listProjects(req, res) {
  let filter = {};
  let sortBy = {};

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
  const result = await projectsModel.list(filter, sortBy);

  res.status(200).send(result);
}

async function editProject(req, res) {
  const attributesToUpdate = { ...req.body };
  // Only update start_date and due_date if the corresponding fields have been passed in the request
  if (req.body.start_date) {
    attributesToUpdate.start_date = new Date(req.body.start_date);
  }
  if (req.body.due_date) {
    attributesToUpdate.due_date = new Date(req.body.due_date);
  }

  await projectsModel.update(req.project._id, attributesToUpdate);

  res.sendStatus(204);
}

async function deleteProject(req, res) {
  await projectsModel.del(req.project._id);

  res.sendStatus(204);
}

module.exports = {
  createProject,
  listProjects,
  editProject,
  deleteProject,
};
