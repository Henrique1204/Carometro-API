// Arquivos de rotas.
const getTurmas = require('./get_turmas.js');
const postTurmas = require('./post_turmas.js');
const putTurmas = require('./put_turmas.js');
const deleteTurmas = require('./delete_turmas.js');

// Exportando função que insere as rotas no router.
module.exports = (router) => {
    // GET
    router.get('/turmas', getTurmas);
    router.get('/turmas/:id', getTurmas);
    // POST
    router.post('/turmas', postTurmas);
    // PUT
    router.put('/turmas/:id', putTurmas);
    // DELETE
    router.delete('/turmas/:id', deleteTurmas);
};
