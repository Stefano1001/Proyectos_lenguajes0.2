// db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'Rodri123',
  database: process.env.PG_DATABASE || 'sistema_academico',
  port: process.env.PG_PORT || 5432
});

module.exports = pool;
