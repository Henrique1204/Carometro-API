const { deleteAlunos } = require('../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { foto_antiga } = req.body;
        const { id } = req.params;

        if (!id || !foto_antiga) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        const { ok, resposta } = await deleteAlunos(
            `DELETE FROM alunos WHERE id = ${id}`,
            foto_antiga,
            id
        );

        if (!ok) throw new Error(JSON.stringify(resposta));

        res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
