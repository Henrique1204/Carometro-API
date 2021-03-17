const { query } = require('../../db/consultas.js');
const jwt = require('jsonwebtoken');
//Blibioteca para criptografar senha.
const { SHA224 } = require("sha2");
const ExceptionAPI = require('../../util/ExceptionAPI.js');

module.exports = async (req, res) => {
    try {
        const { NI: NI_body, senha } = req.body;

        if (!NI_body || !senha) {
            const erro = { cod: 400, mensagem: 'Dados incompletos!' };
            throw new ExceptionAPI(erro);
        }

        // criptografada.
        const senhaCri = SHA224(senha.toString()).toString("hex");
        
        const sql = (
            `SELECT * FROM usuarios WHERE senha = '${senhaCri}' AND NI = '${NI_body.toString()}'`
        );
    
        const { ok, resposta } = await query(sql, 'usuarios', 'select');
        if (!ok) throw new ExceptionAPI(resposta);
    
        if (resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados inválidos.' };
            throw new ExceptionAPI(erro);
        }

        const { id, NI, nome, isAdmin } = resposta[0]; 
        let token;

        if (isAdmin !== 0) {
            token = jwt.sign({ id }, process.env.SEGREDO_ADMIN, {
                expiresIn: (60 * 60 * 2)
            });
        } else {
            token = jwt.sign({ id }, process.env.SEGREDO_USER, {
                expiresIn: (60 * 60 * 2)
            });
        }

        return res.status(202).send({
            auth: true,
            token,
            usuario: { NI, nome, isAdmin: isAdmin !== 0 }
        });
    } catch (erro) {
        if (erro.tipo === 'API') {
            const { cod, mensagem, erroSQL } = erro;

            if (erroSQL) return res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
            return res.status(cod).send({ status: 'Falha', mensagem });
        }

        return res.status(500).send({ status: 'Falha', mensagem: erro.message });
    }
}