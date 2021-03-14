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

// Middleware para validar rotas.
const validarRotas = require('./util/validarRotas.js');

// Rotas de autenticação.
const rotaLogin = require('./api/login.js');
app.post('/login', rotaLogin);

const rotaValidarToken = require('./api/validarToken.js');
app.post('/validarToken', validarRotas, rotaValidarToken);

const rotaCadastro = require('./api/cadastro.js');
app.post('/cadastro', validarRotas, rotaCadastro);

// Rotas da API.
const rotasAPI = require('./rotas');
rotasAPI(app);

// Rota para arquivos estáticos.
app.use('/uploads', express.static('uploads'));

// Inicializando o servidor.
const server = http.createServer(app); 
server.listen(8000, '127.0.0.1');
console.log('Servidor escutando na porta 8000...');
