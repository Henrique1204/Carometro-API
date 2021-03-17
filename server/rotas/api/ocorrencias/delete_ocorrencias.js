// Importando Exception personalizada para tratamento de erros.
const ExceptionAPI = require('../../../util/ExceptionAPI.js');
// Importando método para realizar consultas no banco de dados.
const { query } = require('../../../db/consultas.js');

// Exportando função para rota da API.
module.exports = async (req, res) => {
    // Abrindo bloco de teste.
    try {
        // ## VALIDAÇÃO DE ENTRADA - INICIO
        // Extraindo a propriedade id do objeto params da requisição.
        const { id } = req.params;

        // Testando se o id informado não é número.
        if (isNaN(id)) {
            // Cria um objeto com as informações de erros.
            const erro = { cod: 406, mensagem: 'Dados inválidos!' };
            // Lançando uma exceção.
            throw new ExceptionAPI(erro);
        }
        // ## VALIDAÇÃO DE ENTRADA - FIM
    
        // ## REMOVENDO DADOS OCORRENCIAS - INICIO
        // Define o sql que deverá ser passado na consulta para remover dados.
        const sql = `DELETE FROM ocorrencias WHERE id = ${id}`;
        // Executa uma consulta no banco de dados.
        const { ok, resposta } = await query(sql, 'ocorrencias', 'delete');
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!ok) throw new ExceptionAPI(resposta);
        // ## REMOVENDO DADOS OCORRENCIAS - FIM

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
