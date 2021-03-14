// Arquivos de rotas.
const getCursos = require('./get_cursos.js');
const postCursos = require('./post_cursos.js');
// Método para validar acesso das rotas.
const validarRotas = require('../../util/validarRotas.js');

module.exports = (app) => {
    // GET
    app.get('/cursos', validarRotas, getCursos);
    app.get('/cursos/:id', validarRotas, getCursos);
    // POST
    app.post('/cursos', validarRotas, postCursos);
};
