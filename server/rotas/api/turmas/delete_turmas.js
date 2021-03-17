const { query } = require('../../../db/consultas.js');
const ExceptionAPI = require('../../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            const erro = { cod: 406, mensagem: 'Dados inválidos!' };
            throw new ExceptionAPI(erro);
        }

        const sqlUpdate = `UPDATE turmas SET formado = 1 WHERE id = ${id}`;
        const resUpdate = await query(sqlUpdate, 'turmas', 'update');
        if (!resUpdate.ok) throw new ExceptionAPI(resUpdate.resposta);

        return res.status(201).send(resUpdate.resposta);
    } catch (erro) {
        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
};
