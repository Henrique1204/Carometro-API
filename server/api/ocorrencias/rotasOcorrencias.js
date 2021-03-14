// Arquivos de rotas.
const getOcorrencias = require('./get_ocorrencias.js');
const postOcorrencias = require('./post_ocorrencias.js');
const putOcorrencias = require('./put_ocorrencias.js');
const deleteOcorrencias = require('./delete_ocorrencias.js');
// Método para validar acesso das rotas.
const validarRotas = require('../../util/validarRotas.js');

module.exports = (app) => {
    // GET
    app.get('/ocorrencias', validarRotas,  getOcorrencias);
    app.get('/ocorrencias/:id', validarRotas,  getOcorrencias);
    // POST
    app.post('/ocorrencias', validarRotas,  postOcorrencias);
    // PUT
    app.put('/ocorrencias/:id', validarRotas,  putOcorrencias);
    // PUT
    app.delete('/ocorrencias/:id', validarRotas,  deleteOcorrencias);
};
