const { select, insert } = require('../../db/consultas.js');

module.exports = async (req, res) => {
    try {
        const { NI, nome, senha, isAdmin } = req.body;

        if (!NI || !nome || !senha) {
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        if (isAdmin !== 0 && isAdmin !== 1) {
            const erro = JSON.stringify({ cod: 406, mensagem: "Defina o nível de permissões corretamente!" });
            throw new Error(erro);
        }

        const consultaSelect = (
            `SELECT * FROM usuarios WHERE NI = '${NI}'`
        );

        const resSelect = await select(consultaSelect, 'usuarios');
        if (!resSelect.ok) throw new Error(JSON.stringify(resSelect.resposta));

        if (resSelect.resposta.length !== 0) {
            const erro = { cod: 422, mensagem: 'Usuário já existe!' };
            throw new Error(JSON.stringify(erro));
        }

        const consultInsert = (
            `INSERT INTO usuarios (id, NI, nome, senha, isAdmin) VALUES 
            (null, '${NI}', '${nome}', SHA2('${senha.toString()}', 224), ${isAdmin})`
        );

        const resInsert = await insert(consultInsert, 'usuarios');
        if (!resInsert.ok) throw new Error(JSON.stringify(resInsert.resposta));

        res.status(201).send(resInsert.resposta);
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else res.status(cod).send({ status: 'Falha', mensagem });
    }
};
