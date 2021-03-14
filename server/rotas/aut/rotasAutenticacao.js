// Arquivos de rotas.
const rotaLogin = require('./login.js');
const rotaValidarToken = require('./validarToken.js');
const rotaCadastro = require('./cadastro.js');

// Middleware para validar rotas.
const validarRotas = require('../../util/validarRotas.js');

module.exports = (router) => {
    router.post('/login', rotaLogin);
    router.post('/validarToken', validarRotas, rotaValidarToken);
    router.post('/cadastro', validarRotas, rotaCadastro);
}