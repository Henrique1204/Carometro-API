const conexaoDB = require('../../db/conexao.js');

module.exports = (req, res) => {
    try {
        const { nome, id_curso, formado } = req.body;

        if (!nome || !id_curso || (formado !== 0 && formado !== 1)) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const consulta = (
            `INSERT INTO turmas (id, nome, id_curso, formado) 
            VALUES (null, '${nome}', '${id_curso}', ${formado})`
        );

        conexaoDB.query(consulta, (erroDB, resDB) => {
            if (erroDB) {
                console.log(erroDB.sqlMessage);
                res.status(502).send({
                    status: 'Falha',
                    messagem: 'Erro ao adicionar dados na tabela turmas.'
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
