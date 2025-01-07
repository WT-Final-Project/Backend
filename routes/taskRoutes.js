const express = require("express");
const supabase = require("../supabase/supabaseClient"); // Import the client

const router = express.Router();

// Route to create a new task
router.post("/", async (req, res) => {
  try {
    const { projectId, username, title, description, dueDate } = req.body;

    // Insert a new task
    const { error: taskError, status: taskStatus } = await supabase
      .from("task")
      .insert({
        projectid: projectId,
        username: username,
        tasktitle: title,
        description: description,
        duedate: dueDate,
        completed: 0, // Default to not completed
      });

    if (taskError) {
      return res.status(taskStatus).json({
        error: `There was an error creating task: ${taskError.message}`,
      });
    }

    return res.sendStatus(taskStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get task by id
router.get("/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Fetch the task by its ID
    const {
      data: getData,
      error: getError,
      status: getStatus,
    } = await supabase.from("task").select().eq("taskid", taskId).single();

    if (getError) {
      return res.status(getStatus).json({
        error: `There was an error retrieving the task: ${getError.message}`,
      });
    }

    return res.status(getStatus).json({ data: getData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a task
router.delete("/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Delete the task
    const { error: deleteError, status: deleteStatus } = await supabase
      .from("task")
      .delete()
      .eq("taskid", taskId);

    if (deleteError) {
      return res.status(deleteStatus).json({
        error: `There was an error deleting the task: ${deleteError.message}`,
      });
    }

    return res.sendStatus(deleteStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update a task
// router.put("/:taskId", async (req, res) => {
//   try {
//     const taskId = req.params.taskId;
//     const {
//       idProyecto,
//       nombreUsuario,
//       titulo,
//       descripcion,
//       fechaVencimiento,
//       completada,
//     } = req.body;
//     // Llama a tu función DAO con los datos recibidos
//     const resultado = await tareaDAO.updateTarea(
//       idTarea,
//       idProyecto,
//       nombreUsuario,
//       titulo,
//       descripcion,
//       fechaVencimiento,
//       completada
//     );
//     res.json({ resultado });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Route to complete a task
router.post("/complete/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Update task to completed
    const { error: completeError, status: completeStatus } = await supabase
      .from("task")
      .update({
        completed: 1, // Mark the task as completed
      })
      .eq("taskid", taskId);

    if (completeError) {
      return res.status(completeStatus).json({
        error: `There was an error completing the task: ${completeError.message}`,
      });
    }

    return res.sendStatus(completeStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get the tasks uncompleted from a project
router.get("/uncompleted/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Fetch all uncompleted tasks for a specific project
    const {
      data: tasks,
      error: fetchError,
      status: fetchStatus,
    } = await supabase
      .from("task")
      .select()
      .eq("projectid", projectId)
      .eq("completed", 0); // Only tasks uncompleted

    if (fetchError) {
      return res.status(fetchStatus).json({
        error: `There was an error fetching the uncompleted tasks: ${fetchError.message}`,
      });
    }

    return res.status(fetchStatus).json({ data: tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to obtain all the task from a project.
router.get("/all/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Fetch all tasks for a specific project
    const {
      data: tasks,
      error: fetchError,
      status: fetchStatus,
    } = await supabase.from("task").select().eq("projectid", projectId);

    if (fetchError) {
      return res.status(fetchStatus).json({
        error: `There was an error fetching the tasks: ${fetchError.message}`,
      });
    }

    return res.status(fetchStatus).json({ data: tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to obtain user's uncompleted tasks from a project
router.get("/uncompleted/:projectId/:username", async (req, res) => {
  try {
    const { projectId, username } = req.params;

    // Fetch uncompleted tasks for a specific project and user
    const {
      data: tasks,
      error: fetchError,
      status: fetchStatus,
    } = await supabase
      .from("task")
      .select()
      .eq("projectid", projectId)
      .eq("username", username)
      .eq("completed", 0); // Filter for uncompleted tasks

    if (fetchError) {
      return res.status(fetchStatus).json({
        error: `There was an error fetching the uncompleted tasks for the user: ${fetchError.message}`,
      });
    }

    return res.status(fetchStatus).json({ data: tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to obtain all the user's tasks from a project
router.get("/all/:projectId/:username", async (req, res) => {
  try {
    const { projectId, username } = req.params;

    // Fetch all tasks for a specific project and user
    const {
      data: tasks,
      error: fetchError,
      status: fetchStatus,
    } = await supabase
      .from("task")
      .select()
      .eq("projectid", projectId)
      .eq("username", username);

    if (fetchError) {
      return res.status(fetchStatus).json({
        error: `There was an error fetching all the tasks for the user: ${fetchError.message}`,
      });
    }

    return res.status(fetchStatus).json({ data: tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
