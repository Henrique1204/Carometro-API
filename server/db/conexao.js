// Adiciona o pacote para fazer as consultas MySQL.
const mysql = require('mysql8');
// Adicionar o pacote que permite o usa das vairáveis de ambiente.
require('dotenv/config');

// Configurando a conexão com o banco MySQL.
module.exports = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
