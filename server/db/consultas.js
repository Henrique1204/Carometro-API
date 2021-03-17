// Puxa o objeto de conxexão com o banco de dados.
const conexaoDB = require('./conexao.js');
// Puxa método para estruturar e filtras as ocorrencias.
const { filtrarOcorrencias } = require('../util/filtros.js');

// Objeto com os tipos de mensagens de sucesso que podem ser retornadas.
const tiposSucessos = {
    insert: 'Dados adicionados com sucesso!',
    update: 'Dados atualizados com sucesso!',
    delete: 'Dados removidos com sucesso!'
};

// Objeto com os tipos de mensagens de erros que podem ser retornados.
const tiposErros = {
    select: 'Erro ao buscar por dados na tabela',
    insert: 'Erro ao adicionar dados na tabela',
    update: 'Erro ao atualizar dados na tabela',
    delete: 'Erro ao remover dados na tabela'
};

/**
 * Método que realiza as consultas no banco de dados e retorna uma promise.
 * @param { String } sql
 * @param { String } tabela
 * @param { String } tipo
 */
const query = (sql, tabela, tipo) => (
    // Instância uma promise.
    new Promise((resolve) => {
        // Realiza a consulta no banco de dados.
        conexaoDB.query(sql, (erroDB, resDB) => {
            // Testa se ocorreu algum erro ao consultar o banco de dados.
            if (erroDB) {
                // Cria um objeto com as informações de erros.
                const erro = {
                    cod: 502,
                    mensagem: `${tiposErros[tipo]} ${tabela}.`,
                    erroSQL: erroDB.sqlMessage
                };

                // Resolve a promise enviando um objeto com as informações de erro.
                return resolve({ ok: false, resposta: erro });
            }

            // Testa se a consulta não realizou nenhuma mudança no banco de dados.
            if (resDB.affectedRows === 0) {
                // Cria um objeto com as informações de erros.
                const erro = { cod: 404, mensagem: 'Dados não encontrados.' };
                // Resolve a promise enviando um objeto com as informações de erro.
                return resolve({ ok: false, resposta: erro });
            }

            // Testa se o tipo de consulta é do tipo select.
            // Resolve a promise enviando um objeto com os dados buscados.
            if (tipo === 'select') return resolve({ ok: true, resposta: resDB });

            // Cria um objeto com as informações de sucesso.
            const resposta = { status: 'Sucesso', mensagem: tiposSucessos[tipo] };
            // Resolve a promise enviando um objeto com as informações de sucesso.
            return resolve({ ok: true, resposta });
        });
    })
);

/**
 * Método que cria uma consulta para buscar os dados dos alunos formatados.
 * @param { String } sql
 * @param { Number } id
 */
const selectAlunos = (sql, id) => (
    // Instância uma promise.
    new Promise((resolve) => {
        // Cria uma função assincrona para consultar o banco de dados.
        const funcaoAsync = async () => {
            // Executa uma consulta no banco de dados.
            const resAlunos = await query(sql, 'alunos', 'select');
            // Testa se a consulta não foi ok e retorna a resposta com as informações de erro.
            if (!resAlunos.ok) return resolve(resAlunos);

            // Define o sql que deverá ser passado na consulta da tabela ocorrencias.
            const sqlOcorrencias = (
                `SELECT * FROM ocorrencias ${(id) ? `WHERE id_aluno = ${id}` : ''}`
            );

            // Executa uma consulta no banco de dados.
            const resOco = await query(sqlOcorrencias, 'ocorrencias', 'select');
            // Testa se a consulta não foi ok e retorna a resposta com as informações de erro.
            if (!resOco.ok) return resolve(resOco);
    
            // Formata a resposta dos dados de alunos.
            const resposta = resAlunos.resposta.map((aluno) => ({
                ...aluno,
                formado: aluno.formado === 1,
                data_nascimento: aluno.data_nascimento.toISOString().split('T')[0],
                ocorrencias: filtrarOcorrencias(resOco.resposta, aluno.id)
            }));

            // Resolve a promise enviando um objeto com os dados buscados.
            return resolve({ ok: true, resposta });
        };

        funcaoAsync();
    })
);

// Exportando as funções de consultas.
module.exports = {
    query,
    selectAlunos
};
