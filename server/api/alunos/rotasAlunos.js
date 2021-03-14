// Arquivos de rotas.
const getAlunos = require('./get_alunos.js');
const postAluno = require('./post_aluno.js');
const putAluno = require('./put_aluno.js');
const deleteAluno = require('./delete_aluno.js');
// Multer.
const upload = require('../../multer.js');
// Método para validar acesso das rotas.
const validarRotas = require('../../util/validarRotas.js');

module.exports = (app) => {
    // GET
    app.get('/alunos', validarRotas, getAlunos);
    app.get('/alunos/:id', validarRotas, getAlunos);
    // POST 
    app.post('/alunos', validarRotas, upload.single('foto'), postAluno);
    // PUT
    app.put('/alunos/:id', validarRotas, upload.single('foto'), putAluno);
    // DELETE
    app.delete('/alunos/:id', validarRotas, upload.single('foto'), deleteAluno);
};
