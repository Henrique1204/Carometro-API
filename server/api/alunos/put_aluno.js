const dbCon = require('../../db.js');
const { unlink } = require('fs');

module.exports = (req, res) => {
    try {
        const { nome, email, telefone, id_turma, foto_antiga } = req.body;
        const foto = req.file?.path.replace('\\', '/');
        const { id } = req.params;

        if (!nome || !email || !telefone || !foto || !id_turma || !id || !foto_antiga) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const consulta = (
            `UPDATE alunos SET nome = '${nome}', email = '${email}', telefone = '${telefone}', 
            foto = '${foto}', id_turma = '${id_turma}' WHERE id = ${id}`
        );
    
        dbCon.query(consulta, (erroDB) => {
            if (erroDB) {
                const erro = JSON.stringify({
                    cod: 502,
                    mensagem: 'Erro ao atualizar dados na tabela alunos!'
                });

                throw new Error(erro);
            }

            unlink(foto_antiga, () => {});
    
            console.log(`PUT: Itens atualizados 1\nID: ${id}`);
            res.status(201).send({ status: 'Sucesso', mensagem: 'Dados atualizados com sucesso!' });
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
