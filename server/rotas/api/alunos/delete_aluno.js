// Importando Exception personalizada para tratamento de erros.
const ExceptionAPI = require('../../../util/ExceptionAPI.js');
// Importando método para realizar consultas no banco de dados.
const { query } = require('../../../db/consultas.js');
// Importando método para remover arquivos.
const { unlink } = require('fs');

// Exportando função para rota da API.
module.exports = async (req, res) => {
    // Abrindo bloco de teste.
    try {
        // ## VALIDAÇÃO DE ENTRADA - INICIO
        // Extraindo a propriedade id do objeto params da requisição.
        const { id } = req.params;

        // Testando se o id informado não é número e lançando uma exceção.
        if (isNaN(id)) throw new ExceptionAPI(406);
        // ## VALIDAÇÃO DE ENTRADA - FIM

        // ## BUSCANDO FOTO PARA SER REMOVIDA - INICIO
        // Define o sql que deverá ser passado na consulta para buscar dados.
        const sqlSelect = `SELECT foto FROM alunos WHERE id = ${id}`;
        // Executa uma consulta no banco de dados.
        const resSelect = await query(sqlSelect, 'alunos', 'select' );
        // ## BUSCANDO FOTO PARA SER REMOVIDA - FIM

        // ## REMOVENDO DADOS ALUNOS - INICIO
        // Define o sql que deverá ser passado na consulta para remover dados.
        const sqlAlunos = `DELETE FROM alunos WHERE id = ${id}`;
        // Executa uma consulta no banco de dados.
        const resAlunos = await query(sqlAlunos, 'alunos', 'delete' );
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!resAlunos.ok) throw new ExceptionAPI(null, resAlunos.resposta);

        // Remove arquivo de foto.
        unlink(resSelect.resposta[0].foto, () => {});
        // ## REMOVENDO DADOS ALUNOS - FIM

        // ## REMOVENDO DADOS OCORRENCIAS - INICIO
        // Define o sql que deverá ser passado na consulta para remover dados.
        const sqlOcorrencias = `DELETE FROM ocorrencias WHERE id_aluno = ${id}`;
        // Executa uma consulta no banco de dados.
        await query(sqlOcorrencias, 'ocorrencias', 'delete');
        // ## REMOVENDO DADOS OCORRENCIAS - FIM

        // Retorna a resposta de sucesso do servidor.
        return res.status(201).send(resAlunos.resposta);

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
