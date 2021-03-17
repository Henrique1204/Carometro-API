// Importando Exception personalizada para tratamento de erros.
const ExceptionAPI = require('../../util/ExceptionAPI.js');
// Importando método para realizar consultas no banco de dados.
const { query } = require('../../db/consultas.js');

// Exportando função para rota da API.
module.exports = async (req, res) => {
    // Abrindo bloco de teste.
    try {
        // ## VALIDAÇÃO DE ENTRADA - INICIO
        // Extraindo dados da requisição que foram passados no body.
        const { NI, senha } = req.body;

        // Testando se os dados passados na requisição estão vazios e lança uma exceção.
        if (!NI || !senha) throw new ExceptionAPI(400);
        // ## VALIDAÇÃO DE ENTRADA - FIM

        // ## CONFERINDO SE E USUÁRIO EXISTE NO BANCO DE DADOS - INICIO
        // Define o sql que deverá ser passado na consulta para buscar usuaio.
        const sqlSelect = `SELECT * FROM usuarios WHERE NI = '${NI}'`;
        // Executa uma consulta no banco de dados e guarda a resposta.
        const resSelect = await query(sqlSelect, 'usuarios', 'select');

        // Testando se não houve resposta para consulta no banco de dados e lança uma exceção.
        if (!resSelect.ok && resSelect.resposta.length === 0) throw new ExceptionAPI(404);
        // ## CONFERINDO SE E USUÁRIO EXISTE NO BANCO DE DADOS - FIM

        // ## ATUALIZANDO DADOS DE USUARIO NO BANCO DE DADOS - INICIO
        // Define o sql que deverá ser passado na consulta que atualiza usuaio.
        const sqlUpdate = (
            `UPDATE usuarios SET senha = SHA2('${senha.toString()}', 224) WHERE NI = '${NI}'`
        );

        // Executa uma consulta no banco de dados e guarda a resposta.
        const resUpdate = await query(sqlUpdate, 'usuarios', 'update');
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!resUpdate.ok) throw new ExceptionAPI(null, resUpdate.resposta);
        // ## ATUALIZANDO DADOS DE USUARIO NO BANCO DE DADOS - FIM

        // Retorna a resposta de sucesso do servidor.
        return res.status(201).send(resUpdate.resposta);

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
}