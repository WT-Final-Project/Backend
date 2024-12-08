const express = require('express');
const routerPeticion = express.Router();
const peticionDAO = require('../dao/peticionDAO.js');

// Ruta para crear una nueva peticion
routerPeticion.post('/crear', async (req, res) => {
    try {
        const { idProyecto, nombreUsuario, descripcion, titulo } = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await peticionDAO.createPeticion( idProyecto, nombreUsuario, descripcion, titulo);
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener una peticion por su id
routerPeticion.get('/obtener/:idPeticion', async (req, res) => {
    try {
        const idPeticion = req.params.idPeticion;
        const peticion = await peticionDAO.getPeticionById(idPeticion);
        if (peticion) {
            res.json(peticion);
        } else {
            res.status(404).json({ error: 'Fichero no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Metodo para borrar ficheros
routerPeticion.delete('/borrar/:idPeticion', async (req, res) => {
    try {
        const idPeticion = req.params.idPeticion;
        const peticion = await peticionDAO.deletePeticion(idPeticion);
        res.json({ message: 'Peticion eliminado correctamente', deletedPeticion: peticion });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para actualizar una peticion
routerPeticion.post('/actualizar/:idPeticion', async (req, res) => {
    try {
        const idPeticion = req.params.idPeticion;
        const { idProyecto, nombreUsuario, descripcion, titulo  } = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await peticionDAO.updatePeticion(idPeticion, idProyecto, nombreUsuario, descripcion, titulo);
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = routerPeticion;