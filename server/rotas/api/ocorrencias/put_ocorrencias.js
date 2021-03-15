const { query } = require('../../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { titulo, conteudo } = req.body;
        const { id } = req.params;

        if (!titulo || !conteudo || !id) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new Error(JSON.stringify(erro));
        }

        if (isNaN(id)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new Error(JSON.stringify(erro));
        }

        const sqlSelect = `SELECT * FROM ocorrencias WHERE id = '${id}'`;
        const resSelect = await query(sqlSelect, { tabela: 'ocorrencias', tipo: 'buscar' });
        if (!resSelect.ok) throw new Error(JSON.stringify(resSelect.resposta));

        if (resSelect.resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Ocorrência informada não existe.' };
            throw new Error(JSON.stringify(erro));
        }

        const sqlUpdate = (
            `UPDATE ocorrencias SET titulo = '${titulo}', conteudo = '${conteudo}' 
            WHERE id = ${id}`
        );
    
        const resUpdate = await query(sqlUpdate, { tablea: 'ocorrencias', tipo: 'atualizar' });
        if (!resUpdate.ok) throw new Error(JSON.stringify(resUpdate.resposta));
        return res.status(201).send(resUpdate.resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
