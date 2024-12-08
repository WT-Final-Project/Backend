const express = require('express');
const routerTarea = express.Router();
const tareaDAO = require('../dao/tareaDAO.js');

// Ruta para crear una nueva tarea
routerTarea.post('/crear', async (req, res) => {
    try {
        const { idProyecto, nombreUsuario,titulo,descripcion,
            fechaVencimiento} = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await tareaDAO.createTarea(idProyecto, nombreUsuario,titulo,descripcion,
            fechaVencimiento);
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener una tarea por el id
routerTarea.get('/obtener/:idTarea', async (req, res) => {
    try {
        const idTarea = req.params.idTarea;
        const tarea = await tareaDAO.getTarea(idTarea);
        if (tarea) {
            res.json(tarea);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Ruta para borrar una tarea
routerTarea.delete('/borrar/:idTarea', async (req, res) => {
    try {
        const idTarea = req.params.idTarea;
        const tarea = await tareaDAO.deleteTarea(idTarea);
        res.json({ message: 'Tarea eliminada correctamente', deletedTarea: idTarea});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//Ruta para actualizar una tarea
routerTarea.post('/actualizar/:idTarea', async (req, res) => {
    try {
        const idTarea = req.params.idTarea;
        const {idProyecto, nombreUsuario,titulo,descripcion,
            fechaVencimiento,completada } = req.body;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await tareaDAO.updateTarea(idTarea, idProyecto, nombreUsuario,titulo,descripcion,
            fechaVencimiento,completada);
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Ruta para completar una tarea
routerTarea.post('/completar/:idTarea', async (req, res) => {
    try {
        const idTarea = req.params.idTarea;
        // Llama a tu función DAO con los datos recibidos
        const resultado = await tareaDAO.completarTarea(idTarea);
        res.json({ resultado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Ruta para obtener todas las tareas que hay en un proyecto
routerTarea.get('/obtenerPorProyecto/:idProyecto', async (req, res) => {
    try {
        const idProyecto = req.params.idProyecto;
        const tarea = await tareaDAO.getByProyecto(idProyecto);
        if (tarea) {
            res.json(tarea);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Ruta para obtener todas las tareas que hay en un proyecto
routerTarea.get('/obtenerPorProyectoTodas/:idProyecto', async (req, res) => {
    try {
        const idProyecto = req.params.idProyecto;
        const tarea = await tareaDAO.getByProyectoTodas(idProyecto);
        if (tarea) {
            res.json(tarea);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Ruta para obtener dado un usuario y un proyecto, todas las tareas que tiene ese usuario en el proyecto
routerTarea.get('/obtenerPorProyectoYNombre/:idProyecto/:nombreUsuario', async (req, res) => {
    try {
        const idProyecto = req.params.idProyecto;
        const nombreUsuario = req.params.nombreUsuario;
        const tarea = await tareaDAO.getByProyectoYnombre(idProyecto,nombreUsuario);
        if (tarea) {
            res.json(tarea);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Ruta para obtener dado un usuario y un proyecto, todas las tareas que tiene ese usuario en el proyecto
routerTarea.get('/obtenerTareasNoCompletadasUsuario/:idProyecto/:nombreUsuario', async (req, res) => {
    try {
        const idProyecto = req.params.idProyecto;
        const nombreUsuario = req.params.nombreUsuario;
        const tarea = await tareaDAO.getTareaUsuarioNoCompletadas(idProyecto,nombreUsuario);
        console.log(tarea);
        if (tarea) {
            res.json(tarea);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = routerTarea;