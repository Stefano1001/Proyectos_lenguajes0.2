const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno del servicio de cursos para obtener credenciales
dotenv.config({ path: path.join(__dirname, 'servicio-cursos/.env') });

const pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'Rodri123',
    database: process.env.PG_DATABASE || 'sistema_academico',
    port: process.env.PG_PORT || 5432
});

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'update_cursos_db.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Ejecutando migración SQL...');
        await pool.query(sql);
        console.log('✅ Migración completada exitosamente.');
    } catch (err) {
        console.error('❌ Error en migración:', err);
    } finally {
        await pool.end();
    }
}

runMigration();
