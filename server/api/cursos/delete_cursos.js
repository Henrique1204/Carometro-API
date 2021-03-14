const { deleteSQL } = require('../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }
    
        const consulta = `DELETE FROM cursos WHERE id = ${id}`; 

        const { ok, resposta } = await deleteSQL(consulta, 'cursos', id);
        if (!ok) throw new Error(JSON.stringify(resposta));

        res.status(201).send(resposta);
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ status: 'Falha', mensagem });
    }
};
