// Archivo: dao/ficheroDAO.js

const pool = require('../db/db.js');

// Value Object (VO) para Fichero
class Fichero {
    constructor(idfichero, nombre, idtarea) {
      this.idfichero = idfichero;
      this.nombre = nombre;
      this.idtarea = idtarea; 
    }
}

// Método para obtener todos los ficheros
const getFicheros = async () => {
    const res = await pool.query('SELECT * FROM fichero');
    return res.rows.map(fichero => new Fichero(
     fichero.idfichero,
     fichero.nombre,
     fichero.idtarea
    ));
};

// Método para obtener un fichero por su id
const getFihceroById = async (idFichero) => {
    const res = await pool.query('SELECT * FROM fichero WHERE idFichero = $1', [idFichero]);
    const fichero = res.rows[0];
    if (fichero) {
      return new Fichero(
        fichero.idfichero,
        fichero.nombre,
        fichero.idtarea
      );
    }
    return null;
};

// Método para crear un fichero
const createFichero = async ( nombre, idTarea) => {
    const res = await pool.query(
      'INSERT INTO fichero (nombre, idTarea) VALUES ($1, $2) RETURNING *',
      [nombre, idTarea]
    );
    const fichero = res.rows[0];
    return new Fichero(
      fichero.idfichero,
      fichero.nombre,
      fichero.idtarea
    );
};

// Método para actualizar un fichero
const updateFichero = async (idFichero, nombre, idTarea) => {
    const res = await pool.query(
      'UPDATE fichero SET  nombre = $2, idTarea = $3 WHERE idFichero = $1 RETURNING *',
      [idFichero, nombre, idTarea]
    );
    const fichero = res.rows[0];
    return new Fichero(
      fichero.idfichero,
      fichero.nombre,
      fichero.idtarea
    );
};

// Método para eliminar un fichero
const deleteFichero = async (idFichero) => {
    await pool.query('DELETE FROM fichero WHERE idFichero = $1', [idFichero]);
};

// Método para obtener un fichero por su tarea
const getFihceroByTarea = async (idTarea) => {
  const res = await pool.query('SELECT * FROM fichero WHERE idTarea= $1', [idTarea]);
  const fichero = res.rows[0];
  if (fichero) {
    return new Fichero(
      fichero.idfichero,
      fichero.nombre,
      fichero.idtarea
    );
  }
  return null;
};
module.exports = {
    getFicheros,
    getFihceroById,
    createFichero,
    updateFichero,
    deleteFichero,
    getFihceroByTarea
};