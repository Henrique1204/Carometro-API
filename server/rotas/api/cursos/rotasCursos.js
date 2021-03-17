// Arquivos de rotas.
const getCursos = require('./get_cursos.js');
const postCursos = require('./post_cursos.js');

// Exportando função que insere as rotas no router.
module.exports = (router) => {
    // GET
    router.get('/cursos', getCursos);
    router.get('/cursos/:id', getCursos);
    // POST
    router.post('/cursos', postCursos);
};
