// Dependências para rodar o servidor.
const http = require('http'); 
const express = require('express');
const app = express();

// Configurando a entrada de dados das rotas.
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

// Configurando CORS.
const corsConfig = require('./corsCofnig.js');
corsConfig(app);

// Carregando banco de dados.
const dbCon = require('./db.js');
dbCon.connect();

// Rotas da API.
const rotasAluanos = require('./api/alunos/rotasAlunos.js');
rotasAluanos(app);

// Rota para arquivos estáticos.
app.use('/uploads', express.static('uploads'));

// Inicializando o servidor.
const server = http.createServer(app); 
server.listen(8000, '127.0.0.1');
console.log('Servidor escutando na porta 8000...');
