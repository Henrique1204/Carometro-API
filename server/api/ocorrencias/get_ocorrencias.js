const dbCon = require('../../db.js');

module.exports = (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE o.id = ${id}` : '';

        const consulta = (
            `SELECT o.id, o.data_criacao, o.titulo, o.conteudo, o.criado_por, alunos.nome AS aluno 
            FROM ocorrencias as o INNER JOIN alunos ON alunos.id = o.id_aluno ${where} ORDER by o.id`
        );

        dbCon.query(consulta, (erroOcorrencias, ocorrencias) => {
            if (erroOcorrencias) {
                const erro = JSON.stringify({
                    cod: 502,
                    messagem: 'Erro ao buscar por dados na tabela ocorrencias.'
                });

                throw new Error(erro);
            }

            console.log(`GET: Itens buscados ${ocorrencias.length}`);
            res.status(200).send(ocorrencias);
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: "Falha", mensagem });
    }
};
