// Arquivos de rotas.
const getOcorrencias = require('./get_ocorrencias.js');
const postOcorrencias = require('./post_ocorrencias.js');
const putOcorrencias = require('./put_ocorrencias.js');
const deleteOcorrencias = require('./delete_ocorrencias.js');

// Exportando função que insere as rotas no router.
module.exports = (router) => {
    // GET
    router.get('/ocorrencias',  getOcorrencias);
    router.get('/ocorrencias/:id',  getOcorrencias);
    // POST
    router.post('/ocorrencias',  postOcorrencias);
    // PUT
    router.put('/ocorrencias/:id',  putOcorrencias);
    // PUT
    router.delete('/ocorrencias/:id',  deleteOcorrencias);
};
