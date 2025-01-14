const express = require("express");

const supabase = require("../supabase/supabaseClient"); // Import the client

const router = express.Router();

// Route to create a project
router.post("/", async (req, res) => {
  try {
    const { username, name, description } = req.body;

    // Insert new project
    const {
      data: projectData,
      error: projectError,
      status: projectStatus,
    } = await supabase
      .from("project")
      .insert({ projectname: name, description: description })
      .select("projectid")
      .single();

    // Check if there is an error
    if (projectError) {
      return res
        .status(projectStatus)
        .json({ error: `Error creating project ${projectError.message}` });
    }

    // Insert leader into the 'participate' table
    const { error: participateError, status: participateStatus } =
      await supabase.from("participate").insert({
        projectid: projectData.projectid,
        username: username,
        userrole: "leader",
      });

    if (participateError) {
      return res.status(participateStatus).json({
        error: `Error adding leader to participate table: ${participateError.message}`,
      });
    }

    return res.status(participateStatus).json({ data: projectData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get project by id
router.get("/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Fetch project by projectid
    const {
      data: projectData,
      error: projectError,
      status: projectStatus,
    } = await supabase
      .from("project")
      .select("*")
      .eq("projectid", projectId)
      .single();

    if (projectError) {
      return res.status(projectStatus).json({
        error: `Error trying to fetch project: ${projectError.message}`,
      });
    }

    res.status(projectStatus).json({ data: projectData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a project by its Id
router.delete("/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Delete the project
    const { error: deleteError, status: deleteStatus } = await supabase
      .from("project")
      .delete()
      .eq("projectid", projectId);

    if (deleteError) {
      return res.status(deleteStatus).json({
        error: `There was an error deleting the project: ${deleteError.message}`,
      });
    }

    return res.sendStatus(deleteStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update the project
router.put("/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { name, description } = req.body;

    // Update the project
    const { error: updateError, status: updateStatus } = await supabase
      .from("project")
      .update({
        projectname: name,
        description: description,
      })
      .eq("projectid", projectId);

    if (updateError) {
      return res.status(updateStatus).json({
        error: `There was an error updating the project: ${updateError.message}`,
      });
    }

    return res.sendStatus(updateStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
