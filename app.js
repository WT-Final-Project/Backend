const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes.js");
const projectRoutes = require("./routes/projectRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const ParticipateRoute = require("./routes/participateRoutes.js");
/*
const routesFichero = require("./routes/ficheroRoutes.js");
const routesParticipan = require("./routes/participanRoutes.js");
const routesPeticion = require("./routes/peticionRoutes.js");
*/
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.use("/user", userRoutes);
app.use("/project", projectRoutes);
app.use("/task", taskRoutes);
app.use("/participate", ParticipateRoute);
/*
app.use("/usuario")
app.use("/tarea")
app.use("/proyecto")
app.use("/fichero", routesFichero);
app.use("/participan", routesParticipan);
app.use("/peticion", routesPeticion);
*/

// General error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("¡Something went wrong!");
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
