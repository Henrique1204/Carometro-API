const dbCon = require('../../db.js');

const filtrarOcorrencias = (lista, id) => {
    const listaFiltrada = lista.filter(({ id_aluno }) => id_aluno === id);
    const listaFormatada = listaFiltrada.map(({ data_criacao, titulo, conteudo, criado_por }) => ({
        data_criacao,
        titulo,
        conteudo,
        criado_por
    }));

    return listaFormatada;
};

const filtrarAlunos = (lista, id) => {
    const listaFiltrada = lista.filter(({ id_turma }) => id_turma === id);
    const listaFormatada = listaFiltrada.map((item) => ({
        nome: item.nome,
        email: item.email,
        telefone: item.telefone,
        data_nascimento: item.data_nascimento,
        foto: item.foto,
        ocorrencias: item.ocorrencias
    }));

    return listaFormatada;
};

module.exports = (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE t.id = ${id}` : '';

        const consulta = (
            `SELECT t.id, t.nome, t.formado, c.nome AS curso, c.periodo FROM turmas AS t 
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

                dbCon.query('SELECT * FROM ocorrencias', (erroOcorrencias, ocorrencias) => {
                    if (erroOcorrencias) {
                        console.log(erroOcorrencias.sqlMessage);
                        res.status(502).send({
                            status: 'Falha',
                            messagem: 'Erro ao buscar por dados na tabela ocorrencias.'
                        });
        
                        return;
                    }

                    const dadosAlunos = alunos.map((aluno) => ({
                        ...aluno,
                        data_nascimento: aluno.data_nascimento.toISOString().split('T')[0],
                        ocorrencias: filtrarOcorrencias(ocorrencias, aluno.id)
                    }));
                    
                    const dadosTurmas = turmas.map((turma) => ({
                        ...turma,
                        formado: turma.formado === 1,
                        alunos: filtrarAlunos(dadosAlunos, turma.id)
                    }));
    
                    console.log(`GET: Itens buscados ${dadosTurmas.length}`);
                    res.status(200).send(dadosTurmas);
                });
            });
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: "Falha", mensagem });
    }
};
