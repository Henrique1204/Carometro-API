// Importando Exception personalizada para tratamento de erros.
const ExceptionAPI = require('../../util/ExceptionAPI.js');
// Importando método para realizar consultas no banco de dados.
const { query } = require('../../db/consultas.js');
// Biblioteca para manipular token.
const jwt = require('jsonwebtoken');
//Blibioteca para criptografar senha.
const { SHA224 } = require("sha2");

// Exportando função para rota da API.
module.exports = async (req, res) => {
    // Abrindo bloco de teste.
    try {
        // ## VALIDAÇÃO DE ENTRADA - INICIO
        // Extraindo dados da requisição que foram passados no body.
        const { NI: NI_body, senha } = req.body;

        // Testando se os dados passados na requisição estão vazios.
        if (!NI_body || !senha) {
            // Cria um objeto com as informações de erros.
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            // Lançando uma exceção.
            throw new ExceptionAPI(erro);
        }
        // ## VALIDAÇÃO DE ENTRADA - FIM

        // ## VALIDANDO OS DADOS BATEM - INICIO
        // criptografa a senha.
        const senhaCri = SHA224(senha.toString()).toString("hex");
        
        // Define o sql que deverá ser passado na consulta para buscar usuaio.
        const sql = (
            `SELECT * FROM usuarios WHERE senha = '${senhaCri}' AND NI = '${NI_body.toString()}'`
        );

        // Executa uma consulta no banco de dados e extraí as informações retornadas.
        const { ok, resposta } = await query(sql, 'usuarios', 'select');

        // Testando se não houve resposta para consulta no banco de dados.
        if (!ok && resposta.length === 0) {
            // Cria um objeto com as informações de erros.
            const erro = { cod: 404, mensagem: 'Dados inválidos.' };
            // Lançando uma exceção.
            throw new ExceptionAPI(erro);
        }
        // ## VALIDANDO OS DADOS BATEM - INICIO

        // ## GERANDO O TOKEN E MONTANDO DADOS PARA RETORNO - INICIO
        // Extraíndo dados da resposta da consulta.
        const { id, NI, nome, isAdmin } = resposta[0];
        // Vairável onde o token será guardado.
        let token;

        // Testando se o usuário que logou é admin.
        if (isAdmin !== 0) {
            // Gerando token com segredo de admin.
            token = jwt.sign({ id }, process.env.SEGREDO_ADMIN, {
                expiresIn: (60 * 60 * 2)
            });
        } else {
            // Gerando token com segredo de usuário comum.
            token = jwt.sign({ id }, process.env.SEGREDO_USER, {
                expiresIn: (60 * 60 * 2)
            });
        }
        // ## GERANDO O TOKEN E MONTANDO DADOS PARA RETORNO - FIM

        // Retorna a resposta de sucesso do servidor.
        return res.status(202).send({
            auth: true,
            token,
            usuario: { NI, nome, isAdmin: isAdmin !== 0 }
        });

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