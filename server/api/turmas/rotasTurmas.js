// Arquivos de rotas.
const getTurmas = require('./get_turmas.js');
const postTurmas = require('./post_turmas.js');

module.exports = (app) => {
    // GET
    app.get('/turmas', getTurmas);
    app.get('/turmas/:id', getTurmas);
    // POST
    app.post('/turmas', postTurmas);
};
