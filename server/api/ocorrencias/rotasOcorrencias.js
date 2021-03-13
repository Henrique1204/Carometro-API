// Arquivos de rotas.
const getOcorrencias = require('./get_ocorrencias.js');
const postOcorrencias = require('./post_ocorrencias.js');
const putOcorrencias = require('./put_ocorrencias.js');

module.exports = (app) => {
    // GET
    app.get('/ocorrencias', getOcorrencias);
    app.get('/ocorrencias/:id', getOcorrencias);
    // POST
    app.post('/ocorrencias', postOcorrencias);
    // PUT
    app.put('/ocorrencias/:id', putOcorrencias);
};
