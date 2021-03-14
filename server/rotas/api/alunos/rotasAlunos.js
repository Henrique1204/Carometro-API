// Arquivos de rotas.
const getAlunos = require('./get_alunos.js');
const postAluno = require('./post_aluno.js');
const putAluno = require('./put_aluno.js');
const deleteAluno = require('./delete_aluno.js');
// Multer.
const upload = require('../../../multer.js');

module.exports = (router) => {
    // GET
    router.get('/alunos', getAlunos);
    router.get('/alunos/:id', getAlunos);
    // POST 
    router.post('/alunos', upload.single('foto'), postAluno);
    // PUT
    router.put('/alunos/:id', upload.single('foto'), putAluno);
    // DELETE
    router.delete('/alunos/:id', deleteAluno);
};
