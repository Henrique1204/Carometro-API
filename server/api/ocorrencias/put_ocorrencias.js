const dbCon = require('../../db.js');

module.exports = (req, res) => {
    try {
        const { titulo, conteudo, criado_por, id_aluno } = req.body;
        const { id } = req.params;

        if (!titulo || !conteudo || !criado_por || !id_aluno || !id) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const consulta = (
            `UPDATE ocorrencias SET titulo = '${titulo}', conteudo = '${conteudo}', criado_por = '${criado_por}', 
            id_aluno = '${id_aluno}' WHERE id = ${id}`
        );
    
        dbCon.query(consulta, (erroDB) => {
            if (erroDB) {
                const erro = JSON.stringify({
                    cod: 502,
                    mensagem: 'Erro ao atualizar dados na tabela ocorrencias!'
                });

                throw new Error(erro);
            }
    
            console.log(`PUT: Itens atualizados 1\nID: ${id}`);
            res.status(201).send({ status: 'Sucesso', mensagem: 'Dados atualizados com sucesso!' });
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
