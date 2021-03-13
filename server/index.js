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
const getAlunos = require('./api/alunos_get.js');
app.get('/alunos', getAlunos);
app.get('/alunos/:id', getAlunos);

const postAlunos = require('./api/alunos_post.js');
app.post('/alunos', postAlunos);

// Inicializando o servidor.
const server = http.createServer(app); 
server.listen(8000, '127.0.0.1');
console.log('Servidor escutando na porta 8000...');
