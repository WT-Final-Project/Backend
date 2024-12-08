const express = require('express');
const routerFichero = express.Router();
const ficheroDAO = require('../dao/ficheroDAO.js'); 

// Ruta para crear un nuevo fichero
routerFichero.post('/crear', async (req, res) => {
    try {
        const {nombre, idTarea } = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await ficheroDAO.createFichero(nombre, idTarea);
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener un usuario por su id
routerFichero.get('/obtener/:idFichero', async (req, res) => {
    try {
        const idFichero = req.params.idFichero;
        const fichero = await ficheroDAO.getFihceroById(idFichero);
        if (fichero) {
            res.json(fichero);
        } else {
            res.status(404).json({ error: 'Fichero no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//Metodo para borrar ficheros
routerFichero.delete('/borrar/:idFichero', async (req, res) => {
    try {
        const idFichero = req.params.idFichero;
        const fichero = await ficheroDAO.deleteFichero(idFichero);
        res.json({ message: 'Fichero eliminado correctamente', deletedFichero: fichero });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener un usuario por su id
routerFichero.post('/actualizar/:idFichero', async (req, res) => {
    try {
        const idFichero = req.params.idFichero;
        const {nombre, idTarea } = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await ficheroDAO.updateFichero(idFichero, nombre, idTarea);
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

routerFichero.get('/obtenerPorTarea/:idTarea', async (req, res) => {
    try {
        const idTarea = req.params.idTarea;
        const fichero = await ficheroDAO.getFihceroByTarea(idTarea);
        if (fichero) {
            res.json(fichero);
        } else {
            res.status(404).json({ error: 'Fichero no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = routerFichero;