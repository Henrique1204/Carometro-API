const dbCon = require('../db.js');

module.exports = (req, res) => {
    try {
        const { nome, email, telefone, data_nascimento, id_turma } = req.body;
        const foto = req.file?.path.replace('\\', '/');

        if (!nome || !email || !telefone || !data_nascimento || !foto || !id_turma ) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const consulta = (
            `INSERT INTO alunos (id, nome, email, telefone, data_nascimento, foto, id_turma) VALUES
            (null, '${nome}', '${email}', '${telefone}', '${data_nascimento}', '${foto}', '${id_turma}')`
        );
    
        dbCon.query(consulta, (erroDB, resDB) => {
            if (erroDB) {
                const erro = JSON.stringify({
                    cod: 502,
                    mensagem: 'Erro ao inserir dados na tabela alunos!'
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
