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
        // Extraindo dados da requisição que foram passados no body.
        const { nome, email, telefone, data_nascimento, id_turma } = req.body;
        // Definindo o valor da variável fotos com o caminho do arquivo passado na requisição.
        foto = req.file?.path.replace('\\', '/');

        // Testando se os dados passados na requisição estão vazios.
        if (!nome || !email || !telefone || !data_nascimento || !foto || !id_turma ) {
            // Lançando uma exceção.
            throw new ExceptionAPI(400);
        }

        // Testando se o id_turma informado não é número e lançando uma exceção.
        if (isNaN(id_turma)) throw new ExceptionAPI(406);
        // ## VALIDAÇÃO DE ENTRADA - FIM

        // ## VALIDANDO SE ALUNO JÁ EXISTE - INICIO
        // Define o sql que deverá ser passado na consulta para buscar por emails de alunos.
        const sqlEmail = `SELECT * FROM alunos WHERE email = '${email}'`;
        // Executa uma consulta no banco de dados e guarda a resposta.
        const resEmail = await query(sqlEmail, 'alunos', 'select' );

        // Testa se a consulta não foi ok e lançando uma exceção.
        if (!resEmail.ok) throw new ExceptionAPI(406);

        // Testando se houve resposta para consulta no banco de dados e lançando uma exceção.
        if (resEmail.resposta.length !== 0) {
            throw new ExceptionAPI(422, { mensagem: 'Aluno já cadastrado.' });
        }
        // ## VALIDANDO SE ALUNO JÁ EXISTE - FIM

        // ## DEFININDO PASTA ONDE A FOTO SERÁ GUARDADA - INICIO
        // Define o sql que deverá ser passado na consulta para buscar o nome da turma.
        const sqlTurma = (
            `SELECT t.nome FROM alunos INNER JOIN turmas as t ON alunos.id_turma = t.id`
        );

        // Executa uma consulta no banco de dados e guarda a resposta.
        const resTurma = await query(sqlTurma, 'turmas', 'select');

        // Testa se a resposta da consulta foi ok.
        if (resTurma.ok) {
            // Move o arquivo e recebe o caminho para onde o arquivo foi movido.
            const arquivo = await moverArquivo(resTurma.resposta[0].nome, foto);
            // Definindo o valor da variável fotos com o caminho do arquivo movido.
            foto = arquivo.foto;
        }
        // ## DEFININDO PASTA ONDE A FOTO SERÁ GUARDADA - FIM

        // ## INSERINDO ALUNO NO BANCO DE DADOS - INICIO
        // Define o sql que deverá ser passado na consulta para inserir o novo aluno.
        const sqlInsert = (
            `INSERT INTO alunos (id, nome, email, telefone, data_nascimento, foto, id_turma) VALUES
            (null, '${nome}', '${email}', '${telefone}', '${data_nascimento}', '${foto}', '${id_turma}')`
        );

        // Executa uma consulta no banco de dados e guarda a resposta.
        const resInsert = await query(sqlInsert, 'alunos', 'insert');
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!resInsert.ok) throw new ExceptionAPI(null, resInsert.resposta);
        // ## INSERINDO ALUNO NO BANCO DE DADOS - FIM

        // Retorna a resposta de sucesso do servidor.
        return res.status(201).send(resInsert.resposta);

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
