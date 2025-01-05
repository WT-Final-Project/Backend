const express = require("express");
const multer = require("multer");
const supabase = require("../supabase/supabaseClient");

const router = express.Router();

// Set up multer storage configuration (for temporary file storage in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload a file (use `upload.single` for a single file)
router.post("/", upload.single("fileContent"), async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ error: "File content or file name is missing!" });
    }

    // Extract file buffer from the uploaded file
    const fileBuffer = req.file.buffer;

    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // Fetch task details to verify it exists and retrieve the associated project
    const {
      data: taskData,
      error: taskError,
      status: taskStatus,
    } = await supabase
      .from("task")
      .select("projectid")
      .eq("taskid", taskId)
      .single();

    if (taskError) {
      return res.status(taskStatus).json({
        error: `There was an error finding the task: ${taskError.message}`,
      });
    }

    const projectId = taskData.projectid;

    // Construct the file path
    const filePath = `projects/${projectId}/tasks/${taskId}/${fileName}`;

    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("project-files") // Replace with your bucket name
      .upload(filePath, fileBuffer, {
        contentType: mimeType, // MIME type from the frontend
      });

    if (uploadError) {
      return res.status(500).json({
        error: `There was an error uploading the file: ${uploadError.message}`,
      });
    }

    // Store the file metadata in the database
    const { error: fileError, status: fileStatus } = await supabase
      .from("project_file")
      .insert([{ filepath: filePath, taskid: taskId, name: fileName }])
      .select()
      .single();

    if (fileError) {
      return res.status(fileStatus).json({
        error: `There was an error saving the file metadata: ${fileError.message}`,
      });
    }

    res.sendStatus(fileStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Route to delete files
router.delete("/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // Fetch the file metadata
    const {
      data: fetchData,
      error: fetchError,
      status: fetchStatus,
    } = await supabase
      .from("project_file")
      .select("filepath")
      .eq("fileid", fileId)
      .single();

    if (fetchError) {
      return res.status(fetchStatus).json({
        error: `There was an error fetching the file ${fetchError.message}`,
      });
    }

    const filePath = fetchData.filepath;

    // Delete the file from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("project-files")
      .remove([filePath]);

    if (storageError) {
      throw new Error(
        `Failed to delete file from storage: ${storageError.message}`
      );
    }

    // Remove the file record from the database
    const { error: deleteError, status: deleteStatus } = await supabase
      .from("project_file")
      .delete()
      .eq("fileid", fileId);

    if (deleteError) {
      throw new Error(
        `There was an error deleting the  file record from database: ${deleteError.message}`
      );
    }

    res.sendStatus(deleteStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Route to obtain all the files from a task
router.get("/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Query the database for all files associated with the task
    const {
      data: fetchData,
      error: fetchError,
      status: fetchStatus,
    } = await supabase
      .from("project_file")
      .select("fileid, filepath, name")
      .eq("taskid", taskId);

    if (fetchError) {
      return res.status(fetchStatus).json({
        error: `There was an error fetching files for task: ${fetchError.message}`,
      });
    }

    if (!fetchData || fetchData.length === 0) {
      return res.status(fetchStatus).json({
        error: "No files found for the specified task",
      });
    }

    // Extract file paths for signed URL generation
    const filePaths = fetchData.map((file) => file.filepath);

    // Generate signed URLs for all files
    const { data: urlData, error: urlError } = await supabase.storage
      .from("project-files")
      .createSignedUrls(filePaths, 60 * 60); // 1 hour

    if (urlError) {
      return res.status(500).json({
        error: `There was an error generating signed URLs: ${urlError.message}`,
      });
    }

    // Return file with
    const files = fetchData.map((file) => {
      const signedUrlEntry = urlData.find(
        (entry) => entry.path === file.filepath
      );

      return {
        name: file.name,
        signedUrl: signedUrlEntry?.signedUrl || null, // If URL does not exist --> null
      };
    });

    res.status(200).json({ data: files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
