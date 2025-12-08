// servidor.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const puerto = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

// conectar Mongo
require('./db');

// controladores
const matriculaControl = require('./controladores/matriculaControl');

// RUTAS MATRÍCULAS
app.post('/api/matriculas', matriculaControl.crearMatricula);
app.get('/api/matriculas', matriculaControl.listarMatriculas);
app.get('/api/matriculas/:id', matriculaControl.obtenerMatricula);
app.put('/api/matriculas/:id', matriculaControl.actualizarMatricula);
app.delete('/api/matriculas/:id', matriculaControl.eliminarMatricula);

// RUTAS ALUMNOS
app.post('/api/alumnos', matriculaControl.crearAlumno);
app.get('/api/alumnos', matriculaControl.listarAlumnos);
app.get('/api/alumnos/:id', matriculaControl.obtenerAlumno);
app.put('/api/alumnos/:id', matriculaControl.actualizarAlumno);
app.delete('/api/alumnos/:id', matriculaControl.eliminarAlumno);

app.listen(puerto, () => {
  console.log(`Servicio de Matrículas funcionando en http://localhost:${puerto}`);
});
