// Arquivos de rotas.
const getCursos = require('./get_cursos.js');
const postCursos = require('./post_cursos.js');
const putCursos = require('./put_cursos.js');
const deleteCursos = require('./delete_cursos.js');

module.exports = (app) => {
    // GET
    app.get('/cursos', getCursos);
    app.get('/cursos/:id', getCursos);
    // POST
    app.post('/cursos', postCursos);
    // PUT
    app.put('/cursos/:id', putCursos);
    // DELETE
    app.delete('/cursos/:id', deleteCursos);
};
