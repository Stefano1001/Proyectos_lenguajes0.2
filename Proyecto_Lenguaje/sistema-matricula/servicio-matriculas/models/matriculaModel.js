// models/matriculaModel.js
const mongoose = require('../db');
const { Schema } = require('mongoose');

const MatriculaSchema = new Schema({
  codigo_matricula: { type: String, required: true, unique: true },
  id_alumno: { type: String, required: true },
  nombre_alumno: String,
  dni_alumno: String,
  fecha_nacimiento: Date,
  id_apoderado: Number,
  id_curso: Number,
  id_seccion: Number,
  anio_escolar: Number,
  estado_matricula: { type: String, default: 'activa' },
  fecha_matricula: { type: Date, default: Date.now },
  observaciones: String
});

const AlumnoSchema = new Schema({
  codigo_alumno: { type: String, required: true, unique: true },
  nombre_completo: String,
  dni: String,
  fecha_nacimiento: Date,
  direccion: String,
  telefono_emergencia: String,
  id_apoderado: Number,
  estado: { type: String, default: 'activo' }
});

const Matricula = mongoose.model('Matricula', MatriculaSchema);
const Alumno = mongoose.model('Alumno', AlumnoSchema);

module.exports = { Matricula, Alumno };
