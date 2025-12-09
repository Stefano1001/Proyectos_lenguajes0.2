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
    creditos INT DEFAULT 3,
    carrera_objetivo VARCHAR(100) DEFAULT 'Ingeniería de Sistemas',
    ciclo INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS secciones (
    id_seccion SERIAL PRIMARY KEY,
    id_curso INT REFERENCES cursos(id_curso) ON DELETE CASCADE,
    nombre_seccion VARCHAR(50) NOT NULL,
    id_profesor INT REFERENCES profesores(id_profesor) ON DELETE SET NULL,
    capacidad_maxima INT DEFAULT 30,
    alumnos_inscritos INT DEFAULT 0,
    turno VARCHAR(20),
    anio_escolar INT,
    horario_json TEXT DEFAULT '[{"dia": "LUN", "inicio": "08:00", "fin": "10:00"}]'
);

-- --- DATOS SEMILLA (SEED DATA) ---

-- 1. Profesores
INSERT INTO profesores (nombre_completo, dni, especialidad, correo) 
VALUES ('Ing. Roberto Carlos', '99887766', 'Sistemas', 'rcarlos@utp.edu.pe')
ON CONFLICT (dni) DO NOTHING;

INSERT INTO profesores (nombre_completo, dni, especialidad, correo) 
VALUES ('Dra. Maria Lopez', '55443322', 'Matemáticas', 'mlopez@utp.edu.pe')
ON CONFLICT (dni) DO NOTHING;

-- 2. Cursos (Ingeniería de Sistemas)
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Introducción a la Programación', 4, 'Ingeniería de Sistemas', 1),
('Matemática Discreta', 3, 'Ingeniería de Sistemas', 1),
('Base de Datos I', 4, 'Ingeniería de Sistemas', 3),
('Algoritmos y Estructuras de Datos', 4, 'Ingeniería de Sistemas', 3),
('Derecho Romano', 3, 'Derecho', 2); -- Curso de otra carrera

-- 3. Secciones (Vinculando cursos y profesores)
-- Nota: Usamos subconsultas para obtener IDs dinámicamente si es necesario, pero para seed data simple asumimos IDs secuenciales o limpiamos DB.
-- Para robustez en este script simple, insertamos directamente asumiendo DB vacía o IDs conocidos.

INSERT INTO secciones (id_curso, nombre_seccion, id_profesor, turno, anio_escolar, horario_json) VALUES
(1, 'A-101', 1, 'Mañana', 2024, '[{"dia": "LUN", "inicio": "08:00", "fin": "10:00"}, {"dia": "MIE", "inicio": "08:00", "fin": "10:00"}]'),
(1, 'A-102', 1, 'Noche', 2024, '[{"dia": "MAR", "inicio": "18:00", "fin": "20:00"}, {"dia": "JUE", "inicio": "18:00", "fin": "20:00"}]'),
(3, 'B-301', 1, 'Mañana', 2024, '[{"dia": "VIE", "inicio": "08:00", "fin": "12:00"}]');
