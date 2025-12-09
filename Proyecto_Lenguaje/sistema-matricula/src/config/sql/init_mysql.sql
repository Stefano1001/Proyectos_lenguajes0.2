-- Script de inicialización para MySQL (Usuarios)
-- Se ejecuta automáticamente al iniciar setup_databases.js

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL, -- 'admin', 'alumno', 'profesor', 'apoderado'
    dni VARCHAR(20) UNIQUE,
    ciclo INT DEFAULT 1,
    genero VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    carrera VARCHAR(100) DEFAULT 'Ingeniería de Sistemas',
    promedio_ponderado DECIMAL(4,2) DEFAULT 0.00,
    turno_matricula DATETIME NULL,
    estado_pago_matricula BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS relacion_apoderados (
    id_relacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_apoderado INT NOT NULL,
    id_usuario_alumno INT NOT NULL,
    FOREIGN KEY (id_usuario_apoderado) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_alumno) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- --- DATOS SEMILLA (SEED DATA) ---

-- 1. Admin
INSERT IGNORE INTO usuarios (nombre_completo, correo, clave, tipo_usuario, promedio_ponderado, estado_pago_matricula) 
VALUES ('Administrador Principal', 'admin@sistema.com', 'admin123', 'admin', 0, TRUE);

-- 2. Alumno Habilitado
INSERT IGNORE INTO usuarios (nombre_completo, correo, clave, tipo_usuario, dni, ciclo, carrera, promedio_ponderado, turno_matricula, estado_pago_matricula) 
VALUES ('Juan Pérez (Alumno Top)', 'alumno1@utp.edu.pe', 'alumno123', 'alumno', '12345678', 3, 'Ingeniería de Sistemas', 19.5, NOW() - INTERVAL 1 DAY, TRUE);

-- 3. Alumno Deudor
INSERT IGNORE INTO usuarios (nombre_completo, correo, clave, tipo_usuario, dni, ciclo, carrera, promedio_ponderado, turno_matricula, estado_pago_matricula) 
VALUES ('Carlos Deudor', 'alumno2@utp.edu.pe', 'alumno123', 'alumno', '87654321', 2, 'Derecho', 14.0, NOW() + INTERVAL 2 DAY, FALSE);

-- 4. Apoderado
INSERT IGNORE INTO usuarios (nombre_completo, correo, clave, tipo_usuario) 
VALUES ('Padre de Familia', 'padre@gmail.com', 'padre123', 'apoderado');

-- 5. Vincular Apoderado con Alumno 2 (Deudor)
-- Nota: Usamos subconsultas para obtener IDs dinámicos y evitar errores si los IDs cambian
INSERT INTO relacion_apoderados (id_usuario_apoderado, id_usuario_alumno)
SELECT 
    (SELECT id_usuario FROM usuarios WHERE correo = 'padre@gmail.com'),
    (SELECT id_usuario FROM usuarios WHERE correo = 'alumno2@utp.edu.pe')
WHERE NOT EXISTS (
    SELECT 1 FROM relacion_apoderados 
    WHERE id_usuario_apoderado = (SELECT id_usuario FROM usuarios WHERE correo = 'padre@gmail.com')
    AND id_usuario_alumno = (SELECT id_usuario FROM usuarios WHERE correo = 'alumno2@utp.edu.pe')
);
