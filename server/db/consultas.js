const conexaoDB = require('./conexao.js');
const { unlink } = require('fs');
const { filtrarOcorrencias } = require('../util/filtros.js');

const select = (consulta, tabela) => {
    return new Promise((resolve) => {
        conexaoDB.query(consulta, (erroAlunos, resposta) => {
            if (erroAlunos) {
                console.log(erroAlunos.sqlMessage);
                const erro = { cod: 502, mensagem: `Erro ao buscar por dados na tabela ${tabela}.` };
                resolve({ ok: false, resposta: erro });
                return;
            }

            console.log(`GET na tabela ${tabela} | Resultados ${resposta.length}`);
            resolve({ ok: true, resposta });
        });
    });
};

const selectAlunos = (consulta, id) => {
    return new Promise((resolve) => {
        const funcaoAsync = async () => {
            const consultaOcorrencias = (
                `SELECT * FROM ocorrencias ${(id) ? `WHERE id_aluno = ${id}` : ''}`
            );
    
            const resAlunos = await select(consulta, 'alunos');
            if (!resAlunos.ok) resolve(resAlunos);
    
            const resOco = await select(consultaOcorrencias, 'ocorrencias');
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

const deleteAlunos = (consulta, foto_antiga, id) => {
    return new Promise((resolve) => {
        conexaoDB.query(consulta, (erroAlunos, resAlunos) => {
            if (erroAlunos) {
                console.log(`ERRO: ${erroAlunos.sqlMessage}`);
                const erro = { cod: 502, mensagem: 'Erro ao remover dados na tabela alunos!' };
                resolve({ ok: false, resposta: erro });
                return;
            }

            if (resAlunos.affectedRows === 0) {
                const erro = { cod: 406, mensagem: 'Dado informado não pode ser removido.' };
                resolve({ ok: false, resposta: erro });
                return;
            }

            unlink(foto_antiga, () => {});

            conexaoDB.query(`DELETE FROM ocorrencias WHERE id_aluno = ${id}`, (erroOcorrencias) => {
                if (erroOcorrencias) {
                    console.log(`ERRO: ${erroOcorrencias.sqlMessage}`);
                    const erro = { cod: 502, mensagem: 'Erro ao remover dados na tabela ocorrencias!' };
                    resolve({ ok: false, resposta: erro });
                    return;
                }

                console.log(`DELETE: Itens removidos 1`);
                const resposta = { status: 'Sucesso', mensagem: 'Dados removidos com sucesso!' };
                resolve({ ok: true, resposta });
            });
        });
    });
};

const postAlunos = (consulta) => {
    return new Promise((resolve) => {
        conexaoDB.query(consulta, (erroDB, resDB) => {
            if (erroDB) {
                console.log(`ERRO: ${erroAlunos.sqlMessage}`);
                const erro = { cod: 502, mensagem: 'Erro ao adicionar dados na tabela alunos.' };
                resolve({ ok: false, resposta: erro });
                return;
            }
    
            const resposta = { status: 'Sucesso', mensagem: 'Dados adicionados com sucesso!' };
            resolve({ ok: true, resposta });
        });
    });
}

const putAlunos = (consulta, foto_antiga) => {
    return new Promise((resolve) => {
        conexaoDB.query(consulta, (erroDB) => {
            if (erroDB) {
                console.log(`ERRO: ${erroAlunos.sqlMessage}`);
                const erro = { cod: 502, mensagem: 'Erro ao atualizar dados na tabela alunos.' };
                resolve({ ok: false, resposta: erro });
                return;
            }

            unlink(foto_antiga, () => {});
    
            console.log(`PUT: Itens atualizados 1`);
            const resposta = { status: 'Sucesso', mensagem: 'Dados adicionados com sucesso!' };
            resolve({ ok: true, resposta });
        });
    })
}

// Exportando a conexão do banco de dados.
module.exports = {
    select,
    selectAlunos,
    deleteAlunos,
    postAlunos,
    putAlunos
};
