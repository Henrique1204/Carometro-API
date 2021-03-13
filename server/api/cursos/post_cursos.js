const dbCon = require('../../db.js');

module.exports = (req, res) => {
    try {
        const { nome, periodo } = req.body;

        if (!nome || !periodo ) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const consulta = (
            `INSERT INTO cursos (id, nome, periodo) VALUES (null, '${nome}', '${periodo}')`
        );

        dbCon.query(consulta, (erroDB, resDB) => {
            if (erroDB) {
                console.log(erroDB.sqlMessage);
                res.status(502).send({
                    status: 'Falha',
                    messagem: 'Erro ao adicionar dados na tabela cursos.'
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
