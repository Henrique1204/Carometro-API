const conexaoDB = require('../../db/conexao.js');

module.exports = (req, res) => {
    try {
        const { id } = req.params;
        const where = (id) ? `WHERE id = ${id}` : '';

        conexaoDB.query(`SELECT * FROM cursos ${where} ORDER BY id`, (erroDB, cursos) => {
            if (erroDB) {
                console.log(erroDB.sqlMessage);
                res.status(502).send({
                    status: 'Falha',
                    messagem: 'Erro ao buscar por dados na tabela cursos.'
                });

                return;
            }

            console.log(`GET: Itens buscados ${cursos.length}`);
            res.status(200).send(cursos);
        });
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: "Falha", mensagem });
    }
};
