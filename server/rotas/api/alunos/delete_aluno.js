const { query } = require('../../../db/consultas.js');
const { unlink } = require('fs');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            const erro = { cod: 406, mensagem: 'Dados inválidos!' };
            throw new Error(JSON.stringify(erro));
        }

        const sqlSelect = `SELECT foto FROM alunos WHERE id = ${id}`;
        const resSelect = await query(sqlSelect, 'alunos', 'select' );
        if (!resSelect.ok) throw new Error(JSON.stringify(resSelect.resposta));

        const sqlAlunos = `DELETE FROM alunos WHERE id = ${id}`;
        const resAlunos = await query(sqlAlunos, 'alunos', 'delete' );
        if (!resAlunos.ok) throw new Error(JSON.stringify(resAlunos.resposta));

        unlink(resSelect.resposta[0].foto, () => {});

        const sqlOcorrencias = `DELETE FROM ocorrencias WHERE id_aluno = ${id}`;
        await query(sqlOcorrencias, 'ocorrencias', 'delete');

        return res.status(201).send(resAlunos.resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
