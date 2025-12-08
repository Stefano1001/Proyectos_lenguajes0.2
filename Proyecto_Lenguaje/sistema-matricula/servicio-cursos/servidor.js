// servidor.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const puerto = process.env.PORT || 3003;

app.use(cors());
app.use(bodyParser.json());

require('./db');

const cursoControl = require('./controladores/cursoControl');

// RUTAS CURSOS
app.post('/api/cursos', cursoControl.crearCurso);
app.get('/api/cursos', cursoControl.listarCursos);
app.get('/api/cursos/:id', cursoControl.obtenerCurso);
app.put('/api/cursos/:id', cursoControl.actualizarCurso);
app.delete('/api/cursos/:id', cursoControl.eliminarCurso);

// RUTAS SECCIONES
app.post('/api/secciones', cursoControl.crearSeccion);
app.get('/api/secciones', cursoControl.listarSecciones);
app.post('/api/secciones/:id/inscribir', cursoControl.inscribirEnSeccion);

app.listen(puerto, () => {
  console.log(`Servicio de Cursos funcionando en http://localhost:${puerto}`);
});
