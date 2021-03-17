const mensagem = {
    '400': 'Dados incompletos.',
    '401': 'Token não informado.',
    '403': 'Você não tem autorização necessária para continuar.',
    '404': 'Dados não encontrados.',
    '406': 'Dados inválidos.',
    '422': 'Informações já existem no banco de dados.',
    '502': 'Erro ao realizar operação no banco de dados.'
};

module.exports = class ExceptionAPI {
    constructor(cod, erro) {
        this.cod = cod || erro?.cod;
        this.mensagem = erro?.mensagem || mensagem[`${cod}`];
        this.erroSQL = erro?.erroSQL || null;
        this.tipo = 'API';
    }
};
