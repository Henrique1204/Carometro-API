const { query } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { nome, id_curso } = req.body;

        if (!nome || !id_curso) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new Error(JSON.stringify(erro));
        }

        if (isNaN(id_curso)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new Error(JSON.stringify(erro));
        }

        const sql = (
            `INSERT INTO turmas (id, nome, id_curso, formado) 
            VALUES (null, '${nome}', '${id_curso}', 0)`
        );

        const { ok, resposta } = await query(sql, { tabela: 'turmas', tipo: 'adicionar' });
        if (!ok) throw new Error(JSON.stringify(resposta));
        return res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
