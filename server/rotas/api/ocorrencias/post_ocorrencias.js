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
        const { titulo, conteudo, criado_por, id_aluno } = req.body;

        // Testando se os dados passados na requisição estão vazios.
        if (!titulo || !conteudo || !criado_por || !id_aluno ) {
            // Cria um objeto com as informações de erros.
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            // Lançando uma exceção.
            throw new ExceptionAPI(erro);
        }

        // Testando se o id_aluno informado não é número.
        if (isNaN(id_aluno)) {
            // Cria um objeto com as informações de erros.
            const erro = { cod: 406, mensagem: 'Dados inválidos!' };
            // Lançando uma exceção.
            throw new ExceptionAPI(erro);
        }
        // ## VALIDAÇÃO DE ENTRADA - FIM

        // ## INSERINDO OCORRENCIA NO BANCO DE DADOS - INICIO
        // Gerando data atual.
        const data = new Date().toISOString().split('T')[0];

        // Define o sql que deverá ser passado na consulta para inserir o nova ocorrencia.
        const sql = (
            `INSERT INTO ocorrencias (id, titulo, conteudo, data_criacao, criado_por, id_aluno) VALUES
            (null, '${titulo}', '${conteudo}', '${data}', '${criado_por}', ${id_aluno})`
        );
    
        // Executa uma consulta no banco de dados e extraí as informações retornadas.
        const { ok, resposta } = await query(sql, 'ocorrencias', 'insert');
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!ok) throw new ExceptionAPI(resposta);
        // ## INSERINDO OCORRENCIA NO BANCO DE DADOS - FIM

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
