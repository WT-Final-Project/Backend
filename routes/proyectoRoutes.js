const express = require('express');
const routerProyecto = express.Router();
const proyectoDAO = require('../dao/proyectoDAO.js'); 
const participanDAO = require('../dao/participanDAO.js'); 
// Ruta para crear un nuevo proyecto
routerProyecto.post('/crear', async (req, res) => {
    try {
        //const { nombre, descripcion } = req.body;
        const { nombreUsuario, nombre, descripcion } = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await proyectoDAO.createProyecto(nombre, descripcion);
        const creacion = await participanDAO.createParticipante(resultado.idproyecto, nombreUsuario, "lider")
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener el proyecto por el id
routerProyecto.get('/obtener/:idProyecto', async (req, res) => {
    try {
        const idProyecto = req.params.idProyecto;
        const proyecto = await proyectoDAO.getProyecto(idProyecto);
        if (proyecto) {
            res.json(proyecto);
        } else {
            res.status(404).json({ error: 'Proyecto no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Ruta para borrar un proyecto
routerProyecto.delete('/borrar/:idProyecto', async (req, res) => {
    try {
        const idProyecto = req.params.idProyecto;
        const proyecto = await proyectoDAO.deleteProyecto(idProyecto);
        res.json({ message: 'Proyecto eliminado correctamente', deletedProyecto: idProyecto});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//ruta para actualizar un proyecto
routerProyecto.post('/actualizar/:idProyecto', async (req, res) => {
    try {
        const idProyecto = req.params.idProyecto;
        const {nombre, descripcion } = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await proyectoDAO.updateProyecto(idProyecto, nombre, descripcion);
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = routerProyecto;
