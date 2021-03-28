const filtrarOcorrencias = (lista, id) => {
    const listaFiltrada = lista.filter(({ id_aluno }) => id_aluno === id);
    const listaFormatada = listaFiltrada.map(({ data_criacao, titulo, conteudo, criado_por }) => ({
        data_criacao: data_criacao.toISOString().split('T')[0],
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

const filtrarTurmas = (lista, id) => {
    const listaFiltrada = lista.filter(({ id_curso }) => id_curso === id);
    const listaFormatada = listaFiltrada.map(({ id, nome, formado }) => ({
        id,
        nome,
        formado
    }));

    return listaFormatada;
};

module.exports = {
    filtrarAlunos,
    filtrarOcorrencias,
    filtrarTurmas
}
