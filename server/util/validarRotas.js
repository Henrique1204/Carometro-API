require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const ExceptionAPI = require('./ExceptionAPI.js');

module.exports = (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        let isValido = false;

        if (!token) throw new ExceptionAPI(401);

        if (req.method === 'GET' || req.url === '/validarToken') {
            jwt.verify(token, process.env.SEGREDO_USER, function(erro, decoded) {
                if (!erro) {
                    isValido = true;
                    req.userId = decoded.id;
                }
            });
        }

        jwt.verify(token, process.env.SEGREDO_ADMIN, function(erro, decoded) {
            if (!erro) {
                isValido = true;
                req.userId = decoded.id;
            }
        });

        if (!isValido) throw new ExceptionAPI(403);

        next();
    } catch (erro) {
        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
}
