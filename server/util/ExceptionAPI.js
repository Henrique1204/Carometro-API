module.exports = class ExceptionAPI {
    constructor(erro) {
        this.cod = erro.cod;
        this.mensagem = erro.mensagem;
        this.erroSQL = erro.erroSQL || null;
        this.tipo = 'API';
    }
};
