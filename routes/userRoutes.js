const express = require('express');
const routerUsuario = express.Router();
const usuarioDAO = require('../dao/usuarioDAO.js'); 
const { route } = require('./proyectoRoutes.js');

// Ruta para crear un nuevo usuario
routerUsuario.post('/crear', async (req, res) => {
    try {
        const { nombreUsuario, nombre, contrasenya, correo, apellidos } = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await usuarioDAO.createUsuario(nombreUsuario, nombre, apellidos, correo, contrasenya);
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener un usuario por su nombre
routerUsuario.get('/obtener/:nombre', async (req, res) => {
    try {
        const nombre = req.params.nombre;
        const usuario = await usuarioDAO.getUsuarioByNombreUsuario(nombre);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para verificar las credenciales de un usuario
routerUsuario.post('/verificar', async (req, res) => {
    try {
        const { nombreUsuario,contrasenya} = req.body;
        const isValid = await usuarioDAO.verificarCredenciales(nombreUsuario,contrasenya);
        if (isValid) {
            res.json({ valid: true });
        } else {
            res.status(401).json({ valid: false, error: 'Credenciales inválidas' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Ruta para borrar un usuario
routerUsuario.delete('/borrar/:nombreUsuario', async (req, res) => {
    try {
        const nombreUsuario = req.params.nombreUsuario;
        const usuario = await usuarioDAO.deleteUsuario(nombreUsuario);
        res.json({ message: 'Usuario eliminado correctamente', deletedUsuario: nombreUsuario});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Ruta para actualizar el nombre de un usuario
routerUsuario.post('/actualizar/:nombreUsuario', async (req, res) => {
    try {
        const nombreUsuario = req.params.nombreUsuario;
        const { nombre, contrasenya, correo, apellidos} = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await usuarioDAO.updateUsuario(nombreUsuario,nombre, contrasenya, correo, apellidos);
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = routerUsuario;