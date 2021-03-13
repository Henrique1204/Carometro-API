const dbCon = require('../../db.js');

const filtrarOcorrencias = (lista, id) => {
    const listaFiltrada = lista.filter(({ id_aluno }) => id_aluno === id);
    const listaFormatada = listaFiltrada.map(({ data_criacao, titulo, conteudo, criado_por }) => ({
        data_criacao,
        titulo,
        conteudo,
        criado_por
    }));

    return listaFormatada
};

module.exports = (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE a.id = ${id}` : '';

        const consulta = (
            `SELECT a.id, a.nome, a.email, a.telefone, a.data_nascimento, a.foto, t.nome AS turma, t.formado  
            FROM alunos AS a INNER JOIN turmas AS t ON a.id_turma = t.id ${where} ORDER by a.id`
        );

        dbCon.query(consulta, (erroAlunos, alunos) => {
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
                
                const dados = alunos.map((aluno) => ({
                    ...aluno,
                    data_nascimento: aluno.data_nascimento.toISOString().split('T')[0],
                    ocorrencias: filtrarOcorrencias(ocorrencias, aluno.id)
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
