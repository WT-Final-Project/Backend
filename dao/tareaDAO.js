// Archivo: dao/tareaDAO.js

const pool = require('../db/db.js');

// Value Object (VO) para Tarea
class Tarea {
    constructor(idtarea, idproyecto, nombreusuario,titulo,descripcion,
        fechavencimineto,completada) {
      this.idtarea = idtarea;
      this.idproyecto = idproyecto;
      this.nombreusuario = nombreusuario;
      this.titulo = titulo;
      this.descripcion = descripcion;
      this.fechavencimineto = fechavencimineto;
      this.completada = completada;
    }
}

// Método para obtener todas las tareas
const getTareas = async () => {
    const res = await pool.query('SELECT * FROM tarea');
    return res.rows.map(tarea => new Tarea(
        tarea.idtarea,
        tarea.idproyecto,
        tarea.nombreusuario,
        tarea.titulo,
        tarea.descripcion,
        tarea.fechavencimineto,
        tarea.completada
    ));
};


// Método para obtener la tarea por el id
const getTarea = async (idTarea) => {
    const res = await pool.query('SELECT * FROM tarea WHERE idTarea = $1', [idTarea]);
    const tarea = res.rows[0];
    if (tarea) {
      return new Tarea(
        tarea.idtarea,
        tarea.idproyecto,
        tarea.nombreusuario,
        tarea.titulo,
        tarea.descripcion,
        tarea.fechavencimineto,
        tarea.completada
      );
    }
    return null;
};

// Método para crear una tarea
const createTarea = async (idProyecto, nombreUsuario, titulo, descripcion,
    fechaVencimineto) => {
    const res = await pool.query(
      'INSERT INTO tarea (idProyecto, nombreUsuario, titulo, descripcion, fechaVencimineto, completada) VALUES ($1, $2, $3, $4, $5, 0) RETURNING *',
      [idProyecto, nombreUsuario, titulo, descripcion,
        fechaVencimineto]
    );
    const tarea = res.rows[0];
    return new Tarea(
        tarea.idtarea,
        tarea.idproyecto,
        tarea.nombreusuario,
        tarea.titulo,
        tarea.descripcion,
        tarea.fechavencimineto,
        tarea.completada
      );
};

// Método para eliminar una tarea
const deleteTarea = async (idTarea) => {
    await pool.query('DELETE FROM tarea WHERE idTarea = $1', [idTarea]);
};

// Método para actualizar un proyecto
const updateTarea = async (idTarea, idProyecto, nombreUsuario,titulo,descripcion,
    fechaVencimineto,completada) => {
    const res = await pool.query(
      'UPDATE tarea SET idProyecto = $2, nombreUsuario = $3, titulo = $4, descripcion = $5, fechaVencimineto = $6, completada = $7 WHERE idTarea = $1 RETURNING *',
      [idTarea, idProyecto, nombreUsuario,titulo,descripcion,
        fechaVencimineto,completada]
    );
    const tarea = res.rows[0];
    return new Tarea(
        tarea.idtarea,
        tarea.idproyecto,
        tarea.nombreusuario,
        tarea.titulo,
        tarea.descripcion,
        tarea.fechavencimineto,
        tarea.completada
    );
};

//Metodo para obtener las tareas de un proyecto
const getByProyectoTodas = async (idProyecto) => {
  const res = await pool.query('SELECT * FROM tarea WHERE idProyecto = $1', [idProyecto]);
  return res.rows.map(tarea => new Tarea(
        tarea.idtarea,
        tarea.idproyecto,
        tarea.nombreusuario,
        tarea.titulo,
        tarea.descripcion,
        tarea.fechavencimineto,
        tarea.completada
));
};
//Metodo para obtener las tareas de un proyecto
const getByProyecto = async (idProyecto) => {
  const res = await pool.query('SELECT * FROM tarea WHERE idProyecto = $1 AND completada=0', [idProyecto]);
  return res.rows.map(tarea => new Tarea(
        tarea.idtarea,
        tarea.idproyecto,
        tarea.nombreusuario,
        tarea.titulo,
        tarea.descripcion,
        tarea.fechavencimineto,
        tarea.completada
));
};

//Ruta para obtener las tareas de un usuario especifico
const getByProyectoYnombre = async (idProyecto,nombreUsuario) => {
  const res = await pool.query('SELECT * FROM tarea WHERE idProyecto = $1 AND nombreUsuario = $2', [idProyecto,nombreUsuario]);
  return res.rows.map(tarea => new Tarea(
        tarea.idtarea,
        tarea.idproyecto,
        tarea.nombreusuario,
        tarea.titulo,
        tarea.descripcion,
        tarea.fechavencimineto,
        tarea.completada
));
};


//Ruta para obtener las tareas de un usuario especifico
const getTareaUsuarioNoCompletadas = async (idProyecto,nombreUsuario) => {
  const res = await pool.query('SELECT * FROM tarea WHERE idProyecto = $1 AND nombreUsuario = $2 AND completada=0', [idProyecto,nombreUsuario]);
  return res.rows.map(tarea => new Tarea(
        tarea.idtarea,
        tarea.idproyecto,
        tarea.nombreusuario,
        tarea.titulo,
        tarea.descripcion,
        tarea.fechavencimineto,
        tarea.completada
));
};

//Actualiza el estado de una tarea a completada 
const completarTarea = async (idTarea) => {
  const res = await pool.query(
    'UPDATE tarea SET completada =  1 WHERE idTarea = $1 RETURNING *',
    [idTarea]
  );
  const tarea = res.rows[0];
  return new Tarea(
      tarea.idtarea,
      tarea.idproyecto,
      tarea.nombreusuario,
      tarea.titulo,
      tarea.descripcion,
      tarea.fechavencimineto,
      tarea.completada
  );
};

module.exports = {
    getTareas,
    getTarea,
    createTarea,
    deleteTarea,
    updateTarea,
    getByProyecto,
    getByProyectoYnombre,
    completarTarea,
    getTareaUsuarioNoCompletadas,
    getByProyectoTodas
}