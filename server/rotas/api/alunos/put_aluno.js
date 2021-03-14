const { select, update } = require('../../../db/consultas.js');
const { unlink } = require('fs');

module.exports = async (req, res) => {
    try {
        const { nome, email, telefone, id_turma } = req.body;
        const foto = req.file?.path.replace('\\', '/');
        const { id } = req.params;

        if (!nome || !email || !telefone || !foto || !id_turma || !id) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        if (isNaN(id_turma)) {
            const erro = JSON.stringify({ cod: 406, mensagem: "Dados inválidos!" });
            throw new Error(erro);
        }

        const consultaSelect = `SELECT foto FROM alunos WHERE id = ${id}`;

        const consultaUpdate = (
            `UPDATE alunos SET nome = '${nome}', email = '${email}', telefone = '${telefone}', 
            foto = '${foto}', id_turma = '${id_turma}' WHERE id = ${id}`
        );
    
        const resSelect = await select(consultaSelect, 'alunos');
        if (!resSelect.ok) throw new Error(JSON.stringify(resSelect.resposta));

        const resUpdate = await update(consultaUpdate, 'alunos', id);
        if (!resUpdate.ok) throw new Error(JSON.stringify(resUpdate.resposta));

        unlink(resSelect.resposta[0].foto, () => {});
        res.status(201).send(resUpdate.resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else res.status(cod).send({ status: 'Falha', mensagem });
    }
};
