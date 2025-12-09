-- Limpiar datos previos de manera segura
TRUNCATE TABLE secciones, cursos RESTART IDENTITY CASCADE;

-- Insertar Cursos de Ingeniería de Sistemas (Malla Completa)
-- Ciclo 1
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Principios de Algoritmos', 2, 'Ingeniería de Sistemas', 1),
('Matemática', 4, 'Ingeniería de Sistemas', 1),
('Comprensión y Redacción de Textos I', 4, 'Ingeniería de Sistemas', 1),
('Introducción a la Vida Universitaria', 2, 'Ingeniería de Sistemas', 1);

-- Ciclo 2
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Estadística Descriptiva y Probabilidades', 3, 'Ingeniería de Sistemas', 2),
('Matemática Discreta', 2, 'Ingeniería de Sistemas', 2),
('Matemática II', 4, 'Ingeniería de Sistemas', 2),
('Introducción a las TIC', 3, 'Ingeniería de Sistemas', 2);

-- Ciclo 3
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Taller de Programación', 4, 'Ingeniería de Sistemas', 3),
('Cálculo I', 4, 'Ingeniería de Sistemas', 3),
('Estadística Inferencial', 4, 'Ingeniería de Sistemas', 3),
('Mecánica Clásica', 5, 'Ingeniería de Sistemas', 3);

-- Ciclo 4
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Programación Orientada a Objetos', 4, 'Ingeniería de Sistemas', 4),
('Base de Datos', 4, 'Ingeniería de Sistemas', 4),
('Análisis y Diseño de Algoritmos', 4, 'Ingeniería de Sistemas', 4),
('Cálculo II', 2, 'Ingeniería de Sistemas', 4);

-- Ciclo 5
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Base de Datos II', 4, 'Ingeniería de Sistemas', 5),
('Sistemas Operativos', 4, 'Ingeniería de Sistemas', 5),
('Redes y Comunicación de Datos I', 4, 'Ingeniería de Sistemas', 5),
('Taller de Programación Web', 3, 'Ingeniería de Sistemas', 5);

-- Ciclo 6
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Análisis y Diseño de Sistemas de Inf.', 4, 'Ingeniería de Sistemas', 6),
('Curso Integrador I: Sistemas Software', 4, 'Ingeniería de Sistemas', 6),
('Java Script Avanzado', 4, 'Ingeniería de Sistemas', 6),
('Marcos de Desarrollo Web', 4, 'Ingeniería de Sistemas', 6);

-- Ciclo 7
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Seguridad Informática', 4, 'Ingeniería de Sistemas', 7),
('Desarrollo Web Integrado', 3, 'Ingeniería de Sistemas', 7),
('Teoría de Sistemas', 3, 'Ingeniería de Sistemas', 7),
('Lenguajes de Programación', 2, 'Ingeniería de Sistemas', 7);

-- Ciclo 8
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Inteligencia de Negocios', 4, 'Ingeniería de Sistemas', 8),
('Gestión del Servicio TI', 4, 'Ingeniería de Sistemas', 8),
('Innovación y Transformación Digital', 4, 'Ingeniería de Sistemas', 8),
('Diseño de Arquitectura Empresarial', 4, 'Ingeniería de Sistemas', 8);

-- Ciclo 9
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Curso Integrador II: Sistemas', 3, 'Ingeniería de Sistemas', 9),
('Sistemas de Información Empresarial', 3, 'Ingeniería de Sistemas', 9),
('Planeamiento Estratégico de TICs', 4, 'Ingeniería de Sistemas', 9),
('Formación para la Investigación', 4, 'Ingeniería de Sistemas', 9);

-- Ciclo 10
INSERT INTO cursos (nombre_curso, creditos, carrera_objetivo, ciclo) VALUES 
('Servicios Cloud', 4, 'Ingeniería de Sistemas', 10),
('Taller de Investigación Sistemas', 4, 'Ingeniería de Sistemas', 10),
('Ingeniería Económica', 3, 'Ingeniería de Sistemas', 10);

-- CREACIÓN DE SECCIONES PARA PRUEBAS (Ciclo 2 y 3 principalmente para el usuario alumno1)
-- Secciones con horarios que permiten armar un horario y otras que generan cruce.

-- Ciclo 3 (El usuario Juan está en ciclo 3)
-- Taller de Programación (4 horas, 2 veces/semana)
-- Opción A: Lunes y Miércoles de 08:00 a 10:00
INSERT INTO secciones (id_curso, nombre_seccion, turno, anio_escolar, horario_json) VALUES 
((SELECT id_curso FROM cursos WHERE nombre_curso = 'Taller de Programación'), 'SEC-301', 'Mañana', 2024, '[{"dia": "LUN", "inicio": "08:00", "fin": "10:00"}, {"dia": "MIE", "inicio": "08:00", "fin": "10:00"}]');

-- Cálculo I (4 horas, 2 veces/semana)
-- Opción A: Martes y Jueves de 08:00 a 10:00 (Compatible con Taller)
INSERT INTO secciones (id_curso, nombre_seccion, turno, anio_escolar, horario_json) VALUES 
((SELECT id_curso FROM cursos WHERE nombre_curso = 'Cálculo I'), 'SEC-302', 'Mañana', 2024, '[{"dia": "MAR", "inicio": "08:00", "fin": "10:00"}, {"dia": "JUE", "inicio": "08:00", "fin": "10:00"}]');

-- Opción B (CRUCE con Taller): Lunes y Miércoles de 09:00 a 11:00 (Solapa 1 hora)
INSERT INTO secciones (id_curso, nombre_seccion, turno, anio_escolar, horario_json) VALUES 
((SELECT id_curso FROM cursos WHERE nombre_curso = 'Cálculo I'), 'SEC-303 (Conflicto)', 'Mañana', 2024, '[{"dia": "LUN", "inicio": "09:00", "fin": "11:00"}, {"dia": "MIE", "inicio": "09:00", "fin": "11:00"}]');

-- Estadística Inferencial
-- Viernes de 08:00 a 12:00
INSERT INTO secciones (id_curso, nombre_seccion, turno, anio_escolar, horario_json) VALUES 
((SELECT id_curso FROM cursos WHERE nombre_curso = 'Estadística Inferencial'), 'SEC-304', 'Mañana', 2024, '[{"dia": "VIE", "inicio": "08:00", "fin": "12:00"}]');

