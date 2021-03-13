module.exports = (app) => {
    app.get('/turmas', (req, res) => {
        res.status(200).send({ status: 'Sucesso', mensagem: 'Essa rota está no ar.' });
    });
};
