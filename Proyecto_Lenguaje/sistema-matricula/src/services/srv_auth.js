const express = require('express');
const router = express.Router();
const pool = require('../config/db_mysql');

// LOGIN
router.post('/login', async (req, res) => {
    const { correo, clave } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ? AND clave = ?', [correo, clave]);

        if (rows.length === 0) {
            return res.status(401).json({ exito: false, mensaje: 'Credenciales incorrectas' });
        }

        const usuario = rows[0];
        let respuesta = {
            exito: true,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre_completo,
                rol: usuario.tipo_usuario,
                carrera: usuario.carrera,
                correo: usuario.correo,
                dni: usuario.dni
            }
        };

        // Lógica Específica por Rol
        if (usuario.tipo_usuario === 'apoderado') {
            // Buscar alumnos asociados
            const [alumnos] = await pool.query(`
                SELECT u.* 
                FROM usuarios u
                JOIN relacion_apoderados r ON u.id_usuario = r.id_usuario_alumno
                WHERE r.id_usuario_apoderado = ?
            `, [usuario.id_usuario]);

            respuesta.es_apoderado = true;
            respuesta.alumnos_asociados = alumnos.map(a => ({
                id: a.id_usuario,
                nombre: a.nombre_completo,
                carrera: a.carrera,
                estado_pago: a.estado_pago_matricula
            }));

            return res.json(respuesta);
        }

        // Lógica Normal (Alumno)
        // Calcular Semáforo
        let estado_matricula = 'BLOQUEADO';
        let mensaje_estado = '';
        const ahora = new Date();
        const turno = new Date(usuario.turno_matricula);

        if (!usuario.estado_pago_matricula) {
            estado_matricula = 'PAGO_PENDIENTE';
            mensaje_estado = 'Debes realizar el pago de tu matrícula para continuar.';
        } else if (usuario.turno_matricula && ahora < turno) {
            estado_matricula = 'TURNO_ESPERA';
            mensaje_estado = `Tu turno de matrícula inicia el ${turno.toLocaleString()}.`;
        } else {
            estado_matricula = 'HABILITADO';
            mensaje_estado = '¡Ya puedes matricularte!';
        }

        respuesta.usuario.ciclo = usuario.ciclo;
        respuesta.usuario.promedio = usuario.promedio_ponderado;
        respuesta.estado_matricula = {
            codigo: estado_matricula,
            mensaje: mensaje_estado,
            turno: usuario.turno_matricula
        };

        res.json(respuesta);

    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: 'Error en el servidor' });
    }
});

// Endpoint para que el Apoderado "imite" al alumno (Switch User)
router.get('/impersonate/:id_alumno', async (req, res) => {
    // En un sistema real, validaríamos que el requester sea el apoderado de este alumno.
    // Aquí simplificamos asumiendo que el frontend manda el ID correcto tras login.
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [req.params.id_alumno]);
        if (rows.length === 0) return res.status(404).json({ exito: false });

        const usuario = rows[0];

        // Recalcular estado para el alumno seleccionado
        let estado_matricula = 'BLOQUEADO';
        let mensaje_estado = '';
        const ahora = new Date();
        const turno = new Date(usuario.turno_matricula);

        if (!usuario.estado_pago_matricula) {
            estado_matricula = 'PAGO_PENDIENTE';
            mensaje_estado = 'Pago pendiente.';
        } else if (usuario.turno_matricula && ahora < turno) {
            estado_matricula = 'TURNO_ESPERA';
            mensaje_estado = `Turno inicia: ${turno.toLocaleString()}`;
        } else {
            estado_matricula = 'HABILITADO';
            mensaje_estado = 'Habilitado';
        }

        res.json({
            exito: true,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre_completo,
                rol: usuario.tipo_usuario,
                carrera: usuario.carrera,
                correo: usuario.correo,
                dni: usuario.dni
            },
            estado_matricula: {
                codigo: estado_matricula,
                mensaje: mensaje_estado
            }
        });
    } catch (error) {
        res.status(500).json({ exito: false });
    }
});

// CONSULTAR ESTADO POR DNI (Para Apoderados)
router.post('/consultar-dni', async (req, res) => {
    const { dni } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE dni = ? AND tipo_usuario = "alumno"', [dni]);

        if (rows.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Estudiante no encontrado con ese DNI.' });
        }

        const usuario = rows[0];

        // Calcular Semáforo (Misma lógica que login)
        let estado_matricula = 'BLOQUEADO';
        let mensaje_estado = '';
        const ahora = new Date();
        const turno = new Date(usuario.turno_matricula);

        if (!usuario.estado_pago_matricula) {
            estado_matricula = 'PAGO_PENDIENTE';
            mensaje_estado = 'Pago de matrícula pendiente.';
        } else if (usuario.turno_matricula && ahora < turno) {
            estado_matricula = 'TURNO_ESPERA';
            mensaje_estado = `Tu turno de matrícula inicia el ${turno.toLocaleString()}.`;
        } else {
            estado_matricula = 'HABILITADO';
            mensaje_estado = '¡Ya puedes matricularte!';
        }

        res.json({
            exito: true,
            alumno: {
                id: usuario.id_usuario,
                nombre: usuario.nombre_completo,
                carrera: usuario.carrera,
                ciclo: usuario.ciclo,
                dni: usuario.dni,
                estado_pago: !!usuario.estado_pago_matricula
            },
            estado_matricula: {
                codigo: estado_matricula,
                mensaje: mensaje_estado
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: 'Error al consultar DNI' });
    }
});

module.exports = router;
