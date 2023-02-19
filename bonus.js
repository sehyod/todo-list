/**
 * Returns a list of projects that have at least one task which due date is today
 */
function getProjectsWithTaskDueToday() {
  const start = new Date().setHours(0, 0, 0, 0);
  const end = new Date().setHours(23, 59, 59, 999);

  return getClient()
    .db()
    .collection("tasks")
    .aggregate([
      // Filter to keep only tasks that are due today and that belong to a project
      {
        $match: {
          due_date: { $gte: new Date(start), $lte: new Date(end) },
          project_id: { $ne: null },
        },
      },
      // Group the tasks by project
      { $group: { _id: "$project_id", tasks: { $push: "$$ROOT" } } },
      // Fetch the corresponding project documents
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      // Return only the project documents
      { $project: { project: 1 } },
      { $replaceRoot: { newRoot: "$project" } },
    ])
    .toArray();
}

/**
 * Returns a list of tasks that belong to a project which due date is today
 */
function getTasksBelongingToProjectDueToday() {
  const start = new Date().setHours(0, 0, 0, 0);
  const end = new Date().setHours(23, 59, 59, 999);

  return getClient()
    .db()
    .collection("projects")
    .aggregate([
      // Filter to keep only tasks that belong to a project
      {
        $match: { project_id: { $ne: null } },
      },
      // Group them by project
      { $group: { _id: "$project_id", tasks: { $push: "$$ROOT" } } },
      // Fetch the corresponding project documents
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      // Filter to keep only projects
      {
        $match: {
          "project.due_date": { $gte: new Date(start), $lte: new Date(end) },
        },
      },
      // Return only the task documents
      { $project: { tasks: 1 } },
      { $unwind: "$tasks" },
      { $replaceRoot: { newRoot: "$tasks" } },
    ])
    .toArray();
}
