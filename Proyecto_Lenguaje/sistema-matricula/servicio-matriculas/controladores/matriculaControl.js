// controladores/matriculaControl.js
const { Matricula, Alumno } = require('../models/matriculaModel');
const Counter = require('../models/counterModel');
const axios = require('axios');

async function getNextSequence(name) {
  const ret = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return ret.seq;
}

// Crear matrícula
exports.crearMatricula = async (req, res) => {
  try {
    const datos = req.body;
    if (!datos.id_alumno) {
      return res.status(400).json({ exito: false, mensaje: 'Falta id_alumno' });
    }

    // Generar código automático MAT-XXXX
    const seq = await getNextSequence('matriculaId');
    datos.codigo_matricula = `MAT-${seq.toString().padStart(4, '0')}`;

    const existe = await Matricula.findOne({ codigo_matricula: datos.codigo_matricula });
    if (existe) return res.status(400).json({ exito: false, mensaje: 'Error de concurrencia en código' });

    const mat = new Matricula(datos);
    await mat.save();

    // Integrar con servicio-cursos
    if (datos.id_seccion) {
      try {
        await axios.post(`http://localhost:3003/api/secciones/${datos.id_seccion}/inscribir`);
      } catch (err) {
        await Matricula.findByIdAndDelete(mat._id);
        return res.status(500).json({ exito: false, mensaje: 'Error al inscribir en sección', error: err.message });
      }
    }

    return res.json({ exito: true, mensaje: 'Matrícula creada', datos: mat });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al crear matrícula', error: error.message });
  }
};

// ... (Listar, Obtener, Actualizar, Eliminar Matrícula - Sin cambios mayores) ...
// Listar matrículas (filtros opcionales)
exports.listarMatriculas = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.id_alumno) filtros.id_alumno = req.query.id_alumno;
    if (req.query.anio_escolar) filtros.anio_escolar = Number(req.query.anio_escolar);
    const resultados = await Matricula.find(filtros).sort({ fecha_matricula: -1 }).lean();
    return res.json({ exito: true, datos: resultados });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al listar matrículas' });
  }
};

// Obtener matrícula por ID
exports.obtenerMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    const mat = await Matricula.findById(id);
    if (!mat) return res.status(404).json({ exito: false, mensaje: 'Matrícula no encontrada' });
    return res.json({ exito: true, datos: mat });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error interno' });
  }
};

// Actualizar matrícula
exports.actualizarMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;
    const mat = await Matricula.findByIdAndUpdate(id, cambios, { new: true });
    return res.json({ exito: true, mensaje: 'Matrícula actualizada', datos: mat });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al actualizar matrícula' });
  }
};

// Eliminar matrícula
exports.eliminarMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    await Matricula.findByIdAndDelete(id);
    return res.json({ exito: true, mensaje: 'Matrícula eliminada' });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al eliminar matrícula' });
  }
};

// ALUMNOS
exports.crearAlumno = async (req, res) => {
  try {
    const datos = req.body;

    // Generar código automático ALU-XXXX
    const seq = await getNextSequence('alumnoId');
    datos.codigo_alumno = `ALU-${seq.toString().padStart(4, '0')}`;

    const alumno = new Alumno(datos);
    await alumno.save();
    return res.json({ exito: true, mensaje: 'Alumno creado', datos: alumno });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al crear alumno', error: error.message });
  }
};

exports.listarAlumnos = async (req, res) => {
  try {
    const resultados = await Alumno.find({}).sort({ nombre_completo: 1 }).lean();
    return res.json({ exito: true, datos: resultados });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al listar alumnos' });
  }
};

exports.obtenerAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const alumno = await Alumno.findById(id);
    if (!alumno) return res.status(404).json({ exito: false, mensaje: 'Alumno no encontrado' });
    return res.json({ exito: true, datos: alumno });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error interno' });
  }
};

exports.actualizarAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const a = await Alumno.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ exito: true, mensaje: 'Alumno actualizado', datos: a });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al actualizar alumno' });
  }
};

exports.eliminarAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    await Alumno.findByIdAndDelete(id);
    return res.json({ exito: true, mensaje: 'Alumno eliminado' });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al eliminar alumno' });
  }
};
