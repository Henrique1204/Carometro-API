const { query } = require('../../../db/consultas.js');
const ExceptionAPI = require('../../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE id = ${id}` : '';

        if (id && isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new dExceptionAPI(erro);
        }

        const sql = `SELECT * FROM cursos ${where} ORDER BY id`;
        const { ok, resposta } = await query(sql, 'cursos', 'select');
        if (!ok) throw new dExceptionAPI(resposta);

        if (id && resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados não encontrados.' };
            throw new dExceptionAPI(erro);
        }

        if (id) return res.status(200).send(resposta[0]);
        return res.status(200).send(resposta);
    } catch (erro) {
        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
};
