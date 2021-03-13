// Arquivos de rotas.
const getTurmas = require('./get_turmas.js');
const postTurmas = require('./post_turmas.js');
const putTurmas = require('./put_turmas.js');

module.exports = (app) => {
    // GET
    app.get('/turmas', getTurmas);
    app.get('/turmas/:id', getTurmas);
    // POST
    app.post('/turmas', postTurmas);
    // PUT
    app.put('/turmas/:id', putTurmas);
};
