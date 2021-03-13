const dbCon = require('../../db.js');

module.exports = (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE id = ${id}` : '';

        dbCon.query(`SELECT * FROM cursos ${where} ORDER BY id`, (erroDB, cursos) => {
            if (erroDB) {
                const erro = JSON.stringify({
                    cod: 502,
                    messagem: 'Erro ao buscar por dados na tabela cursos.'
                });

                throw new Error(erro);
            }

            console.log(`GET: Itens buscados ${cursos.length}`);
            res.status(200).send(cursos);
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: "Falha", mensagem });
    }
};
