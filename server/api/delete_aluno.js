const dbCon = require('../db.js');
const { unlink } = require('fs');

module.exports = (req, res) => {
    try {
        const { foto_antiga } = req.body;
        const { id } = req.params;

        if (!id || !foto_antiga) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }
    
        dbCon.query(`DELETE FROM alunos WHERE id = ${id}`, (erroAlunos) => {
            if (erroAlunos) {
                const erro = JSON.stringify({
                    cod: 502,
                    mensagem: 'Erro ao remover dados na tabela alunos!'
                });

                throw new Error(erro);
            }

            unlink(foto_antiga, () => {});

            dbCon.query(`DELETE FROM ocorrencias WHERE id_aluno = ${id}`, (erroOcorrencias) => {
                if (erroOcorrencias) {
                    const erro = JSON.stringify({
                        cod: 502,
                        mensagem: 'Erro ao remover dados na tabela ocorrencias!'
                    });
    
                    throw new Error(erro);
                }

                console.log(`DELETE: Itens removidos 1\nID: ${id}`);
                res.status(201).send({ status: 'Sucesso', mensagem: 'Dados removidos com sucesso!' });
            });
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
