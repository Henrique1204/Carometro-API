const { query, selectAlunos } = require('../../../db/consultas.js');
const { filtrarAlunos } = require('../../../util/filtros.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (id && isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new Error(JSON.stringify(erro));
        }

        const sqlTurmas = (
            `SELECT t.id, t.nome, t.formado, c.nome AS curso, c.periodo FROM turmas AS t 
            INNER JOIN cursos AS c ON t.id_curso = c.id ${(id) ? `WHERE t.id = ${id}` : ''} 
            ORDER BY t.id`
        );

        const resTurmas = await query(sqlTurmas, { tabela: 'turmas', tipo: 'buscar' });
        if (!resTurmas.ok) throw new Error(JSON.stringify(resTurmas.resposta));

        if (id && resTurmas.resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados não encontrados.' };
            throw new Error(JSON.stringify(erro));
        }

        const sqlAlunos = `SELECT * FROM alunos ${(id) ? `WHERE id_turma = ${id}` : ''}`;
        const resAlunos = await selectAlunos(sqlAlunos, id);
        if (!resAlunos.ok) throw new Error(JSON.stringify(resAlunos.resposta));
        
        const dados = resTurmas.resposta.map((turma) => ({
            ...turma,
            formado: turma.formado === 1,
            alunos: filtrarAlunos(resAlunos.resposta, turma.id)
        }));

        if (id) return res.status(200).send(dados[0]);
        return res.status(200).send(dados);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
