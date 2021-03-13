// Arquivos de rotas.
const getAlunos = require('./get_alunos.js');
const postAluno = require('./post_aluno.js');
const putAluno = require('./put_aluno.js');
const deleteAluno = require('./delete_aluno.js');
// Multer.
const upload = require('../../multer.js');

module.exports = (app) => {
    // GET
    app.get('/alunos', getAlunos);
    app.get('/alunos/:id', getAlunos);
    // POST 
    app.post('/alunos', upload.single('foto') , postAluno);
    // PUT
    app.put('/alunos/:id', upload.single('foto') , putAluno);
    // DELETE
    app.delete('/alunos/:id', upload.single('foto') , deleteAluno);
};
