const { insert } = require('../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { nome, id_curso } = req.body;

        if (!nome || !id_curso) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        if (isNaN(id_curso)) {
            const erro = JSON.stringify({ cod: 406, mensagem: "Dados inválidos!" });
            throw new Error(erro);
        }

        const consulta = (
            `INSERT INTO turmas (id, nome, id_curso, formado) 
            VALUES (null, '${nome}', '${id_curso}', 0)`
        );

        const { ok, resposta } = await insert(consulta, 'turmas');

        if (!ok) throw new Error(JSON.stringify(resposta));

        res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else res.status(cod).send({ status: 'Falha', mensagem });
    }
};
