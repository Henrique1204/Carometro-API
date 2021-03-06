// Arquivos de rotas.
const login = require('./login.js');
const trocarSenha = require('./trocarSenha.js');
const validarToken = require('./validarToken.js');
const cadastro = require('./cadastro.js');

// Middleware para validar rotas.
const validarRotas = require('../../util/validarRotas.js');
const upload = require('../../multer.js');

// Exportando função que insere as rotas no router.
module.exports = (router) => {
    // Login.
    router.post('/login', login);
    // Trocar senha.
    router.put('/trocarSenha', trocarSenha);
    // Validar o token.
    router.post('/validarToken', validarRotas, validarToken);
    // Cadastro.
    router.post('/cadastro', validarRotas, upload.single('foto'), cadastro);
}
