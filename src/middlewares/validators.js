function validateBody(mandatoryFields, optionalFields = []) {
  return (req, res, next) => {
    const errors = [];
    // Check that all mandatory fields are present in the request body
    mandatoryFields.forEach((fieldName) => {
      if (!req.body[fieldName]) {
        errors.push(`Missing field "${fieldName}".`);
      }
    });
    // Check that all passed fields are allowed and have a non-empty value
    expectedFields = mandatoryFields + optionalFields;
    Object.keys(req.body).forEach((fieldName) => {
      if (!expectedFields.includes(fieldName)) {
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

function isIdValid({ paramName = "id", model, documentName }) {
  return async (req, res, next) => {
    try {
      const document = await model.get(req.params[paramName]);
      if (!document) {
        res.status(404).send(`This ${documentName} does not exist.`);
        return;
      }
      // Add the document to the req object
      req[documentName] = document;
      return next();
    } catch (e) {
      console.error(e);
      res.status(400).send("Invalid id format");
    }
  };
}

function isTaskFilteringQueryValid() {
  return (req, res, next) => {
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
  };
}

function isSortingQueryValid(acceptedFields) {
  return (req, res, next) => {
    if (req.query?.sort) {
      // The correct format is '+' or '-' followed by the name of the field to order by
      if (
        !["+", "-"].includes(req.query.sort[0]) ||
        !acceptedFields.includes(req.query.sort.slice(1))
      ) {
        res
          .status(400)
          .send(
            `Invalid sorting query. The format is '+' for ascending order, or '-' for descending order, followed by one of the following: ${acceptedFields.join(
              ", "
            )}`
          );
        return;
      }
    }
    next();
  };
}

module.exports = {
  validateBody,
  isIdValid,
  isTaskFilteringQueryValid,
  isSortingQueryValid,
};
