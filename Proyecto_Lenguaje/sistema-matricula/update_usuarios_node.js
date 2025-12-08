const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'servicio-usuarios', '.env') });

async function runMigration() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Rodri123',
        database: process.env.DB_NAME || 'sistema_usuarios',
        port: process.env.DB_PORT || 3306,
        multipleStatements: true
    });

    console.log('Ejecutando migración MySQL...');

    const sqlFile = fs.readFileSync(path.join(__dirname, 'update_usuarios_db.sql'), 'utf8');
    // Split by semicolon and filter empty lines
    const statements = sqlFile.split(';').map(s => s.trim()).filter(s => s.length > 0);

    for (const statement of statements) {
        try {
            await connection.query(statement);
            console.log('✅ Ejecutado:', statement.substring(0, 50) + '...');
        } catch (error) {
            // Ignore duplicate column errors (1060) or similar non-fatal errors
            if (error.errno === 1060) {
                console.log('⚠️ Columna ya existe, saltando:', statement.substring(0, 50) + '...');
            } else if (error.errno === 1050) { // Table exists
                console.log('⚠️ Tabla ya existe, saltando:', statement.substring(0, 50) + '...');
            } else {
                console.error('❌ Error en sentencia:', statement.substring(0, 50) + '...', error.message);
            }
        }
    }
    console.log('🏁 Proceso de migración finalizado.');
    await connection.end();
}

runMigration();
