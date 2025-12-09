const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'sistema_academico',
    password: process.env.PG_PASSWORD || 'Rodri123',
    port: process.env.PG_PORT || 5432,
});

async function loadCourses() {
    console.log('--- CARGANDO MALLA CURRICULAR Y SECCIONES ---');
    try {
        const sqlPath = path.join(__dirname, 'src', 'config', 'sql', 'init_courses.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Ejecutando script SQL...');
        await pool.query(sql);
        console.log('✅ Base de datos académica actualizada correctamente.');
        console.log('   - Cursos insertados: Ciclos 1 al 10.');
        console.log('   - Secciones de prueba creadas (incluyendo caso de cruce).');

    } catch (err) {
        console.error('❌ Error al cargar cursos:', err);
    } finally {
        await pool.end();
    }
}

loadCourses();
