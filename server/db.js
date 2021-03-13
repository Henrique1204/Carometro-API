// Adiciona o pacote para fazer as consultas MySQL.
const mysql = require('mysql8');
// Adicionar o pacote que permite o usa das vairáveis de ambiente.
require('dotenv/config');

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
                    data_nascimento: aluno.data_nascimento.toISOString().split('T')[0],
                    ocorrencias: filtrarOcorrencias(ocorrencias, aluno.id)
                }));
    
                console.log(`GET: Itens buscados ${dados.length}`);
                resolve({ ok: true, resposta: dados });
            });
        });
    });
};

// Exportando a conexão do banco de dados.
module.exports = {
    conexao: dbCon,
    selectAlunos
};
