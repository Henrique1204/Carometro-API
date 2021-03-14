const filtrarOcorrencias = (lista, id) => {
    const listaFiltrada = lista.filter(({ id_aluno }) => id_aluno === id);
    const listaFormatada = listaFiltrada.map(({ data_criacao, titulo, conteudo, criado_por }) => ({
        data_criacao,
        titulo,
        conteudo,
        criado_por
    }));

    return listaFormatada;
};

const filtrarAlunos = (lista, id) => {
    const listaFiltrada = lista.filter(({ id_turma }) => id_turma === id);
    const listaFormatada = listaFiltrada.map((item) => ({
        id: item.id,
        nome: item.nome,
        email: item.email,
        telefone: item.telefone,
        data_nascimento: item.data_nascimento,
        foto: item.foto,
        ocorrencias: item.ocorrencias
    }));

    return listaFormatada;
};

module.exports = {
    filtrarAlunos,
    filtrarOcorrencias
}