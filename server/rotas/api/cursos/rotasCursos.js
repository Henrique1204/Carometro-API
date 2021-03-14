// Arquivos de rotas.
const getCursos = require('./get_cursos.js');
const postCursos = require('./post_cursos.js');

module.exports = (router) => {
    // GET
    router.get('/cursos', getCursos);
    router.get('/cursos/:id', getCursos);
    // POST
    router.post('/cursos', postCursos);
};
