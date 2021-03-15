const { query } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE o.id = ${id}` : '';

        if (id && isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new Error(JSON.stringify(erro));
        }

        const sql = (
            `SELECT o.id, o.data_criacao, o.titulo, o.conteudo, o.criado_por, alunos.nome AS aluno 
            FROM ocorrencias as o INNER JOIN alunos ON alunos.id = o.id_aluno ${where} ORDER by o.id`
        );

        const { ok, resposta } = await query(sql, 'ocorrencias', 'select');
        if (!ok) throw new Error(JSON.stringify(resposta));

        if (id && resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados não encontrados.' };
            throw new Error(JSON.stringify(erro));
        }

        const dados = resposta.map((ocorrencia) => ({
            ...ocorrencia,
            data_criacao: ocorrencia.data_criacao.toISOString().split('T')[0]
        }));

        if (id) return res.status(200).send(dados[0]);
        return res.status(200).send(dados);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
