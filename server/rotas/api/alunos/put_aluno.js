const { query } = require('../../../db/consultas.js');
const moverArquivo = require('../../../util/moverArquivo.js');
const { unlink } = require('fs');
const ExceptionAPI = require('../../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    let foto;

    try {
        const { nome, email, telefone, id_turma } = req.body;
        foto = req.file?.path.replace('\\', '/');
        const { id } = req.params;

        if (!nome || !email || !telefone || !foto || !id_turma) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new ExceptionAPI(erro);
        }

        if (isNaN(id_turma) || isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new ExceptionAPI(erro);
        }

        const sqlFoto = `SELECT foto, email FROM alunos WHERE id = ${id}`;
        const resFoto = await query(sqlFoto, 'alunos', 'select');
        if (!resFoto.ok) throw new ExceptionAPI(resFoto.resposta);

        if (resFoto.resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Aluno informado não existe.' };
            throw new ExceptionAPI(erro);
        }

        const sqlEmail = `SELECT * FROM alunos WHERE email = '${email}'`;
        const resEmail = await query(sqlEmail, 'alunos', 'select');
        if (!resEmail.ok) throw new ExceptionAPI(resEmail.resposta);

        if (resEmail.resposta.length !== 0 && resFoto.resposta[0].email !== email) {
            const erro = { cod: 422, mensagem: 'E-mail pertence a outro aluno.' };
            throw new ExceptionAPI(erro);
        }

        const sqlTurma = (
            `SELECT t.nome FROM alunos INNER JOIN turmas as t 
            ON alunos.id_turma = t.id WHERE id_turma = ${id_turma}`
        );

        const resTurma = await query(sqlTurma, 'turmas', 'select');
        if (!resTurma.ok) throw new ExceptionAPI(resTurma.resposta);

        const arquivo = await moverArquivo(resTurma.resposta[0].nome, foto);
        foto = arquivo.foto;

        const sqlUpdate = (
            `UPDATE alunos SET nome = '${nome}', email = '${email}', telefone = '${telefone}', 
            foto = '${foto}', id_turma = '${id_turma}' WHERE id = ${id}`
        );

        const resUpdate = await query(sqlUpdate, 'alunos', 'insert');
        if (!resUpdate.ok) throw new ExceptionAPI(resUpdate.resposta);

        unlink(resFoto.resposta[0].foto, () => {});
        return res.status(201).send(resUpdate.resposta);
    } catch (erro) {
        if (foto) unlink(foto, () => {});

        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
};
