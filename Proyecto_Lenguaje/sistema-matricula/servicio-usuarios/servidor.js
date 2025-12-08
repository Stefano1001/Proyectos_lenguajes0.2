// servidor.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const puerto = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// inicializar DB
require('./db');

// controladores
const usuarioControl = require('./controladores/usuarioControl');

// Rutas usuarios
app.post('/api/login', usuarioControl.login);
app.get('/api/usuarios', usuarioControl.listarUsuarios);
app.post('/api/usuarios', usuarioControl.crearUsuario);
app.put('/api/usuarios/:id', usuarioControl.actualizarUsuario);
app.delete('/api/usuarios/:id', usuarioControl.eliminarUsuario);

// Registro público de alumnos
app.post('/api/registro', usuarioControl.registrarAlumno);

// Rutas apoderados
app.get('/api/apoderados', usuarioControl.listarApoderados);
app.post('/api/apoderados', usuarioControl.crearApoderado);
app.put('/api/apoderados/:id', usuarioControl.actualizarApoderado);
app.delete('/api/apoderados/:id', usuarioControl.eliminarApoderado);

app.listen(puerto, () => {
  console.log(`Servicio de Usuarios funcionando en http://localhost:${puerto}`);
});
