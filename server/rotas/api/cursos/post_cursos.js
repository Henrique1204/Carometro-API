const { query } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { nome, periodo } = req.body;

        if (!nome || !periodo ) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const sql = (
            `INSERT INTO cursos (id, nome, periodo) VALUES (null, '${nome}', '${periodo}')`
        );

        const { ok, resposta } = await query(sql, { tabela: 'cursos', tipo: 'adicionar' });
        if (!ok) throw new Error(JSON.stringify(resposta));

        return res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
