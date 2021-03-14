require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        isValido = false;

        if (!token) {
            const erro = { cod: 401, mensagem: 'Você não tem o token.' }
            throw new Error(JSON.stringify(erro));
        }

        if (req.route.methods.get) {
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

        if (!isValido) {
            const erro = { cod: 500, mensagem: 'Falha ao autenticar o token.' }
            throw new Error(JSON.stringify(erro));
        }

        next();
    } catch ({ message }) {
        const { cod, mensagem } = JSON.parse(message);
        res.status(cod).send({ auth: false, mensagem });
    }
}
