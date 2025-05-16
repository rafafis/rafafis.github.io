// Função para expandir ou recolher o conteúdo do exemplo ao clicar no título
function toggleExemplo(titulo) {
    const conteudo = titulo.nextElementSibling;
    conteudo.classList.toggle('expandido');
}

// Função para expandir ou recolher a resolução ao clicar no botão "Ver resolução"
function toggleResolucao(botao) {
    const container = botao.closest('.exercicio, .exemplo');
    if (!container) return;

    const resolucao = container.querySelector('.resolucao-expansivel');
    if (!resolucao) return;

    resolucao.classList.toggle('expandido');

    // Força reprocessamento MathJax, se necessário
    if (window.MathJax) {
        MathJax.typesetPromise([resolucao]);
    }
}



