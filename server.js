const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routesUsuario = require('./routes/userRoutes.js');
const routesFichero = require('./routes/ficheroRoutes.js');
const routesParticipan = require('./routes/participanRoutes.js');
const routesPeticion = require('./routes/peticionRoutes.js');
const routesProyecto = require('./routes/proyectoRoutes.js');
const routesTarea = require('./routes/tareaRoutes.js');



const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Ruta para la página de inicio
app.get('/', (req, res) => {
    // No hace nada, simplemente responde con un mensaje vacío
    res.send('Bienvenido a la página de inicio');
  });

app.use('/usuario', routesUsuario);
app.use('/fichero',routesFichero);
app.use('/participan',routesParticipan);
app.use('/peticion',routesPeticion);
app.use('/proyecto',routesProyecto);
app.use('/tarea',routesTarea);


// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

const PORT = 3001;

app.listen(PORT,() =>{
    console.log('Servidor corriendo en http://localhost:'+PORT);
})
