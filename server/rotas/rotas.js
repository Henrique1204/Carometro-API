// Criando o Router.
const express = require('express');
const routerAut = express.Router();
const routerAPI = express.Router();

// Puxando rotas de autenticação.
const rotasAut = require('./aut/rotasAutenticacao.js');
rotasAut(routerAut);

// Método para validar acesso das rotas.
const validarRotas = require('../util/validarRotas.js');
routerAPI.use(validarRotas);

// Puxando rotas da API.
const rotasAlunos = require('./api/alunos/rotasAlunos.js');
rotasAlunos(routerAPI);

const rotasOcorrencias = require('./api/ocorrencias/rotasOcorrencias.js');
rotasOcorrencias(routerAPI);

const rotasCursos = require('./api/cursos/rotasCursos.js');
rotasCursos(routerAPI);

const rotasTurmas = require('./api/turmas/rotasTurmas.js');
rotasTurmas(routerAPI);

// Exportando função que adiciona as rotas no app.
module.exports = (app) => {
    app.use('/api', routerAPI);
    app.use('/aut', routerAut);
};
