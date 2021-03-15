const conexaoDB = require('./conexao.js');
const { filtrarOcorrencias } = require('../util/filtros.js');

const tiposSucessos = {
    insert: 'Dados adicionados com sucesso!',
    update: 'Dados atualizados com sucesso!',
    delete: 'Dados removidos com sucesso!'
};

const tiposErros = {
    select: 'Erro ao buscar por dados na tabela',
    insert: 'Erro ao adicionar dados na tabela',
    update: 'Erro ao atualizar dados na tabela',
    delete: 'Erro ao remover dados na tabela'
};

const query = (sql, tabela, tipo) => (
    new Promise((resolve) => {
        conexaoDB.query(sql, (erroDB, resDB) => {
            if (erroDB) {
                const erro = {
                    cod: 502,
                    mensagem: `${tiposErros[tipo]} ${tabela}.`,
                    erroSQL: erroDB.sqlMessage
                };

                return resolve({ ok: false, resposta: erro });
            }

            if (resDB.affectedRows === 0 && (tipo === 'delete' || tipo === 'update')) {
                const erro = { cod: 404, mensagem: 'Dado informado não existe.' };
                return resolve({ ok: false, resposta: erro });
            }

            if (tipo === 'select') return resolve({ ok: true, resposta: resDB });

            const resposta = { status: 'Sucesso', mensagem: tiposSucessos[tipo] };
            resolve({ ok: true, resposta });
        });
    })
);

const selectAlunos = (sql, id) => {
    return new Promise((resolve) => {
        const funcaoAsync = async () => {
            const sqlOcorrencias = (
                `SELECT * FROM ocorrencias ${(id) ? `WHERE id_aluno = ${id}` : ''}`
            );
    
            const resAlunos = await query(sql, 'alunos', 'select');
            if (!resAlunos.ok) resolve(resAlunos);
    
            const resOco = await query(sqlOcorrencias, 'ocorrencias', 'select');

            if (!resOco.ok) resolve(resOco);
    
            const resposta = resAlunos.resposta.map((aluno) => ({
                ...aluno,
                formado: aluno.formado === 1,
                data_nascimento: aluno.data_nascimento.toISOString().split('T')[0],
                ocorrencias: filtrarOcorrencias(resOco.resposta, aluno.id)
            }));
    
            resolve({ ok: true, resposta });
        };

        funcaoAsync();
    });
};

// Exportando as funções de consultas.
module.exports = {
    query,
    selectAlunos
};
