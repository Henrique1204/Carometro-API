const { update } = require('../../db/consultas.js');
const { unlink } = require('fs');

module.exports = async (req, res) => {
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
    
        const { ok, resposta } = await update(consulta, 'alunos', id);

        if (!ok) throw new Error(JSON.stringify(resposta));

        unlink(foto_antiga, () => {});
        res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else res.status(cod).send({ status: 'Falha', mensagem });
    }
};
