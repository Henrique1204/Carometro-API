// Arquivos de rotas.
const getCursos = require('./get_cursos.js');
const postCursos = require('./post_cursos.js');

module.exports = (app) => {
    // GET
    app.get('/cursos', getCursos);
    app.get('/cursos/:id', getCursos);
    // POST
    app.post('/cursos', postCursos);
};
