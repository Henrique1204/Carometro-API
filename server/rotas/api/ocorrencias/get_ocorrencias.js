const { select } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE o.id = ${id}` : '';

        const consulta = (
            `SELECT o.id, o.data_criacao, o.titulo, o.conteudo, o.criado_por, alunos.nome AS aluno 
            FROM ocorrencias as o INNER JOIN alunos ON alunos.id = o.id_aluno ${where} ORDER by o.id`
        );

        const { ok, resposta } = await select(consulta, 'ocorrencias');

        if (!ok) throw new Error(JSON.stringify(resposta));

        const dados = resposta.map((ocorrencia) => ({
            ...ocorrencia,
            data_criacao: ocorrencia.data_criacao.toISOString().split('T')[0]
        }));

        res.status(200).send(dados);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else res.status(cod).send({ status: 'Falha', mensagem });
    }
};
