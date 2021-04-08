// Bibliotecas para manipular arquivos de disco.
const fs = require('fs');
const path = require('path');
const caminho = path.dirname(require.main.filename).replace('server', '');

module.exports = (pasta, foto) => {
    return new  Promise((resolve) => {
        // Verifica se não existe
        if (!fs.existsSync(`${caminho}/uploads/${pasta}`)){
            // Efetua a criação do diretório
            fs.mkdirSync(`${caminho}/uploads/${pasta}`);
        }

        const novaFoto = foto.replace('uploads/', `uploads/${pasta}/`);

        fs.rename(`${caminho}/${foto}`, `${caminho}/${novaFoto}`, (e) => {
            if (!e) {
                resolve({ foto: novaFoto });
            } else {
                resolve({ foto });
            }
        });
    })
};
