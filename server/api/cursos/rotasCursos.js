module.exports = (app) => {
    app.get('/cursos', (req, res) => {
        res.status(200).send({ status: 'Sucesso', mensagem: 'Está rota está no ar.' });
    });
};
