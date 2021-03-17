const { query } = require('../../../db/consultas.js');
const ExceptionAPI = require('../../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    try {
        const { titulo, conteudo } = req.body;
        const { id } = req.params;

        if (!titulo || !conteudo || !id) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new ExceptionAPI(erro);
        }

        if (isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new ExceptionAPI(erro);
        }

        const sql = (
            `UPDATE ocorrencias SET titulo = '${titulo}', conteudo = '${conteudo}' 
            WHERE id = ${id}`
        );
    
        const { ok, resposta }  = await query(sql, 'ocorrencias', 'update');
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
