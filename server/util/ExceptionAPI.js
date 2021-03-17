module.exports = class ExceptionAPI {
    constructor(cod, mensagem, erroSQL) {
        this.cod = cod;
        this.mensagem = mensagem;
        this.erroSQL = erroSQL || null;
        this.tipo = 'API';
    }
};
