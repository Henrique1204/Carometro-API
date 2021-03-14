const { select, selectAlunos } = require('../../db/consultas.js');

const filtrarAlunos = (lista, id) => {
    const listaFiltrada = lista.filter(({ id_turma }) => id_turma === id);
    const listaFormatada = listaFiltrada.map((item) => ({
        id: item.id,
        nome: item.nome,
        email: item.email,
        telefone: item.telefone,
        data_nascimento: item.data_nascimento,
        foto: item.foto,
        ocorrencias: item.ocorrencias
    }));

    return listaFormatada;
};

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
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: "Falha", mensagem });
    }
};
