// controladores/profesorControl.js
const pool = require('../db');

exports.crearProfesor = async (req, res) => {
  try {
    const { nombre_completo, dni, especialidad, correo, telefono } = req.body;
    const consulta = `INSERT INTO profesores (nombre_completo, dni, especialidad, correo, telefono)
                      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await pool.query(consulta, [nombre_completo, dni, especialidad, correo, telefono]);
    return res.json({ exito: true, mensaje: 'Profesor creado', datos: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al crear profesor', error: error.message });
  }
};

exports.listarProfesores = async (req, res) => {
  try {
    const consulta = 'SELECT * FROM profesores ORDER BY nombre_completo';
    const result = await pool.query(consulta);
    return res.json({ exito: true, datos: result.rows });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al listar profesores' });
  }
};

exports.obtenerProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const consulta = 'SELECT * FROM profesores WHERE id_profesor = $1';
    const result = await pool.query(consulta, [id]);
    if (result.rows.length === 0) return res.status(404).json({ exito: false, mensaje: 'Profesor no encontrado' });
    return res.json({ exito: true, datos: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error interno' });
  }
};

exports.actualizarProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, dni, especialidad, correo, telefono, estado } = req.body;
    const consulta = `UPDATE profesores SET nombre_completo=$1,dni=$2,especialidad=$3,correo=$4,telefono=$5,estado=$6
                      WHERE id_profesor=$7 RETURNING *`;
    const result = await pool.query(consulta, [nombre_completo, dni, especialidad, correo, telefono, estado || 'activo', id]);
    return res.json({ exito: true, mensaje: 'Profesor actualizado', datos: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al actualizar profesor' });
  }
};

exports.eliminarProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM profesores WHERE id_profesor = $1', [id]);
    return res.json({ exito: true, mensaje: 'Profesor eliminado' });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al eliminar profesor' });
  }
};
