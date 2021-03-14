// Adiciona o pacote para fazer as consultas MySQL.
const mysql = require('mysql8');
// Adicionar o pacote que permite o usa das vairáveis de ambiente.
require('dotenv/config');
const { unlink } = require('fs');

// Configurando a conexão com o banco MySQL.
const dbCon = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Consultas
const selectAlunos = (consulta) => {
    const filtrarOcorrencias = (lista, id) => {
        const listaFiltrada = lista.filter(({ id_aluno }) => id_aluno === id);
        const listaFormatada = listaFiltrada.map(({ data_criacao, titulo, conteudo, criado_por }) => ({
            data_criacao,
            titulo,
            conteudo,
            criado_por
        }));
    
        return listaFormatada;
    };

    return new Promise((resolve) => {
        dbCon.query(consulta, (erroAlunos, alunos) => {
            if (erroAlunos) {
                console.log(erroAlunos.sqlMessage);
                const erro = { cod: 502, mensagem: 'Erro ao buscar por dados na tabela alunos.' };
                resolve({ ok: false, resposta: erro });
                return;
            }
    
            dbCon.query('SELECT * FROM ocorrencias', (erroOcorrencias, ocorrencias) => {
                if (erroOcorrencias) {
                    console.log(erroOcorrencias.sqlMessage);
                    const erro = { cod: 502, mensagem: 'Erro ao buscar por dados na tabela ocorrencias.' };
                    resolve({ ok: false, resposta: erro });
                    return;
                }

                const dados = alunos.map((aluno) => ({
                    ...aluno,
                    formado: aluno.formado === 1,
                    data_nascimento: aluno.data_nascimento.toISOString().split('T')[0],
                    ocorrencias: filtrarOcorrencias(ocorrencias, aluno.id)
                }));
    
                console.log(`GET: Itens buscados ${dados.length}`);
                resolve({ ok: true, resposta: dados });
            });
        });
    });
};

const deleteAlunos = (consulta, foto_antiga, id) => {
    return new Promise((resolve) => {
        dbCon.query(consulta, (erroAlunos, resAlunos) => {
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

            dbCon.query(`DELETE FROM ocorrencias WHERE id_aluno = ${id}`, (erroOcorrencias) => {
                if (erroOcorrencias) {
                    console.log(`ERRO: ${erroOcorrencias.sqlMessage}`);
                    const erro = { cod: 502, mensagem: 'Erro ao remover dados na tabela ocorrencias!' };
                    resolve({ ok: false, resposta: erro });
                    return;
                }

                console.log(`DELETE: Itens removidos 1\nID: ${id}`);
                const resposta = { status: 'Sucesso', mensagem: 'Dados removidos com sucesso!' };
                resolve({ ok: true, resposta });
            });
        });
    });
};

const postAlunos = (consulta) => {
    return new Promise((resolve) => {
        dbCon.query(consulta, (erroDB, resDB) => {
            if (erroDB) {
                console.log(`ERRO: ${erroAlunos.sqlMessage}`);
                const erro = { cod: 502, mensagem: 'Erro ao adicionar dados na tabela alunos.' };
                resolve({ ok: false, resposta: erro });
                return;
            }
    
            console.log(`POST: Itens adicionandos 1\nID: ${resDB.insertId}`);
            const resposta = { status: 'Sucesso', mensagem: 'Dados adicionados com sucesso!' };
            resolve({ ok: true, resposta });
        });
    });
}

const putAlunos = (consulta, foto_antiga) => {
    return new Promise((resolve) => {
        dbCon.query(consulta, (erroDB) => {
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
    conexao: dbCon,
    selectAlunos,
    deleteAlunos,
    postAlunos,
    putAlunos
};
