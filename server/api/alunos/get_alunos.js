const { selectAlunos } = require('../../db.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE a.id = ${id}` : '';

        const consulta = (
            `SELECT a.id, a.nome, a.email, a.telefone, a.data_nascimento, a.foto, t.nome AS turma, t.formado  
            FROM alunos AS a INNER JOIN turmas AS t ON a.id_turma = t.id ${where} ORDER by a.id`
        );

        const { ok, resposta } = await selectAlunos(consulta);

        if (!ok) throw new Error(JSON.stringify(resposta));

        res.status(200).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: "Falha", mensagem });
    }
};
