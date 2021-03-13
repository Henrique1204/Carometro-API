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
                const erro = JSON.stringify({
                    cod: 502,
                    mensagem: 'Erro ao inserir dados na tabela cursos!'
                });

                throw new Error(erro);
            }
    
            console.log(`POST: Itens adicionandos 1\nID: ${resDB.insertId}`);
            res.status(201).send({ status: 'Sucesso', mensagem: 'Dados adicionados com sucesso!' });
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
