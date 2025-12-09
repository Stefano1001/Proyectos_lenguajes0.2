const { Pool } = require('pg');
const keys = require('./keys');

const pool = new Pool({
    host: keys.database.postgres.host,
    user: keys.database.postgres.user,
    password: keys.database.postgres.password,
    database: keys.database.postgres.name,
    port: keys.database.postgres.port
});

pool.on('connect', () => {
    // console.log('✅ Conectado a PostgreSQL (Cursos)');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en cliente PostgreSQL', err);
});

// Prueba de conexión inicial
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err.message);
    } else {
        console.log('✅ Conectado a PostgreSQL (Cursos)');
    }
});

module.exports = pool;
