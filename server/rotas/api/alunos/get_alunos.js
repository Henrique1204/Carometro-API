// Importando Exception personalizada para tratamento de erros.
const ExceptionAPI = require('../../../util/ExceptionAPI.js');
// Importando método para realizar consultas no banco de dados.
const { selectAlunos } = require('../../../db/consultas.js');

// Exportando função para rota da API.
module.exports = async (req, res) => {
    // Abrindo bloco de teste.
    try {
        // ## VALIDAÇÃO DE ENTRADA - INICIO
        // Extraindo a propriedade id do objeto params da requisição.
        const { id } = req.params;

        // Testando se o id informado não é número e lançando uma exceção.
        if (id && isNaN(id)) throw new ExceptionAPI(406);
        // ## VALIDAÇÃO DE ENTRADA - FIM

        // ## BUSCANDO DADOS DE ALUNOS - INICIO
        // Define o sql que deverá ser passado na consulta para buscar dados.
        const sql = (
            `SELECT a.id, a.nome, a.email, a.telefone, a.data_nascimento, a.foto, t.nome AS turma, 
            t.formado FROM alunos AS a INNER JOIN turmas AS t ON a.id_turma = t.id 
            ${(id) ? `WHERE a.id = ${id}` : ''} ORDER by a.id`
        );

        // Executa uma consulta no banco de dados e extraí as informações retornadas.
        const { ok, resposta } = await selectAlunos(sql, id);
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!ok) throw new ExceptionAPI(null, resposta);
        // ## BUSCANDO DADOS DE ALUNOS - FIM

        // ## CONFERINDO TIPO DE RETORNO - INICIO
        // Testa se a resposta retornada veio sem conteúdo e lançando exceção.
        if (id && resposta.length === 0) throw new ExceptionAPI(404);

        // Testa se o id foi informado e retorna a resposta de sucesso do servidor.
        if (id) return res.status(200).send(resposta[0]);
        // ## CONFEREINDO TIPO DE RETORNO - FIM

        // Retorna a resposta de sucesso do servidor.
        return res.status(200).send(resposta);

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
