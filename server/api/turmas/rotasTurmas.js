// Arquivos de rotas.
const getTurmas = require('./get_turmas.js');
const postTurmas = require('./post_turmas.js');
const putTurmas = require('./put_turmas.js');
const deleteTurmas = require('./delete_turmas.js');
// Método para validar acesso das rotas.
const validarRotas = require('../../util/validarRotas.js');

module.exports = (app) => {
    // GET
    app.get('/turmas', validarRotas, getTurmas);
    app.get('/turmas/:id', validarRotas, getTurmas);
    // POST
    app.post('/turmas', validarRotas, postTurmas);
    // PUT
    app.put('/turmas/:id', validarRotas, putTurmas);
    // DELETE
    app.delete('/turmas/:id', validarRotas, deleteTurmas);
};
