const tasksModel = require("../models/tasks");

/**
 * Validate the fields passed in the body of a request
 * @param strictMode boolean indicating whether all fields must be present
 * When set to false, only checks that the passed fields respect the expected format
 */
function validateTask(strictMode = true) {
  return async (req, res, next) => {
    const EXPECTED_FIELDS = ["name", "start_date", "due_date"];
    const errors = [];
    if (strictMode) {
      // When in strict mode, check that the field is present
      EXPECTED_FIELDS.forEach((fieldName) => {
        if (!req.body[fieldName]) {
          errors.push(`Missing field "${fieldName}".`);
        }
      });
    }
    // Check that all passed fields are allowed and have a non-empty value
    Object.keys(req.body).forEach((fieldName) => {
      if (!EXPECTED_FIELDS.includes(fieldName)) {
        errors.push(`Unexpected field "${fieldName}".`);
      } else if (!req.body[fieldName]) {
        errors.push(`"${fieldName}" cannot be empty`);
      }
    });

    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    next();
  };
}

async function isTaskIdValid(req, res, next) {
  try {
    const task = await tasksModel.get(req.params.id);
    if (!task) {
      res.status(404).send("This task does not exist.");
      return;
    }
    // Add the task entity to the req object
    req.task = task;
    return next();
  } catch (e) {
    console.error(e);
    res.status(400).send("Invalid id format");
  }
}

async function isFilteringQueryValid(req, res, next) {
  if (req.query?.status) {
    // The only available values are "done" and "todo"
    if (req.query.status !== "done" && req.query.status !== "todo") {
      res
        .status(400)
        .send("Invalid status. The values must be 'done' or 'todo'.");
      return;
    }
  }
  next();
}

async function isSortingQueryValid(req, res, next) {
  if (req.query?.sort) {
    // The correct format is '+' or '-' followed by 'start_date', 'done_date' or 'due_date'
    if (
      !["+", "-"].includes(req.query.sort[0]) ||
      !["start_date", "done_date", "due_date"].includes(req.query.sort.slice(1))
    ) {
      res
        .status(400)
        .send(
          "Invalid sorting query. The format is '+' for ascending order, or '-' for descending order, followed by 'start_date', 'done_date' or 'due_date'. Example: sort=-due_date"
        );
      return;
    }
  }
  next();
}

module.exports = {
  validateTask,
  isTaskIdValid,
  isFilteringQueryValid,
  isSortingQueryValid,
};
