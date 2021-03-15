const { query } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE id = ${id}` : '';

        if (id && isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new Error(JSON.stringify(erro));
        }

        const sql = `SELECT * FROM cursos ${where} ORDER BY id`;
        const { ok, resposta } = await query(sql, { tabela: 'cursos', tipo: 'buscar' });
        if (!ok) throw new Error(JSON.stringify(resposta));

        if (id && resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados não encontrados.' };
            throw new Error(JSON.stringify(erro));
        }

        if (id) return res.status(200).send(resposta[0]);
        return res.status(200).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
