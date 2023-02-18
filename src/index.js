const express = require("express");
require("dotenv").config();

const db = require("./config/db");
const tasksRouter = require("./routes/tasks");
const projectsRouter = require("./routes/projects");

const port = process.env.port || 3000;

const app = express();

app.use(express.json());
app.use("/tasks", tasksRouter);
app.use("/projects", projectsRouter);

(async () => {
  // Wait for db sync before starting listening
  await db.init();
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
})();
