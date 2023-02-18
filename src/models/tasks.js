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
    .find({ ...filter })
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

module.exports = {
  get,
  create,
  list,
  update,
  del,
};
