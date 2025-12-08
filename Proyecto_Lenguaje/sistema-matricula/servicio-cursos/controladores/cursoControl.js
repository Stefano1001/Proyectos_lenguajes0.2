// controladores/cursoControl.js
const pool = require('../db');

// Crear curso
exports.crearCurso = async (req, res) => {
  try {
    const { nombre_curso, ciclo, descripcion, creditos } = req.body;
    // Validar ciclo
    if (ciclo < 1 || ciclo > 10) {
      return res.status(400).json({ exito: false, mensaje: 'El ciclo debe estar entre 1 y 10' });
    }
    const consulta = `INSERT INTO cursos (nombre_curso, ciclo, descripcion, creditos)
                      VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(consulta, [nombre_curso, ciclo, descripcion, creditos || 0]);
    return res.json({ exito: true, mensaje: 'Curso creado correctamente', datos: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al crear curso', error: error.message });
  }
};

// Listar cursos
exports.listarCursos = async (req, res) => {
  try {
    const consultas = 'SELECT * FROM cursos ORDER BY ciclo, nombre_curso';
    const result = await pool.query(consultas);
    return res.json({ exito: true, datos: result.rows });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al listar cursos' });
  }
};

// Obtener curso
exports.obtenerCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const consulta = 'SELECT * FROM cursos WHERE id_curso = $1';
    const result = await pool.query(consulta, [id]);
    if (result.rows.length === 0) return res.status(404).json({ exito: false, mensaje: 'Curso no encontrado' });
    return res.json({ exito: true, datos: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error interno' });
  }
};

// Actualizar curso
exports.actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_curso, ciclo, descripcion, creditos } = req.body;
    const consulta = `UPDATE cursos SET nombre_curso = $1, ciclo = $2, descripcion = $3, creditos = $4
                      WHERE id_curso = $5 RETURNING *`;
    const result = await pool.query(consulta, [nombre_curso, ciclo, descripcion, creditos || 0, id]);
    return res.json({ exito: true, mensaje: 'Curso actualizado', datos: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al actualizar curso' });
  }
};

// Eliminar curso
exports.eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM cursos WHERE id_curso = $1', [id]);
    return res.json({ exito: true, mensaje: 'Curso eliminado' });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al eliminar curso' });
  }
};

// Secciones: crear, listar, actualizar (ejemplo)
exports.crearSeccion = async (req, res) => {
  try {
    const { id_curso, nombre_seccion, id_profesor, capacidad_maxima, turno, anio_escolar } = req.body;
    const consulta = `INSERT INTO secciones (id_curso, nombre_seccion, id_profesor, capacidad_maxima, alumnos_inscritos, turno, anio_escolar)
                      VALUES ($1, $2, $3, $4, 0, $5, $6) RETURNING *`;
    const result = await pool.query(consulta, [id_curso, nombre_seccion, id_profesor, capacidad_maxima || 30, turno, anio_escolar || new Date().getFullYear()]);
    return res.json({ exito: true, mensaje: 'Sección creada', datos: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al crear sección', error: error.message });
  }
};

exports.listarSecciones = async (req, res) => {
  try {
    const consulta = `SELECT s.*, c.nombre_curso, p.nombre_completo as profesor_nombre
                      FROM secciones s
                      LEFT JOIN cursos c ON s.id_curso = c.id_curso
                      LEFT JOIN profesores p ON s.id_profesor = p.id_profesor
                      ORDER BY s.id_seccion`;
    const result = await pool.query(consulta);
    return res.json({ exito: true, datos: result.rows });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al listar secciones' });
  }
};

// Inscribir (incrementa alumnos_inscritos si hay cupo)
exports.inscribirEnSeccion = async (req, res) => {
  try {
    const { id } = req.params; // id seccion
    // Obtener la sección
    const secRes = await pool.query('SELECT capacidad_maxima, alumnos_inscritos FROM secciones WHERE id_seccion = $1', [id]);
    if (secRes.rows.length === 0) return res.status(404).json({ exito: false, mensaje: 'Sección no encontrada' });
    const sec = secRes.rows[0];
    if (sec.alumnos_inscritos >= sec.capacidad_maxima) {
      return res.status(400).json({ exito: false, mensaje: 'No hay cupos disponibles' });
    }
    const nuevo = await pool.query('UPDATE secciones SET alumnos_inscritos = alumnos_inscritos + 1 WHERE id_seccion = $1 RETURNING *', [id]);
    return res.json({ exito: true, mensaje: 'Inscripción realizada', datos: nuevo.rows[0] });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al inscribir' });
  }
};
