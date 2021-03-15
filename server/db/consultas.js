const conexaoDB = require('./conexao.js');
const { filtrarOcorrencias } = require('../util/filtros.js');

const tiposSucessos = {
    adicionar: 'Dados adicionados com sucesso!',
    atualizar: 'Dados atualizados com sucesso!',
    deletar: 'Dados removidos com sucesso!'
};

const tiposErros = {
    buscar: 'Erro ao buscar por dados na tabela',
    adicionar: 'Erro ao adicionar dados na tabela',
    atualizar: 'Erro ao atualizar dados na tabela',
    deletar: 'Erro ao remover dados na tabela'
};

const query = (sql, options) => (
    new Promise((resolve) => {
        const { tabela, tipo } = options;

        conexaoDB.query(sql, (erroDB, resDB) => {
            if (erroDB) {
                const erro = {
                    cod: 502,
                    mensagem: `${tiposErros[tipo]} ${tabela}.`,
                    erroSQL: erroDB.sqlMessage
                };

                return resolve({ ok: false, resposta: erro });
            }

            if (resDB.affectedRows === 0 && tipo === 'deletar') {
                const erro = { cod: 406, mensagem: 'Dado informado não pode ser removido.' };
                return resolve({ ok: false, resposta: erro });
            }

            if (tipo === 'buscar') return resolve({ ok: true, resposta: resDB });

            const resposta = { status: 'Sucesso', mensagem: tiposSucessos[tipo] };
            resolve({ ok: true, resposta });
        });
    })
);

const select = (consulta, tabela) => {
    return new Promise((resolve) => {
        conexaoDB.query(consulta, (erroDB, resposta) => {
            if (erroDB) {
                const erro = {
                    cod: 502,
                    mensagem: `Erro ao buscar por dados na tabela ${tabela}.`,
                    erroSQL: erroDB.sqlMessage
                };

                resolve({ ok: false, resposta: erro });
                return;
            }

            console.log(`GET na tabela ${tabela} | Resultados ${resposta.length}`);
            resolve({ ok: true, resposta });
        });
    });
};

const insert = (consulta, tabela) => {
    return new Promise((resolve) => {
        conexaoDB.query(consulta, (erroDB, resDB) => {
            if (erroDB) {
                const erro = {
                    cod: 502,
                    mensagem: `Erro ao adicionar dados na tabela ${tabela}.`,
                    erroSQL: erroDB.sqlMessage
                };

                resolve({ ok: false, resposta: erro });
                return;
            }

            console.log(`POST na tabela ${tabela} | ID criado: ${resDB.insertId}`);
            const resposta = { status: 'Sucesso', mensagem: 'Dados adicionados com sucesso!' };
            resolve({ ok: true, resposta });
        });
    });
};

const update = (consulta, tabela, id) => {
    return new Promise((resolve) => {
        conexaoDB.query(consulta, (erroDB) => {
            if (erroDB) {
                const erro = {
                    cod: 502,
                    mensagem: `Erro ao atualizar dados na tabela ${tabela}.`,
                    erroSQL: erroDB.sqlMessage
                };

                resolve({ ok: false, resposta: erro });
                return;
            }

            console.log(`PUT na tabela ${tabela} | ID do item alterado: ${id}`);
            const resposta = { status: 'Sucesso', mensagem: 'Dados atualizados com sucesso!' };
            resolve({ ok: true, resposta });
        });
    })
};

const deleteSQL = (consulta, tabela, id) => {
    return new Promise((resolve) => {
        conexaoDB.query(consulta, (erroDB, resDB) => {
            if (erroDB) {
                const erro = {
                    cod: 502,
                    mensagem: `Erro ao remover dados na tabela ${tabela}!`,
                    erroSQL: erroDB.sqlMessage
                };

                resolve({ ok: false, resposta: erro });
                return;
            }

            if (resDB.affectedRows === 0) {
                const erro = { cod: 406, mensagem: 'Dado informado não pode ser removido.' };
                resolve({ ok: false, resposta: erro });
                return;
            }

            console.log(`DELETE na tabela ${tabela} | ID do item removido: ${id}`);
            const resposta = { status: 'Sucesso', mensagem: 'Dados removidos com sucesso!' };
            resolve({ ok: true, resposta });
        });
    });
};

const selectAlunos = (sql, id) => {
    return new Promise((resolve) => {
        const funcaoAsync = async () => {
            const sqlOcorrencias = (
                `SELECT * FROM ocorrencias ${(id) ? `WHERE id_aluno = ${id}` : ''}`
            );
    
            const resAlunos = await query(sql, { tablea: 'alunos', tipo: 'buscar' });
            if (!resAlunos.ok) resolve(resAlunos);
    
            const resOco = await query(sqlOcorrencias, {
                tablea: 'ocorrencias',
                tipo: 'buscar'
            });

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
    select,
    insert,
    update,
    deleteSQL,
    selectAlunos
};
