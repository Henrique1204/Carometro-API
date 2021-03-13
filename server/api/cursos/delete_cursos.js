const dbCon = require('../../db.js');

module.exports = (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }
    
        dbCon.query(`DELETE FROM cursos WHERE id = ${id}`, (erroDB, resDB) => {
            if (erroDB) {
                console.log(`ERRO: ${erroDB.sqlMessage}`);
                res.status(502).send({
                    status: 'Falha',
                    mensagem: 'Erro ao remover dados na tabela cursos!'
                });

                return;
            }

            if (resDB.affectedRows === 0) {
                res.status(406).send({
                    status: 'Falha',
                    mensagem: 'Dado informado já foi removido.'
                });
    
                return;
            }

            console.log(`DELETE: Itens removidos 1\nID: ${id}`);
            res.status(201).send({ status: 'Sucesso', mensagem: 'Dados removidos com sucesso!' });
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
