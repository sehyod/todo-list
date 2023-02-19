# Getting started

To run this server locally:
* Clone this repo
* `npm install` to install the dependencies
* Install MongoDB Community Edition and run it
* Set your database URI in the .env file
* Create a `tasks` collection and a `projects` collection in your database
* `npm run start` to start the server (or alternatively `npm run dev` to start it with nodemon)

# Application structure
* `index.js` - Entry point to the application. This file contains the definition of the express server and the connection to MongoDB.
* `config/` - The folder contains the configuration of the client, to connect to the MongoDB.
* `controllers/` - This folder contains the controllers, which receive requests and send the corresponding result.
* `middlewares/` - This folder contains middlewares used to validate data passed in the requests.
* `models/` - This folder contains the methods use to access to the data in database.
* `routes/` - This folder contains the definition of the routes of this API.

# Routes
* POST /tasks
  * Creates a new task
  * The body must includes a `name`, a `start_date` and a `due_date`. It may also specify a `project_id`.
* GET /tasks
  * Returns the list of tasks
  * The list can be filtered by status, by adding the following query: `?status=done` or `?status=todo`
  * The list can be filtered by name, by adding  the following query: `?name=...`
  * The list can be sorted by `start_date`, `due_date` or `done_date`, in ascending or descending order, by adding the following query: `?sort=...`. The format is `+` or `-` followed by the attribute to order by. `+` is for ascending order, `-` is for descending order. E.g. `?sort=+start_date` will sort by ascending start date
  * The list can be filtered by project name by adding the following query: `?project_name=...`
  * All the filtering and sorting options above can be combined
* PUT /tasks/:id
  * Updates the task in the database
  * The fields that can be updated are the following: `name`, `start_date`, `due_date` and `project_id`
  * Returns an error code `404` if the task does not exist
* DELETE /tasks/:id
  * Deletes the task
  * Returns an error code `404` if the task does not exist
* PATCH /tasks/:id/status
  * Toggles between done and todo status for the task
  * Marking a task as done updates the `done_date` of the task
  * Marking a task as todo updates the `start_date` and `done_date` of the task
  * Returns an error code `404` if the task does not exist
* PATCH /tasks/:id_task/project/:id_project
  * Assigns a task to a project
  * Returns an error code `404` if the task does not exist or if the project does not exist
* POST /projects
  * Creates a new project
  * The body must includes a `name`, a `start_date` and a `due_date`
* GET /projects
  * Returns the list of projects
  * The list can be filtered by name and ordered by `start_date` or `due_date`, following the same syntax as for tasks
* PUT /projects/:id
  * Updates the project in the database
  * The fields that can be updated are the following: `name`, `start_date`, `due_date`
  * Returns an error code `404` if the project does not exist
* DELETE /projects/:id
  * Deletes the project
  * Returns an error code `404` if the project does not exist

# Validation
Different generic middlewares have been implemented to validate data;
* `validateBody` checks that the body of the request only contains allowed fields and that none of the fields are empty. It also accepts optional fields, so that the user does not need to send the whole entity to update it, but only the fields to update. If the body is invalid, it returns an error code `400` and a description of all errors that were found in the body.
* `isIdValid` checks that the id passed in request such as update or delete requests is actually corresponding to an entity in databse. It returns error code `404` otherwise, along with an explanation message.
* `isTaskFilteringQueryValid` ensures that only `done` and `todo` can be passed as status when filtering tasks by status.
* `isSortingQueryValid` checks the validity of sorting query parameters. The format is the following:
  * +/-, for ascending and descending order respectively
  * followed by the name of the attribute to order by

# Bonus
The bonus file contains two MongoDB aggregations:
* `getProjectsWithTaskDueToday` returns all the projects that have a task with a due date set to "today"
* `getTasksBelongingToProjectDueToday` returns all the tasks that have a project with a due date set to "today"