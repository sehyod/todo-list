const { ObjectId } = require("mongodb");
const { getClient } = require("../config/db");

async function get(id) {
  const result = await getClient()
    .db()
    .collection("projects")
    .findOne({ _id: new ObjectId(id) });

  return result;
}

async function create({ name, startDate, dueDate }) {
  const result = await getClient().db().collection("projects").insertOne({
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
    .collection("projects")
    .find(filter)
    .sort(sortBy)
    .toArray();

  return result;
}

async function update(id, attributesToUpdate) {
  const result = await getClient()
    .db()
    .collection("projects")
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...attributesToUpdate } });

  return result;
}

async function del(id) {
  const result = await getClient()
    .db()
    .collection("projects")
    .deleteOne({ _id: new ObjectId(id) });

  return result;
}

// async function test(project_name) {
//   const result = await getClient()
//     .db()
//     .collection("projects")
//     .find({ name: { $regex: new RegExp(project_name, "gi") } })
//     .;
// }

module.exports = {
  get,
  create,
  list,
  update,
  del,
  // test,
};
