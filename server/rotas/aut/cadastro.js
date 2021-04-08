// Importando Exception personalizada para tratamento de erros.
const ExceptionAPI = require('../../util/ExceptionAPI.js');
// Importando método para realizar consultas no banco de dados.
const { query } = require('../../db/consultas.js');
// Importando método para remover arquivos.
const { unlink } = require('fs');
const moverArquivo = require('../../util/moverArquivo.js');

// Exportando função para rota da API.
module.exports = async (req, res) => {
    // Variável que irá guardar as informações da foto.
    let foto;

    // Abrindo bloco de teste.
    try {
        // ## VALIDAÇÃO DE ENTRADA - INICIO
        // Extraindo dados da requisição que foram passados no body.
        const { NI, nome, senha, isAdmin } = req.body;
        // Definindo o valor da variável fotos com o caminho do arquivo passado na requisição.
        foto = req.file?.path.replace('\\', '/');

        // Testando se os dados passados na requisição estão vazios e lança uma exceção.
        if (!NI || !nome || !senha || !foto) throw new ExceptionAPI(400);

        // Testando se o valor de isAdmin não é 0 e 1 e lança uma exceção.
        if (Number(isAdmin) !== 0 && Number(isAdmin) !== 1) throw new ExceptionAPI(406);
        // ## VALIDAÇÃO DE ENTRADA - FIM

        // ## VALIDANDO SE O USUÁRIO JÁ NÃO ESTÁ CADASTRADAO - INICIO
        // Define o sql que deverá ser passado na consulta para buscar usuaio.
        const sqlSelect = `SELECT * FROM usuarios WHERE NI = '${NI}'`;
        // Executa uma consulta no banco de dados e guarda a resposta.
        const resSelect = await query(sqlSelect, 'usuarios', 'select');

        // Testando se houve resposta para consulta no banco de dados.
        if (resSelect.ok && resSelect.resposta.length !== 0) {
            // Lançando uma exceção.
            throw new ExceptionAPI(422, { mensagem: 'Usuário já existe!' });
        }
        // ## VALIDANDO SE O USUÁRIO JÁ NÃO ESTÁ CADASTRADAO - FIM

        // ## INSERINDO USUARIO NO BANCO DE DADOS - INICIO
        // Move o arquivo e recebe o caminho para onde o arquivo foi movido.
        const arquivo = await moverArquivo('funcionarios', foto);
        // Definindo o valor da variável fotos com o caminho do arquivo movido.
        foto = arquivo.foto;

        // Define o sql que deverá ser passado na consulta para inserir o nova usuaio.
        const sqlInsert = (
            `INSERT INTO usuarios (id, NI, nome, senha, isAdmin, foto) VALUES 
            (null, '${NI}', '${nome}', SHA2('${senha.toString()}', 224), ${Number(isAdmin)}, '${foto}')`
        );

        // Executa uma consulta no banco de dados e guarda a resposta.
        const resInsert = await query(sqlInsert, 'usuarios', 'insert');
        // Testa se a consulta não foi ok e lança uma exceção com as informações de erro.
        if (!resInsert.ok) throw new ExceptionAPI(null, resInsert.resposta);
        // ## INSERINDO USUARIO NO BANCO DE DADOS - FIM

        // Retorna a resposta de sucesso do servidor.
        return res.status(201).send(resInsert.resposta);

    // Fechando bloco de teste e abrindo bloco de captura de exceções.
    } catch (erro) {
        // Testa se existe algum caminho dentro de foto e remove o arquivo caso tenha.
        if (foto) unlink(foto, () => {});

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
