const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno desde servicio-cursos
dotenv.config({ path: path.join(__dirname, 'servicio-cursos', '.env') });

// Configuración inicial para conectar a 'postgres' y crear la nueva BD
const pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'Rodri123',
    database: 'postgres',
    port: process.env.PG_PORT || 5432
});

async function initDB() {
    try {
        // 1. Crear base de datos si no existe
        const dbName = process.env.PG_DATABASE || 'sistema_academico';
        console.log(`Verificando base de datos: ${dbName}...`);

        const checkDb = await pool.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        if (checkDb.rowCount === 0) {
            console.log(`Creando base de datos ${dbName}...`);
            await pool.query(`CREATE DATABASE ${dbName}`);
        } else {
            console.log(`Base de datos ${dbName} ya existe.`);
        }
        await pool.end();

        // 2. Conectar a la nueva base de datos y crear tablas
        const poolNew = new Pool({
            host: process.env.PG_HOST || 'localhost',
            user: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASSWORD || 'Rodri123',
            database: dbName,
            port: process.env.PG_PORT || 5432
        });

        const sql = fs.readFileSync(path.join(__dirname, 'init_postgres.sql'), 'utf8');
        console.log('Ejecutando script SQL en nueva BD...');
        await poolNew.query(sql);
        console.log('✅ Tablas creadas correctamente en PostgreSQL.');
        await poolNew.end();

    } catch (err) {
        console.error('❌ Error al inicializar base de datos:', err);
        try { await pool.end(); } catch (e) { }
    }
}

initDB();
