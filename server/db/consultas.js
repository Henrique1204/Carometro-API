const conexaoDB = require('./conexao.js');
const { filtrarOcorrencias } = require('../util/filtros.js');

const select = (consulta, tabela) => {
    return new Promise((resolve) => {
        conexaoDB.query(consulta, (erroDB, resposta) => {
            if (erroDB) {
                console.log(erroDB.sqlMessage);
                const erro = { cod: 502, mensagem: `Erro ao buscar por dados na tabela ${tabela}.` };
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
                console.log(`ERRO: ${erroDB.sqlMessage}`);
                const erro = { cod: 502, mensagem: `Erro ao adicionar dados na tabela ${tabela}.` };
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
                console.log(`ERRO: ${erroDB.sqlMessage}`);
                const erro = { cod: 502, mensagem: `Erro ao atualizar dados na tabela ${tabela}.` };
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
                console.log(`ERRO: ${erroDB.sqlMessage}`);
                const erro = { cod: 502, mensagem: `Erro ao remover dados na tabela ${tabela}!` };
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

// Exportando as funções de consultas.
module.exports = {
    select,
    insert,
    update,
    deleteSQL,
    selectAlunos
};
