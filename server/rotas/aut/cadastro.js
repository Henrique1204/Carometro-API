const { query } = require('../../db/consultas.js');
const ExceptionAPI = require('../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    try {
        const { NI, nome, senha, isAdmin } = req.body;

        if (!NI || !nome || !senha) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new ExceptionAPI(erro);
        }

        if (isAdmin !== 0 && isAdmin !== 1) {
            const erro = { cod: 406, mensagem: "Defina o nível de permissões corretamente!" };
            throw new ExceptionAPI(erro);
        }

        const sqlSelect = `SELECT * FROM usuarios WHERE NI = '${NI}'`;
        const resSelect = await query(sqlSelect, 'usuarios', 'select');
        if (!resSelect.ok) throw new ExceptionAPI(resSelect.resposta);

        if (resSelect.resposta.length !== 0) {
            const erro = { cod: 422, mensagem: 'Usuário já existe!' };
            throw new ExceptionAPI(erro);
        }

        const sqlInsert = (
            `INSERT INTO usuarios (id, NI, nome, senha, isAdmin) VALUES 
            (null, '${NI}', '${nome}', SHA2('${senha.toString()}', 224), ${isAdmin})`
        );

        const resInsert = await query(sqlInsert, 'usuarios', 'insert');
        if (!resInsert.ok) throw new ExceptionAPI(resInsert.resposta);

        return res.status(201).send(resInsert.resposta);
    } catch (erro) {
        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
};
