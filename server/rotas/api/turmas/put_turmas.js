const { query } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { nome } = req.body;
        const { id } = req.params;

        if (!nome || !id) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new Error(JSON.stringify(erro));
        }

        if (isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new Error(JSON.stringify(erro));
        }

        const sql = `UPDATE turmas SET nome = '${nome}' WHERE id = ${id}`;    
        const { ok, resposta } = await query(sql, 'turmas', 'update');
        if (!ok) throw new Error(JSON.stringify(resposta));

        return res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
