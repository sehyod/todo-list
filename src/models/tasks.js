const { ObjectId } = require("mongodb");
const { getClient } = require("../config/db");

async function get(id) {
  const result = await getClient()
    .db()
    .collection("tasks")
    .findOne({ _id: new ObjectId(id) });

  return result;
}

async function create({ name, startDate, dueDate }) {
  const result = await getClient().db().collection("tasks").insertOne({
    name,
    done: false,
    start_date: startDate,
    due_date: dueDate,
  });

  return result;
}

async function list(filter = {}, sortBy = {}) {
  const result = await getClient()
    .db()
    .collection("tasks")
    .find(filter)
    .sort(sortBy)
    .toArray();

  return result;
}

async function update(id, attributesToUpdate) {
  const result = await getClient()
    .db()
    .collection("tasks")
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...attributesToUpdate } });

  return result;
}

async function del(id) {
  const result = await getClient()
    .db()
    .collection("tasks")
    .deleteOne({ _id: new ObjectId(id) });

  return result;
}

async function listByProjectName(projectName, filter, sortBy) {
  const regex = new RegExp(projectName, "gi");
  const aggregationPipeline = [
    { $match: filter || {} },
    { $group: { _id: "$project_id", tasks: { $push: "$$ROOT" } } },
    {
      $lookup: {
        from: "projects",
        localField: "_id",
        foreignField: "_id",
        as: "project",
      },
    },
    { $match: { "project.name": { $regex: regex } } },
    { $project: { tasks: 1 } },
  ];

  if (Object.keys(sortBy).length > 0) {
    aggregationPipeline.push({ $sort: sortBy });
  }

  const result = await getClient()
    .db()
    .collection("tasks")
    .aggregate(aggregationPipeline)
    .toArray();

  return result;
}

module.exports = {
  get,
  create,
  list,
  update,
  del,
  listByProjectName,
};
