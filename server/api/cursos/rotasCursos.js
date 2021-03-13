// Arquivos de rotas.
const getCursos = require('./get_cursos.js');

module.exports = (app) => {
    // GET
    app.get('/cursos', getCursos);
    app.get('/cursos/:id', getCursos);
};
