const { query } = require('../../../db/consultas.js');
const ExceptionAPI = require('../../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    try {
        const { titulo, conteudo, criado_por, id_aluno } = req.body;

        if (!titulo || !conteudo || !criado_por || !id_aluno ) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new ExceptionAPI(erro);
        }

        if (isNaN(id_aluno)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new ExceptionAPI(erro);
        }

        const data = new Date().toISOString().split('T')[0];

        const sql = (
            `INSERT INTO ocorrencias (id, titulo, conteudo, data_criacao, criado_por, id_aluno) VALUES
            (null, '${titulo}', '${conteudo}', '${data}', '${criado_por}', ${id_aluno})`
        );
    
        const { ok, resposta } = await query(sql, 'ocorrencias', 'insert');
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
