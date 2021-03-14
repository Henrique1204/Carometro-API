const { putAlunos } = require('../../db/consultas.js');

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
    
        const { ok, resposta } = await putAlunos(consulta, foto_antiga);

        if (!ok) throw new Error(JSON.stringify(resposta));

        res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
