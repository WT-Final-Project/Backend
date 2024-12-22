const express = require("express");

const supabase = require("../supabase/supabaseClient"); // Import the client

const router = express.Router();

// Route to create a project
router.post("/create", async (req, res) => {
  try {
    const { username, name, description } = req.body;

    // Insert new project into the 'project' table
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

    return res.sendStatus(participateStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get project by id
router.get("/obtain/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Fetch project from the 'project' table by projectid
    const {
      data: projectData,
      error: projectError,
      status: projectStatus,
    } = await supabase
      .from("project")
      .select("*")
      .eq("projectid", projectId)
      .maybeSingle();

    if (projectError) {
      return res.status(projectStatus).json({
        error: `Error trying to fetch project: ${projectError.message}`,
      });
    }

    console.log(projectData);

    res.status(projectStatus).json({ data: projectData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a project by its Id
router.delete("/delete/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Delete the project from the 'project' table
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
router.post("/update/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { name, description } = req.body;

    // Update the project in the 'project' table
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
