const express = require('express');
const routerParticipan = express.Router();
const participanDAO = require('../dao/participanDAO.js'); 

// Ruta para crear un nuevo participante
routerParticipan.post('/crear', async (req, res) => {
    try {
        const { idProyecto, nombreUsuario, rango } = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await participanDAO.createParticipante(idProyecto, nombreUsuario, "participante");
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener el rango de un participante dado el id del proyecto y el nombre de usuario
routerParticipan.get('/obtener/:idProyecto/:nombreUsuario', async (req, res) => {
    try {
        const nombreUsuario = req.params.nombreUsuario;
        const idProyecto = req.params.idProyecto;
        const participan = await participanDAO.getRange(nombreUsuario, idProyecto);
        if (participan) {
            res.json(participan);
        } else {
            res.status(404).json({ error: 'Participante no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para borrar a un particpante de un proyecto en especifico
routerParticipan.delete('/borrar/:idProyecto/:nombreUsuario', async (req, res) => {
    try {
        const nombreUsuario = req.params.nombreUsuario;
        const idProyecto = req.params.idProyecto;
        const participan = await participanDAO.deleteParticipante(idProyecto, nombreUsuario);
        res.json({ message: 'Participante eliminado correctamente', deletedParticipante: idProyecto + nombreUsuario });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener los proyectos a los que pertenece un proyecto
routerParticipan.get('/obtener/:nombreUsuario', async (req, res) => {
    try {
        const nombreUsuario = req.params.nombreUsuario;
        const participan = await participanDAO.getByNombre(nombreUsuario);
        if (participan) {
            res.json(participan);
        } else {
            res.status(404).json({ error: 'Participante no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//ruta para obtener todos los proyectos en los que participa el usuario junto con su rol en ellos
routerParticipan.get('/proyectosUsuario/:nombreUsuario', async (req, res) => {
    try {
        const nombreUsuario = req.params.nombreUsuario;
        const participan = await participanDAO.getProyectosUsuario(nombreUsuario);
        if (participan) {
            res.json(participan);
        } else {
            res.status(404).json({ error: 'Participante no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//Ruta para obtener los usuarios de un proyecto, junto con su rol
routerParticipan.get('/usuariosProyecto/:idProyecto', async (req, res) => {
    try {
        const idProyecto = req.params.idProyecto;
        const participan = await participanDAO.getUsuariosProyecto(idProyecto);
        if (participan) {
            res.json(participan);
        } else {
            res.status(404).json({ error: 'Participante no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = routerParticipan;