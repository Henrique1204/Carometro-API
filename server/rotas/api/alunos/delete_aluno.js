const { select, deleteSQL } = require('../../../db/consultas.js');
const { unlink } = require('fs');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const consultaSelect = `SELECT foto FROM alunos WHERE id = ${id}`;
        const consultaAlunos = `DELETE FROM alunos WHERE id = ${id}`;
        const consultaOcorrencias = `DELETE FROM ocorrencias WHERE id_aluno = ${id}`;

        const resSelect = await select(consultaSelect, 'alunos');
        if (!resSelect.ok) throw new Error(JSON.stringify(resSelect.resposta));

        const resAlunos = await deleteSQL(consultaAlunos, 'alunos', id);
        if (!resAlunos.ok) throw new Error(JSON.stringify(resAlunos.resposta));
        unlink(resSelect.resposta[0].foto, () => {});

        await deleteSQL(consultaOcorrencias, 'ocorrencias', id);

        res.status(201).send(resAlunos.resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else res.status(cod).send({ status: 'Falha', mensagem });
    }
};
