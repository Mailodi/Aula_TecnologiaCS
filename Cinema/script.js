document.getElementById('filmeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const classificacao = document.getElementById('classificacao').value;
    const genero = document.getElementById('genero').value;
    const resumo = document.getElementById('resumo').value;
    const duracao = document.getElementById('duracao').value;

    if (titulo && classificacao && genero && duracao) {
        alert(`Filme "${titulo}" foi salvo com sucesso!`);
        //  salvar dados
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
});
