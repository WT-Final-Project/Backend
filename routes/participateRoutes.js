const express = require("express");
const supabase = require("../supabase/supabaseClient"); // Import the client

const router = express.Router();

// Route to create a new participant
router.post("/", async (req, res) => {
  try {
    const { projectId, username, role } = req.body;

    // Insert a new participant into the 'participate' table
    const { error: insertError, status: insertStatus } = await supabase
      .from("participate")
      .insert({
        projectid: projectId,
        username: username,
        userrole: role || "participant",
      });

    if (insertError) {
      return res.status(insertStatus).json({
        error: `There was an error creating the participant: ${insertError.message}`,
      });
    }

    res.sendStatus(insertStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to obtain a user's rank in a project
router.get("/rank/:projectId/:username", async (req, res) => {
  try {
    const { projectId, username } = req.params;

    // Query the 'participate' table to get the user's role in the project
    const {
      data: rankData,
      error: rankError,
      status: rankStatus,
    } = await supabase
      .from("participate")
      .select("userrole")
      .eq("projectid", projectId)
      .eq("username", username)
      .maybeSingle();

    if (rankError) {
      return res.status(rankStatus).json({
        error: `There was an error retrieving the user's rank: ${rankError.message}`,
      });
    }

    if (!rankData) {
      return res
        .status(rankStatus)
        .json({ error: "Participant not found in the project." });
    }

    res.status(rankStatus).json({ data: rankData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a participant from a project
router.delete("/:projectId/:username", async (req, res) => {
  try {
    const { projectId, username } = req.params;

    // Delete the participant from the 'participate' table
    const { error: deleteError, status: deleteStatus } = await supabase
      .from("participate")
      .delete()
      .eq("projectid", projectId)
      .eq("username", username);

    if (deleteError) {
      return res.status(deleteStatus).json({
        error: `There was an error deleting the participant: ${deleteError.message}`,
      });
    }

    res.sendStatus(deleteStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// This next route is the same as the upcoming route.

// // Ruta para obtener los proyectos a los que pertenece un proyecto
// router.get("/obtener/:nombreUsuario", async (req, res) => {
//   try {
//     const nombreUsuario = req.params.nombreUsuario;
//     const participan = await participanDAO.getByNombre(nombreUsuario);
//     if (participan) {
//       res.json(participan);
//     } else {
//       res.status(404).json({ error: "Participante no encontrado" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Route to obtain all the projects in which the user participate with his role
router.get("/user-projects/:username", async (req, res) => {
  try {
    const username = req.params.username;

    // Query the 'participate' table to get all projects and roles for the user
    const {
      data: participateData,
      error: participateError,
      status: participateStatus,
    } = await supabase
      .from("participate")
      .select("projectid, userrole")
      .eq("username", username);

    if (participateError) {
      return res.status(participateStatus).json({
        error: `There was an error retrieving the user's projects: ${participateError.message}`,
      });
    }

    res.status(participateStatus).json({ data: participateData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to obtain all the users in a project
router.get("/all/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Fetch all participants associated with the given project ID
    const {
      data: fetchData,
      error: fetchError,
      status: fetchStatus,
    } = await supabase
      .from("participate")
      .select("username, userrole")
      .eq("projectid", projectId);

    if (fetchError) {
      return res.status(fetchStatus).json({
        error: `There was an error retrieving participants: ${fetchError.message}`,
      });
    }

    res.status(fetchStatus).json({ data: fetchData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
