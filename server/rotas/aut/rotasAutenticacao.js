// Arquivos de rotas.
const login = require('./login.js');
const validarToken = require('./validarToken.js');
const cadastro = require('./cadastro.js');
const trocarSenha = require('./trocarSenha.js');

// Middleware para validar rotas.
const validarRotas = require('../../util/validarRotas.js');

module.exports = (router) => {
    router.post('/login', login);
    router.post('/validarToken', validarRotas, validarToken);
    router.post('/cadastro', validarRotas, cadastro);
    router.put('/trocarSenha', validarRotas, trocarSenha);
}