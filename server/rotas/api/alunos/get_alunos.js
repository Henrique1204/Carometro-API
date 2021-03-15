const { selectAlunos } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (id && isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new Error(JSON.stringify(erro));
        }

        const sql = (
            `SELECT a.id, a.nome, a.email, a.telefone, a.data_nascimento, a.foto, t.nome AS turma, 
            t.formado FROM alunos AS a INNER JOIN turmas AS t ON a.id_turma = t.id 
            ${(id) ? `WHERE a.id = ${id}` : ''} ORDER by a.id`
        );

        const { ok, resposta } = await selectAlunos(sql, id);
        if (!ok) throw new Error(JSON.stringify(resposta));

        if (id && resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados não encontrados.' };
            throw new Error(JSON.stringify(erro));
        }

        if (id) return res.status(200).send(resposta[0]);
        return res.status(200).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
