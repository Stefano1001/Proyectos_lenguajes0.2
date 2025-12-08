-- update_cursos_db.sql

-- 1. Modificar tabla cursos para usar 'ciclo' en lugar de 'nivel_grado'
ALTER TABLE cursos DROP COLUMN IF EXISTS nivel_grado;
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS ciclo INT CHECK (ciclo >= 1 AND ciclo <= 10);

-- 2. Limpiar cursos existentes para insertar los nuevos predefinidos
TRUNCATE TABLE secciones CASCADE;
TRUNCATE TABLE cursos CASCADE;

-- 3. Insertar cursos predefinidos (Ciclos 1-10)
INSERT INTO cursos (nombre_curso, ciclo, descripcion, creditos) VALUES
-- Ciclo 1
('Introducción a la Ingeniería de Sistemas', 1, 'Fundamentos de la carrera', 3),
('Matemática Básica', 1, 'Fundamentos matemáticos', 4),
-- Ciclo 2
('Algoritmos y Estructura de Datos', 2, 'Lógica de programación avanzada', 4),
('Física I', 2, 'Mecánica clásica', 3),
-- Ciclo 3
('Base de Datos I', 3, 'Modelado y SQL', 4),
('Estadística y Probabilidades', 3, 'Análisis de datos', 3),
-- Ciclo 4
('Lenguajes de Programación', 4, 'Paradigmas de programación', 4),
('Sistemas Operativos', 4, 'Gestión de recursos', 3),
-- Ciclo 5
('Desarrollo Web Integrado', 5, 'Frontend y Backend', 4),
('Análisis y Diseño de Sistemas', 5, 'Metodologías de desarrollo', 4),
-- Ciclo 6
('Teoría de Sistemas', 6, 'Enfoque sistémico', 3),
('Redes de Computadoras', 6, 'Comunicaciones y protocolos', 4),
-- Ciclo 7
('Gestión de Proyectos', 7, 'PMBOK y metodologías ágiles', 3),
('Inteligencia de Negocios', 7, 'Data Warehousing y ETL', 4),
-- Ciclo 8
('Liderazgo y Gestión de Equipos', 8, 'Habilidades blandas', 3),
('Arquitectura de Software', 8, 'Patrones y diseño', 4),
-- Ciclo 9
('Tesis I', 9, 'Proyecto de investigación', 5),
('Seguridad Informática', 9, 'Ciberseguridad', 3),
-- Ciclo 10
('Tesis II', 10, 'Sustentación de proyecto', 5),
('Ética Profesional', 10, 'Deontología', 2);
