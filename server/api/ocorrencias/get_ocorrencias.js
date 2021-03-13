const dbCon = require('../../db.js');

module.exports = (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE id = ${id}` : '';

        dbCon.query(`SELECT * FROM ocorrencias ${where}`, (erroOcorrencias, ocorrencias) => {
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
