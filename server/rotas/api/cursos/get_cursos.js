// Importando Exception personalizada para tratamento de erros.
const ExceptionAPI = require('../../../util/ExceptionAPI.js');
// Importando método para realizar consultas no banco de dados.
const { query } = require('../../../db/consultas.js');
const { filtrarTurmas } = require('../../../util/filtros.js');

// Exportando função para rota da API.
module.exports = async (req, res) => {
    // Abrindo bloco de teste.
    try {
        // ## VALIDAÇÃO DE ENTRADA - INICIO
        // Extraindo a propriedade id do objeto params da requisição.
        const { id } = req.params;

        // Testando se o id informado não é número e lança uma exceção.
        if (id && isNaN(id)) throw new ExceptionAPI(406);
        // ## VALIDAÇÃO DE ENTRADA - FIM

        // ## BUSCANDO DADOS DE CURSOS - INICIO
        // Define o sql que deverá ser passado na consulta para buscar dados.
        const sqlCursos = `SELECT * FROM cursos ${(id) ? `WHERE id = ${id}` : ''} ORDER BY id`;
        // Executa uma consulta no banco de dados e extraí as informações retornadas.
        const resCursos = await query(sqlCursos, 'cursos', 'select');
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!resCursos.ok) throw new ExceptionAPI(null, resCursos.resposta);
        // ## BUSCANDO DADOS DE CURSOS - FIM

        // ## CONFERINDO TIPO DE RETORNO - INICIO
        // Testa se a resposta retornada veio sem conteúdo e lança uma exceção.
        if (id && resCursos.resposta.length === 0) throw new ExceptionAPI(404);

        let dados = resCursos.resposta.map((curso) => ({
            ...curso,
            turmas: []
        }));

        const sqlTurmas = `SELECT * FROM turmas ORDER BY id`;
        const resTurmas = await query(sqlTurmas, 'turmas', 'select');

        if (resTurmas.ok) {
            dados = resCursos.resposta.map((curso) => ({
                ...curso,
                turmas: filtrarTurmas(resTurmas.resposta, curso.id)
            }));
        }

        // Testa se o id foi informado e retorna a resposta de sucesso do servidor.
        if (id) return res.status(200).send(dados[0]);
        // ## CONFEREINDO TIPO DE RETORNO - FIM

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
