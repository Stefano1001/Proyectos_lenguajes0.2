const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const keys = require('./src/config/keys'); // Importar configuración centralizada

dotenv.config();

console.log('🚀 Iniciando configuración de TODAS las bases de datos (Monolito)...');

async function setupMySQL() {
    console.log('\n--- Configurando MySQL (Usuarios) ---');
    try {
        // 1. Crear DB si no existe
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Rodri123',
            port: process.env.DB_PORT || 3306
        });

        const dbName = process.env.DB_NAME || 'sistema_usuarios';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`✅ Base de datos MySQL '${dbName}' verificada.`);
        await connection.end();

        // 2. Crear Tablas
        const dbConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: dbName,
            port: process.env.DB_PORT,
            multipleStatements: true
        });

        // --- MIGRACIÓN AUTOMÁTICA DE ESQUEMA ---
        console.log('🔄 Verificando esquema de tablas...');
        try {
            const [columns] = await dbConnection.query(`SHOW COLUMNS FROM usuarios LIKE 'dni'`);
            if (columns.length === 0) {
                console.log('⚠️ Columna "dni" no encontrada. Aplicando migración...');
                // Si la tabla usuarios existe pero no tiene dni, la agregamos
                const [tables] = await dbConnection.query(`SHOW TABLES LIKE 'usuarios'`);
                if (tables.length > 0) {
                    await dbConnection.query(`ALTER TABLE usuarios ADD COLUMN dni VARCHAR(20) UNIQUE;`);
                    console.log('✅ Migración completada: Columna "dni" agregada.');
                }
            } else {
                console.log('✅ Esquema correcto: Columna "dni" ya existe.');
            }
        } catch (migError) {
            // Ignoramos errores de migración si son porque la tabla no existe aún (el script SQL la creará)
            console.log('ℹ️ Tabla usuarios no existe o error menor, procediendo a creación inicial.');
        }
        // ----------------------------------------

        const sql = fs.readFileSync(path.join(__dirname, 'src', 'config', 'sql', 'init_mysql.sql'), 'utf8');
        await dbConnection.query(sql);
        console.log('✅ Tablas de MySQL configuradas y datos semilla verificados.');
        await dbConnection.end();

    } catch (error) {
        console.error('❌ Error MySQL:', error.message);
    }
}

async function setupPostgres() {
    console.log('\n--- Configurando PostgreSQL (Cursos) ---');
    try {
        // 1. Crear DB si no existe (Truco: conectar a 'postgres')
        const pool = new Pool({
            host: process.env.PG_HOST || 'localhost',
            user: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASSWORD || 'Rodri123',
            database: 'postgres',
            port: process.env.PG_PORT || 5432
        });

        const dbName = process.env.PG_DATABASE || 'sistema_academico';
        const res = await pool.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

        if (res.rowCount === 0) {
            console.log(`Creando base de datos ${dbName}...`);
            await pool.query(`CREATE DATABASE ${dbName}`);
        } else {
            console.log(`Base de datos ${dbName} ya existe.`);
        }
        await pool.end();

        // 2. Crear Tablas
        const poolNew = new Pool({
            host: process.env.PG_HOST,
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: dbName,
            port: process.env.PG_PORT
        });

        const sql = fs.readFileSync(path.join(__dirname, 'src', 'config', 'sql', 'init_postgres.sql'), 'utf8');
        await poolNew.query(sql);
        console.log('✅ Tablas de PostgreSQL configuradas.');
        await poolNew.end();

    } catch (error) {
        console.error('❌ Error PostgreSQL:', error.message);
    }
}

async function setupMongo() {
    console.log('\n--- Configurando MongoDB (Matrículas) ---');
    try {
        const mongoURI = keys.database.mongo.uri;
        await mongoose.connect(mongoURI);

        // Limpiar base de datos antigua para evitar errores de índices fantasma
        await mongoose.connection.dropDatabase();
        console.log('✅ Base de datos MongoDB limpiada y estructura lista.');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error MongoDB:', error.message);
    }
}

async function main() {
    await setupMySQL();
    await setupPostgres();
    await setupMongo();
    console.log('\n✨ Configuración finalizada. ¡Listo para usar!');
}

main();
