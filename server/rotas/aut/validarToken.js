module.exports = (req, res) => {
    console.log('Token válido!');
    res.status(202).send({ auth: true });
}
