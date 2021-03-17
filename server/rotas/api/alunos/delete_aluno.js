const { query } = require('../../../db/consultas.js');
const { unlink } = require('fs');
const ExceptionAPI = require('../../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            const erro = { cod: 406, mensagem: 'Dados inválidos!' };
            throw new ExceptionAPI(erro);
        }

        const sqlSelect = `SELECT foto FROM alunos WHERE id = ${id}`;
        const resSelect = await query(sqlSelect, 'alunos', 'select' );
        if (!resSelect.ok) throw new ExceptionAPI(resSelect.resposta);

        const sqlAlunos = `DELETE FROM alunos WHERE id = ${id}`;
        const resAlunos = await query(sqlAlunos, 'alunos', 'delete' );
        if (!resAlunos.ok) throw new ExceptionAPI(resAlunos.resposta);

        unlink(resSelect.resposta[0].foto, () => {});

        const sqlOcorrencias = `DELETE FROM ocorrencias WHERE id_aluno = ${id}`;
        await query(sqlOcorrencias, 'ocorrencias', 'delete');

        return res.status(201).send(resAlunos.resposta);
    } catch (erro) {
        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
};
