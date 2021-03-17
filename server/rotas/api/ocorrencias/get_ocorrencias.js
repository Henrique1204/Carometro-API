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
        if (id && isNaN(id)) {
            // Cria um objeto com as informações de erros.
            const erro = { cod: 406, mensagem: 'Dados inválidos!' };
            // Lançando uma exceção.
            throw new ExceptionAPI(erro);
        }
        // ## VALIDAÇÃO DE ENTRADA - FIM

        // ## BUSCANDO DADOS DE OCORRENCIAS - INICIO
        // Define o sql que deverá ser passado na consulta para buscar dados.
        const sql = (
            `SELECT o.id, o.data_criacao, o.titulo, o.conteudo, o.criado_por, alunos.nome AS aluno 
            FROM ocorrencias as o INNER JOIN alunos ON alunos.id = o.id_aluno 
            ${(id) ? `WHERE o.id = ${id}` : ''} ORDER by o.id`
        );

        // Executa uma consulta no banco de dados e extraí as informações retornadas.
        const { ok, resposta } = await query(sql, 'ocorrencias', 'select');
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!ok) throw new ExceptionAPI(resposta);
        // ## BUSCANDO DADOS DE OCORRENCIAS - FIM

        // ## CONFERINDO TIPO DE RETORNO - INICIO
        // Testa se a resposta retornada veio sem conteúdo.
        if (id && resposta.length === 0) {
            // Cria um objeto com as informações de erros.
            const erro = { cod: 404, mensagem: 'Dados não encontrados.' };
            // Lançando uma exceção.
            throw new ExceptionAPI(erro);
        }

        // Formantando o objeto para retorno.
        const dados = resposta.map((ocorrencia) => ({
            ...ocorrencia,
            data_criacao: ocorrencia.data_criacao.toISOString().split('T')[0]
        }));

        if (id) return res.status(200).send(dados[0]);
        // ## CONFERINDO TIPO DE RETORNO - FIM

        // Retorna a resposta de sucesso do servidor.
        return res.status(200).send(dados);

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
