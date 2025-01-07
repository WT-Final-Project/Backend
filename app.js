const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes.js");
const projectRoutes = require("./routes/projectRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const participateRoutes = require("./routes/participateRoutes.js");
const fileRoutes = require("./routes/fileRoutes.js");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.use("/user", userRoutes);
app.use("/project", projectRoutes);
app.use("/task", taskRoutes);
app.use("/participate", participateRoutes);
app.use("/file", fileRoutes);

// General error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("¡Something went wrong!");
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
