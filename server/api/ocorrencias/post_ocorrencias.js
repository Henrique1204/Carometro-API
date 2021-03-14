const { insert } = require('../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { titulo, conteudo, criado_por, id_aluno } = req.body;

        if (!titulo || !conteudo || !criado_por || !id_aluno ) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const data = new Date().toISOString().split('T')[0];

        const consulta = (
            `INSERT INTO ocorrencias (id, titulo, conteudo, data_criacao, criado_por, id_aluno) VALUES
            (null, '${titulo}', '${conteudo}', '${data}', '${criado_por}', ${id_aluno})`
        );
    
        const { ok, resposta } = await insert(consulta, 'ocorrencias');

        if (!ok) throw new Error(JSON.stringify(resposta));

        res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
