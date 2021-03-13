const dbCon = require('../../db.js');

const filtrarAlunos = (lista, id) => {
    const listaFiltrada = lista.filter(({ id_turma }) => id_turma === id);
    const listaFormatada = listaFiltrada.map(({ nome, email, telefone, data_nascimento }) => ({
        nome,
        email,
        telefone,
        data_nascimento: data_nascimento.toISOString().split('T')[0],
    }));

    return listaFormatada;
};

module.exports = (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE t.id = ${id}` : '';

        const consulta = (
            `SELECT t.id, t.nome, c.nome AS curso, c.periodo FROM turmas AS t 
            INNER JOIN cursos AS c ON t.id_curso = c.id ${where} ORDER BY t.id`
        );

        dbCon.query(consulta, (erroTurmas, turmas) => {
            if (erroTurmas) {
                console.log(erroTurmas.sqlMessage);
                res.status(502).send({
                    status: 'Falha',
                    messagem: 'Erro ao buscar por dados na tabela turmas.'
                });

                return;
            }

            dbCon.query('SELECT * FROM alunos', (erroAlunos, alunos) => {
                if (erroAlunos) {
                    console.log(erroAlunos.sqlMessage);
                    res.status(502).send({
                        status: 'Falha',
                        messagem: 'Erro ao buscar por dados na tabela alunos.'
                    });
    
                    return;
                }
                
                const dados = turmas.map((turma) => ({
                    ...turma,
                    alunos: filtrarAlunos(alunos, turma.id)
                }));

                console.log(`GET: Itens buscados ${dados.length}`);
                res.status(200).send(dados);
            });
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: "Falha", mensagem });
    }
};
