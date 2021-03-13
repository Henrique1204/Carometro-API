module.exports = (app) => {
    // Rota privisória.
    app.get('/ocorrencias', (req, res) => {
        res.status(200).send({ status: 'Sucesso', mensagem: 'Rota no ar!' });
    });
};
