const { query } = require('../../../db/consultas.js');
const ExceptionAPI = require('../../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    try {
        const { nome, periodo } = req.body;

        if (!nome || !periodo ) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new ExceptionAPI(erro);
        }

        const sql = (
            `INSERT INTO cursos (id, nome, periodo) VALUES (null, '${nome}', '${periodo}')`
        );

        const { ok, resposta } = await query(sql, 'cursos', 'insert');
        if (!ok) throw new ExceptionAPI(resposta);

        return res.status(201).send(resposta);
    } catch (erro) {
        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
};
