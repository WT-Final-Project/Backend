const express = require("express");
const supabase = require("../supabase/supabaseClient"); // Import the client

const router = express.Router();

// Route to create a new participant
router.post("/", async (req, res) => {
  try {
    const { projectId, username, role } = req.body;

    // Insert a new participant into the 'participant' table
    const { error: insertError, status: insertStatus } = await supabase
      .from("participant")
      .insert({
        projectid: projectId,
        username: username,
        role: role || "participant", // Default to "participant" if not provided
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

// Ruta para obtener el rango de un participante dado el id del proyecto y el nombre de usuario
router.get("/obtener/:idProyecto/:nombreUsuario", async (req, res) => {
  try {
    const nombreUsuario = req.params.nombreUsuario;
    const idProyecto = req.params.idProyecto;
    const participan = await participanDAO.getRange(nombreUsuario, idProyecto);
    if (participan) {
      res.json(participan);
    } else {
      res.status(404).json({ error: "Participante no encontrado" });
    }
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

// Ruta para obtener los proyectos a los que pertenece un proyecto
router.get("/obtener/:nombreUsuario", async (req, res) => {
  try {
    const nombreUsuario = req.params.nombreUsuario;
    const participan = await participanDAO.getByNombre(nombreUsuario);
    if (participan) {
      res.json(participan);
    } else {
      res.status(404).json({ error: "Participante no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//ruta para obtener todos los proyectos en los que participa el usuario junto con su rol en ellos
router.get("/proyectosUsuario/:nombreUsuario", async (req, res) => {
  try {
    const nombreUsuario = req.params.nombreUsuario;
    const participan = await participanDAO.getProyectosUsuario(nombreUsuario);
    if (participan) {
      res.json(participan);
    } else {
      res.status(404).json({ error: "Participante no encontrado" });
    }
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
