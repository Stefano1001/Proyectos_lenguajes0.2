const express = require('express');
const router = express.Router();
const pool = require('../config/db_postgres');

// LISTAR CURSOS DISPONIBLES
router.get('/', async (req, res) => {
    const { carrera, ciclo } = req.query;

    try {
        let query = 'SELECT * FROM cursos WHERE 1=1';
        const params = [];

        if (carrera) {
            query += ' AND carrera_objetivo = $' + (params.length + 1);
            params.push(carrera);
        }
        if (ciclo) {
            query += ' AND ciclo = $' + (params.length + 1);
            params.push(ciclo);
        }

        const { rows } = await pool.query(query, params);
        res.json({ exito: true, datos: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: 'Error al obtener cursos' });
    }
});

// OBTENER SECCIONES DE UN CURSO
router.get('/:id_curso/secciones', async (req, res) => {
    const { id_curso } = req.params;
    try {
        // Unimos con tabla profesores para mostrar quién enseña
        const query = `
            SELECT s.*, p.nombre_completo as nombre_profesor 
            FROM secciones s
            LEFT JOIN profesores p ON s.id_profesor = p.id_profesor
            WHERE s.id_curso = $1
        `;
        const { rows } = await pool.query(query, [id_curso]);

        // Parsear el horario JSON para que el frontend lo lea fácil
        const secciones = rows.map(s => ({
            ...s,
            horario: JSON.parse(s.horario_json || '[]')
        }));

        res.json({ exito: true, datos: secciones });
    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: 'Error al obtener secciones' });
    }
});

module.exports = router;
