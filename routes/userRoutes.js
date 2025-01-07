const express = require("express");
const supabase = require("../supabase/supabaseClient"); // Import the client

const router = express.Router();

// Route to create a new user
router.post("/signup", async (req, res) => {
  try {
    const { username, name, password, email, lastName } = req.body;

    // Convert the username to lowercase
    const usernameLowerCase = username.toLowerCase();

    // Check if username exists
    const { data: existingUser, error: userError } = await supabase
      .from("app_user")
      .select("*")
      .eq("username", usernameLowerCase)
      .maybeSingle();

    if (userError) {
      return res.status(500).json({
        error: "Error checking username availability",
      });
    }

    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    if (!isValidEmail(email)) {
      return res.status(500).json({
        error: "Invalid email format",
      });
    }

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    // Check error supabase.auth.signUp()
    if (authError) {
      return res.status(500).json({
        error: `There was an error creatin the user: ${authError.message}`,
      });
    }

    // Insert into app_user table
    const { error: insertError, status: insertStatus } = await supabase
      .from("app_user")
      .insert([
        {
          id: authData.user.id,
          username: usernameLowerCase,
          firstname: name,
          lastname: lastName,
        },
      ]);

    if (insertError) {
      return res.status(insertStatus).json({
        error: `Error creating user in app_user table ${insertError.message}`,
      });
    }

    // Success response
    return res.sendStatus(insertStatus);
  } catch (err) {
    console.error("Error while creating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to sign in the user
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input data
    if (!email || !password) {
      return res.status(400).json({ error: "Empty fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(500).json({ error: "Invalid email format" });
    }

    // Attempt to sign in with Supabase Auth
    const { data: singinUser, error: singinError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

    // Handle sign-in errors
    if (singinError) {
      console.error("Sign-in error:", singinError);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Query Supabase to find the user by username
    const {
      data: user,
      error,
      status,
    } = await supabase
      .from("app_user")
      .select("*")
      .eq("id", singinUser.user.id)
      .single();

    // Handle errors if Supabase query fails
    if (error) {
      return res.status(status).json({ error: error.message });
    }

    if (!user) {
      return res.status(401).json({ error: "User not found on database" });
    }

    res.status(status).json({ data: { user: user, credentials: singinUser } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Route to obtain a certain user
router.get("/:username", async (req, res) => {
  try {
    // Validate the username parameter
    const username = req.params.username;

    // Convert the username to lowercase
    const usernameLowerCase = username.toLowerCase();

    if (
      !usernameLowerCase ||
      typeof usernameLowerCase !== "string" ||
      usernameLowerCase.length === 0
    ) {
      return res.status(400).json({ error: "Invalid username parameter" });
    }

    // Query Supabase to find the user by username
    const { data, error, status } = await supabase
      .from("app_user")
      .select("*")
      .eq("username", usernameLowerCase)
      .single();

    // Handle errors if Supabase query fails
    if (error) {
      console.error("Supabase error:", error);
      return res.status(status || 500).json({ error: error.message });
    }

    console.log("Data: ", data);

    // Check if user exists
    if (data) {
      return res.status(status).json(data);
    } else {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "¡Algo salió mal!" });
  }
});

//Route for deleting a user
router.delete("/:username", async (req, res) => {
  try {
    const username = req.params.username;

    // Convert the username to lowercase
    const usernameLowerCase = username.toLowerCase();

    // Get user
    const {
      data: user,
      error: userError,
      status: userStatus,
    } = await supabase
      .from("app_user")
      .select("id, username")
      .eq("username", usernameLowerCase)
      .single();

    if (userError) {
      return res.status(userStatus).json({ error: userError.message });
    }

    if (!user) {
      return res.status(userStatus).json({ error: "User not found" });
    }

    // Delete user from auth table
    // const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
    //   user.id
    // );

    // if (authDeleteError) {
    //   console.error("Supabase Auth error:", authDeleteError);
    //   return res
    //     .status(500)
    //     .json({ error: "Failed to delete user from Supabase Auth" });
    // }

    // Delete user from app_user
    const { error: dbDeleteError } = await supabase
      .from("app_user")
      .delete()
      .eq("id", user.id);

    if (dbDeleteError) {
      console.error("Database deletion error:", dbDeleteError);
      return res
        .status(500)
        .json({ error: "Failed to delete user from the database" });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update a user's details
router.put("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { name, lastName } = req.body;

    // Update the user's details in the database
    const { error: updateError, status: updateStatus } = await supabase
      .from("app_user")
      .update({
        firstname: name,
        lastname: lastName,
      })
      .eq("username", username);

    if (updateError) {
      return res.status(updateStatus).json({
        error: `There was an error updating the user: ${updateError.message}`,
      });
    }

    res.sendStatus(updateStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

module.exports = router;
