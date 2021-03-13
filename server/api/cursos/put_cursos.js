const dbCon = require('../../db.js');

module.exports = (req, res) => {
    try {
        const { nome, periodo } = req.body;
        const { id } = req.params;

        if (!nome || !periodo || !id) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const consulta = (
            `UPDATE cursos SET nome = '${nome}', periodo = '${periodo}' WHERE id = ${id}`
        );
    
        dbCon.query(consulta, (erroDB) => {
            if (erroDB) {
                const erro = JSON.stringify({
                    cod: 502,
                    mensagem: 'Erro ao atualizar dados na tabela cursos!'
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
