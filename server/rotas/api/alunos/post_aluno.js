const { query, select, insert } = require('../../../db/consultas.js');
const moverArquivo = require('../../../util/moverArquivo.js');
const { unlink } = require('fs');

module.exports = async (req, res) => {
    let foto;

    try {
        const { nome, email, telefone, data_nascimento, id_turma } = req.body;
        foto = req.file?.path.replace('\\', '/');

        if (!nome || !email || !telefone || !data_nascimento || !foto || !id_turma ) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new Error(JSON.stringify(erro));
        }

        if (isNaN(id_turma)) {
            const erro = { cod: 406, mensagem: "Dados inválidos!" };
            throw new Error(JSON.stringify(erro));
        }

        const sqlSelect = `SELECT * FROM alunos WHERE email = '${email}'`;

        const resSelect = await query(sqlSelect, { tabela: 'alunos', tipo: 'buscar' });
        if (!resSelect.ok) throw new Error(JSON.stringify(resSelect.resposta));

        if (resSelect.resposta.length !== 0) {
            const erro = { cod: 422, mensagem: 'Aluno já existe!' };
            throw new Error(JSON.stringify(erro));
        }

        const sqlTurma = (
            `SELECT t.nome FROM alunos INNER JOIN turmas as t ON alunos.id_turma = t.id`
        );

        const resTurma = await query(sqlTurma, { tabela: 'turmas', tipo: 'buscar' });
        if (!resTurma.ok) throw new Error(JSON.stringify(resTurma.resposta));

        const arquivo = await moverArquivo(resTurma.resposta[0].nome, foto);
        foto = arquivo.foto;

        const sqlInsert = (
            `INSERT INTO alunos (id, nome, email, telefone, data_nascimento, foto, id_turma) VALUES
            (null, '${nome}', '${email}', '${telefone}', '${data_nascimento}', '${foto}', '${id_turma}')`
        );

        const resInsert = await query(sqlInsert, { tablea: 'alunos', tipo: 'adicionar' });
        if (!resInsert.ok) throw new Error(JSON.stringify(resInsert.resposta));

        return res.status(201).send(resInsert.resposta);
    } catch ({ message }) {
        unlink(foto, () => {});
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else return res.status(cod).send({ status: 'Falha', mensagem });
    }
};
