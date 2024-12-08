// Archivo: dao/participanDAO.js

const pool = require('../db/db.js');
const Proyecto =require('./proyectoDAO.js') 
const Usuario = require('./usuarioDAO.js')
// Value Object (VO) para Participan
class Participan {
  constructor(idproyecto, nombreusuario, rango) {
    this.idproyecto = idproyecto;
    this.nombreusuario = nombreusuario;
    this.rango = rango;
  }
}


// Método para obtener todos los participantes
const getParticipan = async () => {
    const res = await pool.query('SELECT * FROM participan');
    return res.rows.map(participan => new Participan(
        participan.idproyecto,
        participan.nombreusuario,
        participan.rango
    ));
};


// Método para obtener el rango de un usuario en un proyecto
const getRange = async (nombreusuario, idproyecto) => {
    const res = await pool.query('SELECT * FROM participan WHERE nombreUsuario = $1  AND idProyecto = $2', [nombreusuario,idproyecto]);
    const participan = res.rows[0];
    if (participan) {
      return new Participan(
        participan.idproyecto,
        participan.nombreusuario,
        participan.rango
      );
    }
    return null;
};

// Método para crear un participante
const createParticipante = async (idproyecto, nombreusuario, rango) => {
    const res = await pool.query(
      'INSERT INTO participan (idProyecto, nombreUsuario, rango) VALUES ($1, $2, $3) RETURNING *',
      [idproyecto, nombreusuario, rango]
    );
    const participan = res.rows[0];
    return new Participan(
        participan.idproyecto,
        participan.nombreusuario,
        participan.rango
    );
};

  
// Método para eliminar un participante
const deleteParticipante = async (idProyecto, nombreUsuario) => {
    await pool.query('DELETE FROM participan WHERE idProyecto = $1 AND nombreUsuario = $2', [idProyecto,nombreUsuario]);
};

//Metodo para obtener los proyectos a los que participa un usuario
const getByNombre = async (nombreUsuario) => {
  const res = await pool.query('SELECT * FROM participan WHERE nombreUsuario = $1', [nombreUsuario]);
  return res.rows.map(participan => new Participan(
    participan.idproyecto,
    participan.nombreusuario,
    participan.rango
));
};

//Metodo para obtener los proyectos en los que participa un usuario
const getProyectosUsuario = async (nombreUsuario) => {
  const participaciones = await getByNombre(nombreUsuario);

  const proyectos = await Promise.all(
    participaciones.map(async (participan) => {
      const proyecto = await Proyecto.getProyecto(participan.idproyecto);
      const participa = await getRange(nombreUsuario, proyecto.idproyecto);

      return {
        idproyecto: proyecto.idproyecto,
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion,
        rango: participa.rango, // Agrega el campo rango de participa
      };
    })
  );

  return proyectos;
};

//Ruta para obtener los participantes de un proyecto
const getByProyecto = async (idProyecto) => {
  const res = await pool.query('SELECT * FROM participan WHERE idProyecto = $1', [idProyecto]);
  return res.rows.map(participan => new Participan(
    participan.idproyecto,
    participan.nombreusuario,
    participan.rango
));
};

//Ruta para obtener los participantes de un proyecto junto con su rango
const getUsuariosProyecto = async (idProyecto) => {
  const participaciones = await getByProyecto(idProyecto);

  const usuariosProyecto = await Promise.all(
    participaciones.map(async (participan) => {
      const usuario = await Usuario.getUsuarioByNombreUsuario(participan.nombreusuario);
      const participa = await getRange(usuario.nombreusuario, idProyecto);
      return {
        nombreusuario: usuario.nombreusuario,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        contrasenya: usuario.contrasenya,
        rango: participa.rango, // Agrega el campo rango de participan
      };
    })
  );

  return usuariosProyecto;
};



module.exports = {
    getParticipan,
    getRange,
    createParticipante,
    deleteParticipante,
    getByNombre,
    getProyectosUsuario,
    getUsuariosProyecto
};
