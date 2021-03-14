const { select } = require('../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE id = ${id}` : '';

        const consulta = `SELECT * FROM cursos ${where} ORDER BY id`;

        const { ok, resposta } = await select(consulta, 'cursos');

        if (!ok) throw new Error(JSON.stringify(resposta));

        res.status(200).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: "Falha", mensagem });
    }
};
