// Bibliotecas para manipular arquivos de disco.
const fs = require('fs');
const path = require('path');
const caminho = path.dirname(require.main.filename).replace('server', '');

module.exports = (turma, foto) => {
    return new  Promise((resolve) => {
        // Verifica se não existe
        if (!fs.existsSync(`${caminho}/uploads/${turma}`)){
            // Efetua a criação do diretório
            fs.mkdirSync(`${caminho}/uploads/${turma}`);
        }

        const novaFoto = foto.replace('uploads/', `uploads/${turma}/`);

        fs.rename(`${caminho}/${foto}`, `${caminho}/${novaFoto}`, (e) => {
            if (!e) {
                resolve({ foto: novaFoto });
            } else {
                resolve({ foto });
            }
        });
    })
};
