// Archivo: dao/ficheroDAO.js

const pool = require('../db/db.js');

// Value Object (VO) para Usuario
class Usuario {
  constructor(nombreusuario, nombre, apellidos, correo, contrasenya) {
    this.nombreusuario = nombreusuario;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.correo = correo;
    this.contrasenya = contrasenya; 
  }
}

// Método para obtener todos los usuarios
const getUsuarios = async () => {
  const res = await pool.query('SELECT * FROM usuario');
  return res.rows.map(usuario => new Usuario(
    usuario.nombreusuario,
    usuario.nombre,
    usuario.apellidos,
    usuario.correo,
    usuario.contrasenya
  ));
};

// Método para obtener un usuario por nombreUsuario
const getUsuarioByNombreUsuario = async (nombreUsuario) => {
  const res = await pool.query('SELECT * FROM usuario WHERE nombreUsuario = $1', [nombreUsuario]);
  const usuario = res.rows[0];
  if (usuario) {
    return new Usuario(
      usuario.nombreusuario,
      usuario.nombre,
      usuario.apellidos,
      usuario.correo,
      usuario.contrasenya
    );
  }
  return null;
};

// Método para crear un usuario
const createUsuario = async (nombreUsuario, nombre, apellidos, correo, contrasenya) => {
  const res = await pool.query(
    'INSERT INTO usuario (nombreUsuario, nombre, contrasenya, correo, apellidos) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nombreUsuario, nombre, contrasenya, correo, apellidos]
  );
  const usuario = res.rows[0];
  return new Usuario(
    usuario.nombreusuario,
    usuario.nombre,
    usuario.apellidos,
    usuario.correo,
    usuario.contrasenya
  );
};

// Método para actualizar un usuario
const updateUsuario = async (nombreUsuario, nombre, apellidos, correo, contrasenya) => {
  const res = await pool.query(
    'UPDATE usuario SET nombre = $2, contrasenya = $3, correo = $4, apellidos = $5 WHERE nombreUsuario = $1 RETURNING *',
    [nombreUsuario, nombre, contrasenya, correo, apellidos]
  );
  const usuario = res.rows[0];
  return new Usuario(
    usuario.nombreusuario,
    usuario.nombre,
    usuario.apellidos,
    usuario.correo,
    usuario.contrasenya
  );
};

// Método para eliminar un usuario
const deleteUsuario = async (nombreUsuario) => {
  await pool.query('DELETE FROM usuario WHERE nombreUsuario = $1', [nombreUsuario]);
};

const verificarCredenciales = async (nombreUsuario,contrasenya) => {
    const query = 'SELECT * FROM usuario WHERE nombreUsuario = $1 AND contrasenya = $2';
    const values = [nombreUsuario, contrasenya];
    try {
        const res = await pool.query(query, values);
        return res.rowCount == 1; // Devuelve true si hay una fila que cumple las condiciones
    } catch (err) {
        console.error('Error al verificar las credenciales del usuario:', err);
        throw err;
    }
}

module.exports = {
getUsuarios,
getUsuarioByNombreUsuario,
createUsuario,
updateUsuario,
deleteUsuario,
verificarCredenciales
};