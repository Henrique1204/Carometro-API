const { query } = require('../../../db/consultas.js');
const moverArquivo = require('../../../util/moverArquivo.js');
const { unlink } = require('fs');
const ExceptionAPI = require('../../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    let foto;

    try {
        const { nome, email, telefone, data_nascimento, id_turma } = req.body;
        foto = req.file?.path.replace('\\', '/');

        if (!nome || !email || !telefone || !data_nascimento || !foto || !id_turma ) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new ExceptionAPI(erro);
        }

        if (isNaN(id_turma)) {
            const erro = { cod: 406, mensagem: 'Dados inválidos!' };
            throw new ExceptionAPI(erro);
        }

        const sqlSelect = `SELECT * FROM alunos WHERE email = '${email}'`;
        const resSelect = await query(sqlSelect, 'alunos', 'select' );
        if (!resSelect.ok) throw new ExceptionAPI(resSelect.resposta);

        if (resSelect.resposta.length !== 0) {
            const erro = { cod: 422, mensagem: 'Aluno já existe!' };
            throw new ExceptionAPI(erro);
        }

        const sqlTurma = (
            `SELECT t.nome FROM alunos INNER JOIN turmas as t ON alunos.id_turma = t.id`
        );

        const resTurma = await query(sqlTurma, 'turmas', 'select');
        if (!resTurma.ok) throw new ExceptionAPI(resTurma.resposta);

        const arquivo = await moverArquivo(resTurma.resposta[0].nome, foto);
        foto = arquivo.foto;

        const sqlInsert = (
            `INSERT INTO alunos (id, nome, email, telefone, data_nascimento, foto, id_turma) VALUES
            (null, '${nome}', '${email}', '${telefone}', '${data_nascimento}', '${foto}', '${id_turma}')`
        );

        const resInsert = await query(sqlInsert, 'alunos', 'insert');
        if (!resInsert.ok) throw new ExceptionAPI(resInsert.resposta);

        return res.status(201).send(resInsert.resposta);
    } catch (erro) {
        if (foto) unlink(foto, () => {});

        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
};
