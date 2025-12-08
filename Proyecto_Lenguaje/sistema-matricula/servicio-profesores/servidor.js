// servidor.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const puerto = process.env.PORT || 3004;

app.use(cors());
app.use(bodyParser.json());

require('./db');

const profesorControl = require('./controladores/profesorControl');

app.post('/api/profesores', profesorControl.crearProfesor);
app.get('/api/profesores', profesorControl.listarProfesores);
app.get('/api/profesores/:id', profesorControl.obtenerProfesor);
app.put('/api/profesores/:id', profesorControl.actualizarProfesor);
app.delete('/api/profesores/:id', profesorControl.eliminarProfesor);

app.listen(puerto, () => {
  console.log(`Servicio de Profesores funcionando en http://localhost:${puerto}`);
});
