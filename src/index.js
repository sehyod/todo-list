const express = require("express");
require("dotenv").config();
const db = require("./config/db");

const port = process.env.port || 3000;

const app = express();

app.use(express.json());

(async () => {
  await db.init();
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
})();
