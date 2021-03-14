const { insert } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { nome, periodo } = req.body;

        if (!nome || !periodo ) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const consulta = (
            `INSERT INTO cursos (id, nome, periodo) VALUES (null, '${nome}', '${periodo}')`
        );

        const { ok, resposta } = await insert(consulta, 'cursos');

        if (!ok) throw new Error(JSON.stringify(resposta));

        res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else res.status(cod).send({ status: 'Falha', mensagem });
    }
};
