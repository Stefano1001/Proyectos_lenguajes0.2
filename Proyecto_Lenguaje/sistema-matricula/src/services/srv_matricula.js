const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const poolPostgres = require('../config/db_postgres');

// Esquema de Matrícula en Mongo
const MatriculaSchema = new mongoose.Schema({
    id_usuario: Number,
    cursos: [{
        id_curso: Number,
        id_seccion: Number,
        nombre_curso: String,
        horario: Array // Guardamos el horario para validar rápido
    }],
    fecha: { type: Date, default: Date.now }
});
const Matricula = mongoose.model('Matricula', MatriculaSchema);

// Función auxiliar para detectar cruces
function hayCruce(horarioNuevo, horarioExistente) {
    for (const h1 of horarioNuevo) {
        for (const h2 of horarioExistente) {
            if (h1.dia === h2.dia) {
                // Convertir horas a minutos para comparar (ej: "08:00" -> 480)
                const [h1Inicio, m1Inicio] = h1.inicio.split(':').map(Number);
                const [h1Fin, m1Fin] = h1.fin.split(':').map(Number);
                const min1Inicio = h1Inicio * 60 + m1Inicio;
                const min1Fin = h1Fin * 60 + m1Fin;

                const [h2Inicio, m2Inicio] = h2.inicio.split(':').map(Number);
                const [h2Fin, m2Fin] = h2.fin.split(':').map(Number);
                const min2Inicio = h2Inicio * 60 + m2Inicio;
                const min2Fin = h2Fin * 60 + m2Fin;

                // Lógica de solapamiento
                if (Math.max(min1Inicio, min2Inicio) < Math.min(min1Fin, min2Fin)) {
                    return true; // Hay cruce
                }
            }
        }
    }
    return false;
}

// INSCRIBIR CURSO
router.post('/inscribir', async (req, res) => {
    const { id_usuario, id_curso, id_seccion, nombre_curso, horario_seccion } = req.body;

    try {
        // 1. Obtener matrícula actual del alumno
        let matricula = await Matricula.findOne({ id_usuario });
        if (!matricula) {
            matricula = new Matricula({ id_usuario, cursos: [] });
        }

        // 2. Validar que no lleve el mismo curso
        if (matricula.cursos.some(c => c.id_curso == id_curso)) {
            return res.status(400).json({ exito: false, mensaje: 'Ya estás inscrito en este curso.' });
        }

        // 3. Validar CRUCES DE HORARIO
        const horarioNuevo = horario_seccion; // Debe venir como array de objetos
        for (const cursoInscrito of matricula.cursos) {
            if (hayCruce(horarioNuevo, cursoInscrito.horario)) {
                return res.status(400).json({
                    exito: false,
                    mensaje: `Cruce de horario con el curso: ${cursoInscrito.nombre_curso}`
                });
            }
        }

        // 4. Validar Vacantes en Postgres
        const { rows } = await poolPostgres.query('SELECT capacidad_maxima, alumnos_inscritos FROM secciones WHERE id_seccion = $1', [id_seccion]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Sección no encontrada' });

        const seccion = rows[0];
        if (seccion.alumnos_inscritos >= seccion.capacidad_maxima) {
            return res.status(400).json({ exito: false, mensaje: 'No hay vacantes disponibles en esta sección.' });
        }

        // 5. Guardar inscripción
        matricula.cursos.push({ id_curso, id_seccion, nombre_curso, horario: horarioNuevo });
        await matricula.save();

        // 6. Actualizar vacantes en Postgres
        await poolPostgres.query('UPDATE secciones SET alumnos_inscritos = alumnos_inscritos + 1 WHERE id_seccion = $1', [id_seccion]);

        res.json({ exito: true, mensaje: 'Curso inscrito correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: 'Error al inscribir curso' });
    }
});

// DAR DE BAJA CURSO (Quitar)
router.delete('/baja', async (req, res) => {
    const { id_usuario, id_curso, id_seccion } = req.body;
    try {
        // 1. Eliminar de MongoDB
        const matricula = await Matricula.findOne({ id_usuario });

        if (!matricula) return res.status(404).json({ exito: false, mensaje: 'Matrícula no encontrada' });

        // Filtrar el curso a eliminar
        const cursosPrevios = matricula.cursos.length;
        matricula.cursos = matricula.cursos.filter(c => c.id_curso != id_curso);

        if (matricula.cursos.length === cursosPrevios) {
            return res.status(400).json({ exito: false, mensaje: 'Curso no encontrado en tu matrícula.' });
        }

        await matricula.save();

        // 2. Liberar vacante en Postgres
        await poolPostgres.query('UPDATE secciones SET alumnos_inscritos = alumnos_inscritos - 1 WHERE id_seccion = $1', [id_seccion]);

        res.json({ exito: true, mensaje: 'Curso retirado correctamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: 'Error al retirar curso' });
    }
});

// VER HORARIO (Matrícula actual)
router.get('/:id_usuario', async (req, res) => {
    try {
        const matricula = await Matricula.findOne({ id_usuario: req.params.id_usuario });
        res.json({ exito: true, datos: matricula ? matricula.cursos : [] });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error al obtener horario' });
    }
});

module.exports = router;
