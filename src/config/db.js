const { MongoClient } = require("mongodb");

const connectionString =
  process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/todoList";

const client = new MongoClient(connectionString);

const init = async () => {
  try {
    await client.connect();
    console.log("Connected to db");
  } catch (error) {
    console.error(error);
  }
};

const getClient = () => {
  return client;
};

module.exports.init = init;
module.exports.getClient = getClient;
