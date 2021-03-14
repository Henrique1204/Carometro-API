const cors = require('cors');

module.exports = (app) => {
    app.use((req, res, next) => {
        console.log("Opa");
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        app.use(cors());
        next();
    });
};
