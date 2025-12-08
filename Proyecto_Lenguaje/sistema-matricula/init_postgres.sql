-- Script para inicializar la base de datos PostgreSQL (sistema_academico)

CREATE TABLE IF NOT EXISTS profesores (
    id_profesor SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    especialidad VARCHAR(100),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS cursos (
    id_curso SERIAL PRIMARY KEY,
    nombre_curso VARCHAR(100) NOT NULL,
    nivel_grado VARCHAR(50),
    descripcion TEXT,
    creditos INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS secciones (
    id_seccion SERIAL PRIMARY KEY,
    id_curso INT REFERENCES cursos(id_curso) ON DELETE CASCADE,
    nombre_seccion VARCHAR(50) NOT NULL,
    id_profesor INT REFERENCES profesores(id_profesor) ON DELETE SET NULL,
    capacidad_maxima INT DEFAULT 30,
    alumnos_inscritos INT DEFAULT 0,
    turno VARCHAR(20),
    anio_escolar INT
);
