// Archivo: dao/ficheroDAO.js

const pool = require('../db/db.js');

// Value Object (VO) para Peticion
class Peticion {
    constructor(idpeticion, idproyecto, nombreusuario, descripcion, titulo) {
      this.idpeticion = idpeticion;
      this.idproyecto = idproyecto;
      this.nombreusuario = nombreusuario;
      this.descripcion = descripcion;
      this.titulo = titulo; 
    }
}

// Método para obtener todos las peticiones
const getPeticiones = async () => {
    const res = await pool.query('SELECT * FROM peticion');
    return res.rows.map(peticion => new Peticion(
      peticion.idpeticion,
      peticion.idproyecto,
      peticion.nombreusuario,
      peticion.descripcion,
      peticion.titulo
    ));
};

// Método para obtener una peticion por idPeticion
const getPeticionById = async (idPeticion) => {
    const res = await pool.query('SELECT * FROM peticion WHERE idPeticion = $1', [idPeticion]);
    const peticion = res.rows[0];
    if (peticion) {
      return new Peticion(
        peticion.idpeticion,
        peticion.idproyecto,
        peticion.nombreusuario,
        peticion.descripcion,
        peticion.titulo
      );
    }
    return null;
};

// Método para crear un fichero
const createPeticion = async ( idProyecto, nombreUsuario, descripcion, titulo) => {
    const res = await pool.query(
      'INSERT INTO peticion ( idProyecto, nombreUsuario, descripcion, titulo) VALUES ($1, $2, $3, $4) RETURNING *',
      [idProyecto, nombreUsuario, descripcion, titulo]
    );
    const peticion = res.rows[0];
    return new Peticion(
        peticion.idpeticion,
        peticion.idproyecto,
        peticion.nombreusuario,
        peticion.descripcion,
        peticion.titulo
    );
};

// Método para actualizar una peticion
const updatePeticion = async (idPeticion, idProyecto, nombreUsuario, descripcion, titulo) => {
    const res = await pool.query(
      'UPDATE fichero SET idProyecto = $2, nombreUsuario = $3, descripcion = $4, titulo = $5 WHERE idPeticion = $1 RETURNING *',
      [idPeticion, idProyecto, nombreUsuario, descripcion, titulo]
    );
    const peticion = res.rows[0];
    return new Peticion(
        peticion.idpeticion,
        peticion.idproyecto,
        peticion.nombreusuario,
        peticion.descripcion,
        peticion.titulo
    );
};

// Método para eliminar una peticion
const deletePeticion = async (idPeticion) => {
    await pool.query('DELETE FROM peticion WHERE idPeticion = $1', [idPeticion]);
};

module.exports = {
    getPeticiones,
    getPeticionById,
    createPeticion,
    updatePeticion,
    deletePeticion
};