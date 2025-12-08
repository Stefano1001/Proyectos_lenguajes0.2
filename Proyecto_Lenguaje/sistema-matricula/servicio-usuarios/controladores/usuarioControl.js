// controladores/usuarioControl.js
const conexionBD = require('../db');
const axios = require('axios');

// LOGIN
exports.login = (req, res) => {
  const { correo, clave } = req.body;
  if (!correo || !clave) {
    return res.status(400).json({ exito: false, mensaje: 'Faltan datos' });
  }
  const consulta = 'SELECT * FROM usuarios WHERE correo = ? AND clave = ?';
  conexionBD.query(consulta, [correo, clave], (error, resultados) => {
    if (error) {
      return res.status(500).json({ exito: false, mensaje: 'Error en el servidor' });
    }
    if (resultados.length > 0) {
      const u = resultados[0];
      // Validar rol (solo admin y alumno)
      if (u.tipo_usuario !== 'admin' && u.tipo_usuario !== 'alumno') {
        return res.status(403).json({ exito: false, mensaje: 'Acceso no autorizado para este rol' });
      }
      return res.json({
        exito: true,
        mensaje: 'Login exitoso',
        datos: {
          id: u.id_usuario,
          nombre: u.nombre_completo,
          correo: u.correo,
          rol: u.tipo_usuario,
          dni: u.dni,
          ciclo: u.ciclo
        }
      });
    }
    return res.status(401).json({ exito: false, mensaje: 'Correo o contraseña incorrectos' });
  });
};

// LISTAR USUARIOS
exports.listarUsuarios = (req, res) => {
  const consulta = 'SELECT * FROM usuarios';
  conexionBD.query(consulta, (error, resultados) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al listar usuarios' });
    return res.json({ exito: true, datos: resultados });
  });
};

// REGISTRAR ALUMNO
exports.registrarAlumno = (req, res) => {
  const { nombre_completo, dni, ciclo, genero, correo, clave } = req.body;

  if (!nombre_completo || !dni || !correo || !clave) {
    return res.status(400).json({ exito: false, mensaje: 'Faltan campos obligatorios' });
  }

  const consulta = 'INSERT INTO usuarios (nombre_completo, dni, ciclo, genero, correo, clave, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)';
  conexionBD.query(consulta, [nombre_completo, dni, ciclo || 1, genero, correo, clave, 'alumno'], async (error, resultado) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ exito: false, mensaje: 'El correo o DNI ya está registrado' });
      }
      console.error('MySQL Error:', error);
      return res.status(500).json({ exito: false, mensaje: 'Error al registrar alumno en BD Usuarios', error: error.message });
    }

    // Sincronizar con MongoDB (servicio-matriculas) para generar código ALU-XXX
    try {
      await axios.post('http://localhost:3002/api/alumnos', {
        nombre_completo,
        dni,
        correo,
        ciclo,
        genero,
        id_usuario_mysql: resultado.insertId
      });

      return res.json({ exito: true, mensaje: 'Alumno registrado y sincronizado correctamente', id: resultado.insertId });
    } catch (mongoErr) {
      console.error('Error al sincronizar con MongoDB:', mongoErr.message);
      return res.json({ exito: true, mensaje: 'Alumno registrado en MySQL, pero hubo error en sincronización con MongoDB', id: resultado.insertId, warning: true });
    }
  });
};

// CREAR USUARIO (Admin)
exports.crearUsuario = (req, res) => {
  const { nombre_completo, correo, clave, tipo_usuario, dni, ciclo } = req.body;
  const consulta = 'INSERT INTO usuarios (nombre_completo, correo, clave, tipo_usuario, dni, ciclo) VALUES (?, ?, ?, ?, ?, ?)';
  conexionBD.query(consulta, [nombre_completo, correo, clave, tipo_usuario, dni, ciclo], (error, resultado) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al crear usuario' });
    return res.json({ exito: true, mensaje: 'Usuario creado', id: resultado.insertId });
  });
};

// ACTUALIZAR USUARIO
exports.actualizarUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre_completo, correo, tipo_usuario } = req.body;
  const consulta = 'UPDATE usuarios SET nombre_completo = ?, correo = ?, tipo_usuario = ? WHERE id_usuario = ?';
  conexionBD.query(consulta, [nombre_completo, correo, tipo_usuario, id], (error) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al actualizar usuario' });
    return res.json({ exito: true, mensaje: 'Usuario actualizado correctamente' });
  });
};

// ELIMINAR USUARIO
exports.eliminarUsuario = (req, res) => {
  const { id } = req.params;
  const consulta = 'DELETE FROM usuarios WHERE id_usuario = ?';
  conexionBD.query(consulta, [id], (error) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al eliminar usuario' });
    return res.json({ exito: true, mensaje: 'Usuario eliminado correctamente' });
  });
};

// APODERADOS
exports.listarApoderados = (req, res) => {
  const consulta = `
    SELECT a.*, u.nombre_completo as nombre_usuario, u.correo
    FROM apoderados a
    LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
  `;
  conexionBD.query(consulta, (error, resultados) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al obtener apoderados' });
    return res.json({ exito: true, datos: resultados });
  });
};

exports.crearApoderado = (req, res) => {
  const { id_usuario, dni, telefono, direccion } = req.body;
  const consulta = 'INSERT INTO apoderados (id_usuario, dni, telefono, direccion) VALUES (?, ?, ?, ?)';
  conexionBD.query(consulta, [id_usuario, dni, telefono, direccion], (error, resultado) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al crear apoderado' });
    return res.json({ exito: true, mensaje: 'Apoderado registrado correctamente', id: resultado.insertId });
  });
};

exports.actualizarApoderado = (req, res) => {
  const { id } = req.params;
  const { dni, telefono, direccion } = req.body;
  const consulta = 'UPDATE apoderados SET dni = ?, telefono = ?, direccion = ? WHERE id_apoderado = ?';
  conexionBD.query(consulta, [dni, telefono, direccion, id], (error) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al actualizar apoderado' });
    return res.json({ exito: true, mensaje: 'Apoderado actualizado correctamente' });
  });
};

exports.eliminarApoderado = (req, res) => {
  const { id } = req.params;
  const consulta = 'DELETE FROM apoderados WHERE id_apoderado = ?';
  conexionBD.query(consulta, [id], (error) => {
    if (error) return res.status(500).json({ exito: false, mensaje: 'Error al eliminar apoderado' });
    return res.json({ exito: true, mensaje: 'Apoderado eliminado correctamente' });
  });
};
