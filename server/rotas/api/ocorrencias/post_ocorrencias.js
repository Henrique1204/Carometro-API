const { query } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { titulo, conteudo, criado_por, id_aluno } = req.body;

        if (!titulo || !conteudo || !criado_por || !id_aluno ) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new Error(JSON.stringify(erro));
        }

        if (isNaN(id_aluno)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new Error(JSON.stringify(erro));
        }

        const data = new Date().toISOString().split('T')[0];

        const sql = (
            `INSERT INTO ocorrencias (id, titulo, conteudo, data_criacao, criado_por, id_aluno) VALUES
            (null, '${titulo}', '${conteudo}', '${data}', '${criado_por}', ${id_aluno})`
        );
    
        const { ok, resposta } = await query(sql, 'ocorrencias', 'insert');
        if (!ok) throw new Error(JSON.stringify(resposta));
        return res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
