-- 1. Agregar columnas para alumnos
ALTER TABLE usuarios ADD COLUMN dni VARCHAR(20) UNIQUE;
ALTER TABLE usuarios ADD COLUMN ciclo INT;
ALTER TABLE usuarios ADD COLUMN genero VARCHAR(20);

-- 1.1 Modificar tipo_usuario para aceptar 'alumno' (si era ENUM o muy corto)
ALTER TABLE usuarios MODIFY COLUMN tipo_usuario VARCHAR(50);

-- 2. Eliminar tabla apoderados (ya no se usa)
-- DROP TABLE IF EXISTS apoderados; -- Comentado por FK constraint en pagos

-- 3. Actualizar roles existentes (opcional, limpieza)
UPDATE usuarios SET tipo_usuario = 'alumno' WHERE tipo_usuario = 'estudiante';
-- DELETE FROM usuarios WHERE tipo_usuario = 'apoderado'; -- Comentado por FK constraint
