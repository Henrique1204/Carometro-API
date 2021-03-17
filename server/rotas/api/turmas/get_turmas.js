// Importando Exception personalizada para tratamento de erros.
const ExceptionAPI = require('../../../util/ExceptionAPI.js');
// Importando método para realizar consultas no banco de dados.
const { query, selectAlunos } = require('../../../db/consultas.js');
// Importando método para formatar e filtrar dados de aluno.
const { filtrarAlunos } = require('../../../util/filtros.js');

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

        // ## BUSCANDO DADOS DE TURMAS - INICIO
        // Define o sql que deverá ser passado na consulta para buscar dados.
        const sqlTurmas = (
            `SELECT t.id, t.nome, t.formado, c.nome AS curso, c.periodo FROM turmas AS t 
            INNER JOIN cursos AS c ON t.id_curso = c.id ${(id) ? `WHERE t.id = ${id}` : ''} 
            ORDER BY t.id`
        );

        // Executa uma consulta no banco de dados e guarda a resposta.
        const resTurmas = await query(sqlTurmas, 'turmas', 'select');
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!resTurmas.ok) throw new ExceptionAPI(resTurmas.resposta);

        // Executa uma consulta no banco de dados e guarda a resposta.
        const sqlAlunos = `SELECT * FROM alunos ${(id) ? `WHERE id_turma = ${id}` : ''}`;
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        const resAlunos = await selectAlunos(sqlAlunos, id);
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!resAlunos.ok) throw new ExceptionAPI(resAlunos.resposta);

        // Formatando dados para retorno.
        const dados = resTurmas.resposta.map((turma) => ({
            ...turma,
            formado: turma.formado === 1,
            alunos: filtrarAlunos(resAlunos.resposta, turma.id)
        }));
        // ## BUSCANDO DADOS DE TURMAS - FIM

        // ## CONFERINDO TIPO DE RETORNO - INICIO
        // Testa se a resposta retornada veio sem conteúdo.
        if (id && resTurmas.resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados não encontrados.' };
            throw new ExceptionAPI(erro);
        }

        // Testa se o id foi informado e retorna a resposta de sucesso do servidor.
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
