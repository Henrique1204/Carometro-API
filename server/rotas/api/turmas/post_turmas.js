// Importando Exception personalizada para tratamento de erros.
const ExceptionAPI = require('../../../util/ExceptionAPI.js');
// Importando método para realizar consultas no banco de dados.
const { query } = require('../../../db/consultas.js');

// Exportando função para rota da API.
module.exports = async (req, res) => {
    // Abrindo bloco de teste.
    try {
        // ## VALIDAÇÃO DE ENTRADA - INICIO
        // Extraindo dados da requisição que foram passados no body.
        const { nome, id_curso } = req.body;

        // Testando se os dados passados na requisição estão vazios.
        if (!nome || !id_curso) {
            // Cria um objeto com as informações de erros.
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            // Lançando uma exceção.
            throw new ExceptionAPI(erro);
        }

        // Testando se o id_curso informado não é número.
        if (isNaN(id_curso)) {
            // Cria um objeto com as informações de erros.
            const erro = { cod: 406, mensagem: 'Dados inválidos!' };
            // Lançando uma exceção.
            throw new ExceptionAPI(erro);
        }
        // ## VALIDAÇÃO DE ENTRADA - FIM


        // ## INSERINDO TUMRAS NO BANCO DE DADOS - INICIO
        // Define o sql que deverá ser passado na consulta para inserir o nova turma.
        const sql = (
            `INSERT INTO turmas (id, nome, id_curso, formado) 
            VALUES (null, '${nome}', '${id_curso}', 0)`
        );
        // Executa uma consulta no banco de dados e extraí as informações retornadas.
        const { ok, resposta } = await query(sql, 'turmas', 'insert');
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!ok) throw new ExceptionAPI(resposta);
        // ## INSERINDO TUMRAS NO BANCO DE DADOS - FIM

        // Retorna a resposta de sucesso do servidor.
        return res.status(201).send(resposta);

    // Fechando bloco de teste e abrindo bloco de captura de exceções.
    } catch (erro) {
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
