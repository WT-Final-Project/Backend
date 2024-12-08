// Archivo: dao/proyectoDAO.js

const pool = require('../db/db.js');

// Value Object (VO) para Proyecto
class Proyecto {
  constructor(idproyecto, nombre, descripcion) {
    this.idproyecto = idproyecto;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}


// Método para obtener todos los proyectos
const getProyectos = async () => {
    const res = await pool.query('SELECT * FROM proyecto');
    return res.rows.map(proyecto => new Proyecto(
        proyecto.idproyecto,
        proyecto.nombre,
        proyecto.descripcion
    ));
};


// Método para obtener el proyecto por el id
const getProyecto = async (idProyecto) => {
    const res = await pool.query('SELECT * FROM proyecto WHERE idProyecto = $1', [idProyecto]);
    const proyecto = res.rows[0];
    if (proyecto) {
      return new Proyecto(
        proyecto.idproyecto,
        proyecto.nombre,
        proyecto.descripcion
      );
    }
    return null;
};


// Método para crear un proyecto
const createProyecto = async (nombre, descripcion) => {
    const res = await pool.query(
      'INSERT INTO proyecto (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    const proyecto = res.rows[0];
    return new Proyecto(
        proyecto.idproyecto,
        proyecto.nombre,
        proyecto.descripcion
    );
};

  
// Método para eliminar un proyecto
const deleteProyecto = async (idProyecto) => {
    await pool.query('DELETE FROM proyecto WHERE idProyecto = $1', [idProyecto]);
};


// Método para actualizar un proyecto
const updateProyecto = async (idProyecto, nombre, descripcion) => {
    const res = await pool.query(
      'UPDATE proyecto SET nombre = $2, descripcion = $3 WHERE idProyecto = $1 RETURNING *',
      [idProyecto, nombre, descripcion]
    );
    const proyecto = res.rows[0];
    return new Proyecto(
        proyecto.idproyecto,
        proyecto.nombre,
        proyecto.descripcion
    );
};


module.exports = {
    getProyectos,
    getProyecto,
    createProyecto,
    deleteProyecto,
    updateProyecto,
    Proyecto
};
