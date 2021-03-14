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
const conexaoDB = require('./db/conexao.js');
conexaoDB.connect();

// Rotas da API.
const rotasAlunos = require('./api/alunos/rotasAlunos.js');
rotasAlunos(app);

const rotasOcorrencias = require('./api/ocorrencias/rotasOcorrencias.js');
rotasOcorrencias(app);

const rotasCursos = require('./api/cursos/rotasCursos.js');
rotasCursos(app);

const rotasTurmas = require('./api/turmas/rotasTurmas.js');
rotasTurmas(app);

const rotaLogin = require('./api/login.js');
app.post('/login', rotaLogin);

// Rota para arquivos estáticos.
app.use('/uploads', express.static('uploads'));

// Inicializando o servidor.
const server = http.createServer(app); 
server.listen(8000, '127.0.0.1');
console.log('Servidor escutando na porta 8000...');
