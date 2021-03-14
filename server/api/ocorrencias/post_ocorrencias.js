const conexaoDB = require('../../db/conexao.js');

module.exports = (req, res) => {
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
    
        conexaoDB.query(consulta, (erroDB, resDB) => {
            if (erroDB) {
                console.log(erroDB.sqlMessage);
                res.status(502).send({
                    status: 'Falha',
                    messagem: 'Erro ao adicionar dados na tabela ocorrencias.'
                });

                return;
            }
    
            console.log(`POST: Itens adicionandos 1\nID: ${resDB.insertId}`);
            res.status(201).send({ status: 'Sucesso', mensagem: 'Dados adicionados com sucesso!' });
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
