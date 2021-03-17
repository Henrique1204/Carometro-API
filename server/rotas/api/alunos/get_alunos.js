const { selectAlunos } = require('../../../db/consultas.js');
const ExceptionAPI = require('../../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (id && isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new ExceptionAPI(erro);
        }

        const sql = (
            `SELECT a.id, a.nome, a.email, a.telefone, a.data_nascimento, a.foto, t.nome AS turma, 
            t.formado FROM alunos AS a INNER JOIN turmas AS t ON a.id_turma = t.id 
            ${(id) ? `WHERE a.id = ${id}` : ''} ORDER by a.id`
        );

        const { ok, resposta } = await selectAlunos(sql, id);
        if (!ok) throw new ExceptionAPI(resposta);

        if (id && resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados não encontrados.' };
            throw new ExceptionAPI(erro);
        }

        if (id) return res.status(200).send(resposta[0]);
        return res.status(200).send(resposta);
    } catch (erro) {
        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
};
