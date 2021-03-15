const { query } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            const erro = { cod: 406, mensagem: 'Dados inválidos!' };
            throw new Error(JSON.stringify(erro));
        }

        const sqlUpdate = `UPDATE turmas SET formado = 1 WHERE id = ${id}`;
        const resUpdate = await query(sqlUpdate, 'turmas', 'update');
        if (!resUpdate.ok) throw new Error(JSON.stringify(resUpdate.resposta));

        return res.status(201).send(resUpdate.resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
