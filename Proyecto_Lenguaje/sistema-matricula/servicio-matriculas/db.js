// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/sistema_matriculas';

mongoose.connect(uri)
  .then(() => console.log('Conectado a MongoDB - sistema_matriculas'))
  .catch(err => {
    console.error('Error al conectar MongoDB:', err);
    process.exit(1);
  });

module.exports = mongoose;
