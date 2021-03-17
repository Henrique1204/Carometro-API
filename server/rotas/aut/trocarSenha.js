const { query } = require('../../db/consultas.js');
const ExceptionAPI = require('../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    try {
        const { NI, senha } = req.body;

        if (!NI || !senha) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new ExceptionAPI(erro);
        }

        const sqlSelect = `SELECT * FROM usuarios WHERE NI = '${NI}'`;
        const resSelect = await query(sqlSelect, { tabela: 'usuarios', tipo: 'buscar' });
        if (!resSelect.ok) throw new ExceptionAPI(resSelect.resposta);

        if (resSelect.resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados inválidos.' };
            throw new ExceptionAPI(erro);
        }

        const sqlUpdate = (
            `UPDATE usuarios SET senha = SHA2('${senha.toString()}', 224) WHERE NI = '${NI}'`
        );

        const resUpdate = await query(sqlUpdate, 'usuarios', 'update');
        if (!resUpdate.ok) throw new ExceptionAPI(resUpdate.resposta);

        return res.status(201).send(resUpdate.resposta);
    } catch (erro) {
        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
}