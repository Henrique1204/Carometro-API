const { query } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            const erro = { cod: 406, mensagem: 'Dados inválidos!' };
            throw new Error(JSON.stringify(erro));
        }
    
        const sql = `DELETE FROM ocorrencias WHERE id = ${id}`;
        const { ok, resposta } = await query(sql, 'ocorrencias', 'delete');
        if (!ok) throw new Error(JSON.stringify(resposta));

        return res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
