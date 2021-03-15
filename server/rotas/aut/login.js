const { select } = require('../../db/consultas.js');
const jwt = require('jsonwebtoken');
//Blibioteca para criptografar senha.
const { SHA224 } = require("sha2");

module.exports = async (req, res) => {
    try {
        const { NI: NI_body, senha } = req.body;

        if (!NI_body || !senha) {
            console.log("Aqui.");
            const erro = JSON.stringify({ cod: 400, mensagem: 'Dados incompletos!' });
            throw new Error(erro);
        }

        // criptografada.
        const senhaCri = SHA224(senha.toString()).toString("hex");
        
        const consulta = (
            `SELECT * FROM usuarios WHERE senha = '${senhaCri}' AND NI = '${NI_body.toString()}'`
        );
    
        const { ok, resposta } = await select(consulta, 'usuarios');
        if (!ok) throw new Error(JSON.stringify(resposta));
    
        if (resposta.length === 0) {
            const erro = { cod: 404, mensagem: 'Dados inválidos.' };

            throw new Error(JSON.stringify(erro));
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

        res.status(202).send({
            auth: true,
            token,
            usuario: { NI, nome, isAdmin: isAdmin !== 0 }
        });
    } catch ({ message }) {
        const { cod, mensagem, erroSQL } = JSON.parse(message);

        if (erroSQL) res.status(cod).send({ status: 'Falha', mensagem, erroSQL });
        else res.status(cod).send({ status: 'Falha', mensagem });
    }
}