// Importando Exception personalizada para tratamento de erros.
const ExceptionAPI = require('../../../util/ExceptionAPI.js');
// Importando método para realizar consultas no banco de dados.
const { query } = require('../../../db/consultas.js');
// Importando método para remover arquivos.
const { unlink } = require('fs');
// Importando método que move arquivos.
const moverArquivo = require('../../../util/moverArquivo.js');

// Exportando função para rota da API.
module.exports = async (req, res) => {
    // Variável que irá guardar as informações da foto.
    let foto;

    // Abrindo bloco de teste.
    try {
        // ## VALIDAÇÃO DE ENTRADA - INICIO
        // Extraindo a propriedade id do objeto params da requisição.
        const { id } = req.params;
        // Extraindo dados da requisição que foram passados no body.
        const { nome, email, telefone, id_turma } = req.body;
        // Definindo o valor da variável fotos com o caminho do arquivo passado na requisição
        foto = req.file?.path.replace('\\', '/');

        // Testando se os dados passados na requisição estão vazios e lança uma exceção.
        if (!nome || !email || !telefone || !foto || !id_turma) throw new ExceptionAPI(400);

        // Testando se os ids informados não são números e lança uma exceção.
        if (isNaN(id_turma) || isNaN(id)) throw new ExceptionAPI(406);
        // ## VALIDAÇÃO DE ENTRADA - FIM

        // ## BUSCANDO INFORMAÇÕES PARA MANIPULAR FOTO E VALIDAR EMAIL - INICIO
        // Define o sql que deverá ser passado na consulta para buscar por emails e foto de alunos.
        const sqlFoto = `SELECT foto, email FROM alunos WHERE id = ${id}`;
        // Executa uma consulta no banco de dados.
        const resFoto = await query(sqlFoto, 'alunos', 'select');

        // Testa se a consulta não foi ok e lança uma exceção.
        if (!resFoto.ok) throw new ExceptionAPI(406);

        // Testando se houve resposta para consulta no banco de dados e lança uma exceção.
        if (resFoto.resposta.length === 0) throw new ExceptionAPI(404);

        // Define o sql que deverá ser passado na consulta para buscar por aluno com igual igual.
        const sqlEmail = `SELECT * FROM alunos WHERE email = '${email}'`;
        // Executa uma consulta no banco de dados.
        const resEmail = await query(sqlEmail, 'alunos', 'select');

        // Testando se o e-mail é igual a algum outro aluno já inserido.
        if (resEmail.ok && resEmail.resposta.length !== 0 && resFoto.resposta[0].email !== email) {
            // Lançando uma exceção.
            throw new ExceptionAPI(422, { mensagem: 'E-mail pertence a outro aluno.' });
        }
        // ## BUSCANDO INFORMAÇÕES PARA MANIPULAR FOTO E VALIDAR EMAIL - INICIO

        // ## DEFININDO PASTA ONDE A FOTO SERÁ GUARDADA - INICIO
        // Define o sql que deverá ser passado na consulta para buscar o nome da turma.
        const sqlTurma = (
            `SELECT t.nome FROM alunos INNER JOIN turmas as t 
            ON alunos.id_turma = t.id WHERE id_turma = ${id_turma}`
        );
        // Executa uma consulta no banco de dados.
        const resTurma = await query(sqlTurma, 'turmas', 'select');

        // Testa se a resposta da consulta foi ok.
        if (resTurma.ok && resTurma.resposta.length !==0) {
            // Move o arquivo e recebe o caminho para onde o arquivo foi movido.
            const arquivo = await moverArquivo(resTurma.resposta[0].nome, foto);
            // Definindo o valor da variável fotos com o caminho do arquivo movido.
            foto = arquivo.foto;
        }
        // ## DEFININDO PASTA ONDE A FOTO SERÁ GUARDADA - FIM

        // ## ATUALIZANDO ALUNO NO BANCO DE DADOS - INICIO
        // Define o sql que deverá ser passado na consulta para atualizar aluno.
        const sqlUpdate = (
            `UPDATE alunos SET nome = '${nome}', email = '${email}', telefone = '${telefone}', 
            foto = '${foto}', id_turma = '${id_turma}' WHERE id = ${id}`
        );
        // Executa uma consulta no banco de dados.
        const resUpdate = await query(sqlUpdate, 'alunos', 'update');
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!resUpdate.ok) throw new ExceptionAPI(null, resUpdate.resposta);

        // Remove a foto antiga do usuário.
        unlink(resFoto.resposta[0].foto, () => {});
        // ## ATUALIZANDO ALUNO NO BANCO DE DADOS - FIM

        // Retorna a resposta de sucesso do servidor.
        return res.status(201).send(resUpdate.resposta);

    // Fechando bloco de teste e abrindo bloco de captura de exceções.
    } catch (erro) {
        // Testa se existe algum caminho dentro de foto e remove o arquivo caso tenha.
        if (foto) unlink(foto, () => {});

        // Testa se o tipo da exceção é o nosso tipo personalizado.
        if (erro.tipo === 'API') {
            // Extraindo as informações de dentro do objeto de exceção.
            const { cod, mensagem, erroSQL } = erro;

            // Testa se houve erro com o sql e retorna a resposta de falha do servidor.
            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            // Retorna a resposta de falha do servidor.
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        // Retorna a resposta de falha do servidor.
        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
};
