// Script de diagnóstico para probar las conexiones a las 3 bases de datos
const mysql = require('mysql2');
const { Pool } = require('pg');
const mongoose = require('mongoose');

console.log('=== DIAGNÓSTICO DE CONEXIONES ===\n');

// Test 1: MySQL (Usuarios y Pagos)
console.log('1. Probando MySQL...');
const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rodri123',
    database: 'sistema_usuarios',
    port: 3306
});

mysqlConnection.connect((err) => {
    if (err) {
        console.error('❌ ERROR MySQL:', err.message);
        console.error('   Código:', err.code);
        console.error('   Detalles:', err.sqlMessage || 'N/A');
    } else {
        console.log('✅ MySQL conectado exitosamente (sistema_usuarios)');

        // Probar consulta
        mysqlConnection.query('SHOW TABLES', (error, results) => {
            if (error) {
                console.error('❌ Error al consultar tablas:', error.message);
            } else {
                console.log('   Tablas disponibles:', results.map(r => Object.values(r)[0]).join(', ') || 'Ninguna tabla encontrada');
            }
            mysqlConnection.end();
        });
    }
});

// Test 2: PostgreSQL (Cursos y Profesores)
console.log('\n2. Probando PostgreSQL...');
const pgPool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Rodri123',
    database: 'sistema_academico',
    port: 5432
});

pgPool.query('SELECT current_database(), version()', (err, result) => {
    if (err) {
        console.error('❌ ERROR PostgreSQL:', err.message);
        console.error('   Código:', err.code);
        console.error('   Detalles:', err.detail || 'N/A');
    } else {
        console.log('✅ PostgreSQL conectado exitosamente');
        console.log('   Base de datos:', result.rows[0].current_database);

        // Listar tablas
        pgPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `, (error, tables) => {
            if (error) {
                console.error('❌ Error al consultar tablas:', error.message);
            } else {
                console.log('   Tablas disponibles:', tables.rows.map(t => t.table_name).join(', ') || 'Ninguna tabla encontrada');
            }
            pgPool.end();
        });
    }
});

// Test 3: MongoDB (Matrículas)
console.log('\n3. Probando MongoDB...');
const mongoUri = 'mongodb://localhost:27017/sistema_matriculas';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(async () => {
    console.log('✅ MongoDB conectado exitosamente (sistema_matriculas)');

    // Listar colecciones
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('   Colecciones disponibles:', collections.map(c => c.name).join(', ') || 'Ninguna colección encontrada');
    } catch (error) {
        console.error('❌ Error al listar colecciones:', error.message);
    }

    mongoose.connection.close();
}).catch(err => {
    console.error('❌ ERROR MongoDB:', err.message);
    console.error('   Detalles:', err.reason || 'N/A');
});

// Resumen después de 3 segundos
setTimeout(() => {
    console.log('\n=== FIN DEL DIAGNÓSTICO ===');
    console.log('\nRecomendaciones:');
    console.log('- Verifica que los servicios de BD estén corriendo');
    console.log('- MySQL debe estar en puerto 3306');
    console.log('- PostgreSQL debe estar en puerto 5432');
    console.log('- MongoDB debe estar en puerto 27017');
    console.log('- Verifica usuario/contraseña: root/Rodri123 (MySQL), postgres/Rodri123 (PostgreSQL)');
    process.exit(0);
}, 3000);
