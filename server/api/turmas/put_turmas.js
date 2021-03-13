const dbCon = require('../../db.js');

module.exports = (req, res) => {
    try {
        const { nome, formado } = req.body;
        const { id } = req.params;

        if (!nome || (formado !== 0 && formado !== 1) || !id) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const consulta = (
            `UPDATE turmas SET nome = '${nome}', formado = '${formado}' WHERE id = ${id}`
        );
    
        dbCon.query(consulta, (erroDB) => {
            if (erroDB) {
                console.log(erroDB.sqlMessage);
                res.status(502).send({
                    status: 'Falha',
                    messagem: 'Erro ao atualizar dados na tabela turmas.'
                });

                return;
            }
    
            console.log(`PUT: Itens atualizados 1\nID: ${id}`);
            res.status(201).send({ status: 'Sucesso', mensagem: 'Dados atualizados com sucesso!' });
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
