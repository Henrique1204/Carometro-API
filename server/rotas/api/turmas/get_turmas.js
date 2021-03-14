const { select, selectAlunos } = require('../../../db/consultas.js');
const { filtrarAlunos } = require('../../../util/filtros.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        const consultaTurmas = (
            `SELECT t.id, t.nome, t.formado, c.nome AS curso, c.periodo FROM turmas AS t 
            INNER JOIN cursos AS c ON t.id_curso = c.id ${(id) ? `WHERE t.id = ${id}` : ''} 
            ORDER BY t.id`
        );

        const consultaAlunos = (
            `SELECT * FROM alunos ${(id) ? `WHERE id_turma = ${id}` : ''}`
        );

        const resTurmas = await select(consultaTurmas, 'turmas');
        if (!resTurmas.ok) throw new Error(JSON.stringify(resTurmas.resposta));

        const resAlunos = await selectAlunos(consultaAlunos, id);
        if (!resAlunos.ok) throw new Error(JSON.stringify(resAlunos.resposta));
        
        const dados = resTurmas.resposta.map((turma) => ({
            ...turma,
            formado: turma.formado === 1,
            alunos: filtrarAlunos(resAlunos.resposta, turma.id)
        }));

        res.status(200).send(dados);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else res.status(cod).send({ status: 'Falha', mensagem });
    }
};
