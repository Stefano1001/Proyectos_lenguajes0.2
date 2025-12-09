const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Inicializar bases de datos (Compartidas)
const connectMongo = require('./src/config/db_mongo');
connectMongo();
require('./src/config/db_mysql');
// require('./src/config/db_postgres'); // Eliminado por limpieza

// Configuración de CORS Global (Permite peticiones desde 3000 y 5500)
const corsOptions = {
    origin: '*', // En producción ser más específico, para dev está bien
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// --- SERVIDOR 1: FRONTEND (Puerto 3000) ---
const appFrontend = express();
appFrontend.use(express.static(path.join(__dirname, 'public')));
appFrontend.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
appFrontend.listen(3000, () => {
    console.log('🌍 Frontend (Web)   corriendo en -> http://localhost:3000');
});

// --- SERVIDOR 2: AUTH & USUARIOS (Puerto 3001) ---
const appAuth = express();
appAuth.use(cors(corsOptions));
appAuth.use(express.json());
appAuth.use('/api/auth', require('./src/services/srv_auth'));
appAuth.listen(3001, () => {
    console.log('🔒 Servicio Auth    corriendo en -> http://localhost:3001');
});

// --- SERVIDOR 3: ACADÉMICO/CURSOS (Puerto 3002) ---
const appCursos = express();
appCursos.use(cors(corsOptions));
appCursos.use(express.json());
appCursos.use('/api/cursos', require('./src/services/srv_cursos'));
appCursos.listen(3002, () => {
    console.log('📚 Servicio Cursos  corriendo en -> http://localhost:3002');
});

// --- SERVIDOR 4: MATRÍCULA & REPORTES (Puerto 3003) ---
const appMatricula = express();
appMatricula.use(cors(corsOptions));
appMatricula.use(express.json());
appMatricula.use('/api/matricula', require('./src/services/srv_matricula'));
appMatricula.use('/api/reportes', require('./src/services/srv_reportes'));
appMatricula.listen(3003, () => {
    console.log('📝 Servicio Matrícula corriendo en -> http://localhost:3003');
});

// --- SERVIDOR 5: PAGOS (Puerto 3004) ---
const appPagos = express();
appPagos.use(cors(corsOptions));
appPagos.use(express.json());
appPagos.use('/api/pagos', require('./src/services/srv_pagos'));
appPagos.listen(3004, () => {
    console.log('💸 Servicio Pagos   corriendo en -> http://localhost:3004');
});

console.log('🚀 SISTEMA DE MICROSERVICIOS INICIADO (Modo Simulado)');
