const { query } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { nome } = req.body;
        const { id } = req.params;

        if (!nome || !id) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new Error(JSON.stringify(erro));
        }

        if (isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new Error(JSON.stringify(erro));
        }

        const sqlSelect = `SELECT * FROM turmas WHERE id = '${id}'`;
        const resSelect = await query(sqlSelect, { tabela: 'turmas', tipo: 'buscar' });
        if (!resSelect.ok) throw new Error(JSON.stringify(resSelect.resposta));

        if (resSelect.resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Turma informada não existe.' };
            throw new Error(JSON.stringify(erro));
        }

        const sqlUpdate = `UPDATE turmas SET nome = '${nome}' WHERE id = ${id}`;    
        const resUpdate = await query(sqlUpdate, { tabela: 'turmas', tipo: 'atualizar' });
        if (!resUpdate.ok) throw new Error(JSON.stringify(resUpdate.resposta));

        return res.status(201).send(resUpdate.resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
