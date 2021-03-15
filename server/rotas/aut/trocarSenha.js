const { select, update } = require('../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { NI, senha } = req.body;

        if (!NI || !senha) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new Error(JSON.stringify(erro));
        }

        const consultaSelect = `SELECT * FROM usuarios WHERE NI = '${NI}'`;

        const resSelect = await select(consultaSelect, 'usuarios');
        if (!resSelect.ok) throw new Error(JSON.stringify(resSelect.resposta));

        if (resSelect.resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados inválidos.' };
            throw new Error(JSON.stringify(erro));
        }

        const consultaUpdate = (
            `UPDATE usuarios SET senha = SHA2('${senha.toString()}', 224) WHERE NI = '${NI}'`
        );

        const resUpdate = await update(consultaUpdate, 'usuarios');
        if (!resUpdate.ok) throw new Error(JSON.stringify(resUpdate.resposta));

        res.status(201).send(resUpdate.resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else res.status(cod).send({ status: 'Falha', mensagem });
    }
}