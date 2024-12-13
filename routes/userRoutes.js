const express = require("express");
const supabase = require("../supabase/supabaseClient"); // Import the client

const router = express.Router();

// Route to create a new user
router.post("/singup", async (req, res) => {
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
    const { data: user, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    // Check error supabase.auth.signUp()
    if (authError) {
      return res.status(500).json({ error: authError.message });
    }

    // Insert into app_user table
    const { error: insertError, status } = await supabase
      .from("app_user")
      .insert([
        {
          id: user.user.id,
          username: usernameLowerCase,
          firstname: name,
          lastname: lastName,
          email: email,
        },
      ]);

    if (insertError) {
      return res
        .status(status)
        .json({ error: "Error creating user in app_user table", insertError });
    }

    // Success response
    return res.sendStatus(status);
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
      .maybeSingle();

    // Handle errors if Supabase query fails
    if (error) {
      console.error("Supabase error:", error);
      return res.status(status || 500).json({ error: error.message });
    }

    if (!user) {
      console.error("User not found on table:", singinError);
      return res.status(401).json({ error: "User not found on database" });
    }

    res.status(200).json({ data: user.username });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "¡Something went wrong!" });
  }
});

// Route to obtain a certain user
router.get("/obtain/:username", async (req, res) => {
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
      .maybeSingle();

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
router.delete("/delete/:username", async (req, res) => {
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
      .maybeSingle();

    if (userError) {
      return res.status(userStatus).json({ error: userError.message });
    }

    if (!user) {
      return res.status(userStatus).json({ error: "User not found" });
    }

    // Delete user from auth table
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
      user.id
    );

    if (authDeleteError) {
      console.error("Supabase Auth error:", authDeleteError);
      return res
        .status(500)
        .json({ error: "Failed to delete user from Supabase Auth" });
    }

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

//Ruta para actualizar el nombre de un usuario
router.post("/actualizar/:nombreUsuario", async (req, res) => {
  try {
    const nombreUsuario = req.params.nombreUsuario;
    const { nombre, contrasenya, correo, apellidos } = req.body;
    // Llama a tu función DAO con los datos recibidos
    const resultado = await usuarioDAO.updateUsuario(
      nombreUsuario,
      nombre,
      contrasenya,
      correo,
      apellidos
    );
    res.json({ resultado });
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
