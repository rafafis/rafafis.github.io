// Função para expandir ou recolher o conteúdo do exemplo ao clicar no título
function toggleExemplo(titulo) {
    const conteudo = titulo.nextElementSibling;
    conteudo.classList.toggle('expandido');
}

// Função para expandir ou recolher a resolução ao clicar no botão "Ver resolução"
function toggleResolucao(botao) {
    const resolucao = botao.nextElementSibling;
    resolucao.classList.toggle('expandido');
}

// Função para verificar a resposta de um exercício
function verificarResposta(botao) {
    // Encontra o container do exercício atual
    const container = botao.closest('.exercicio');
    const radios = container.querySelectorAll('input[name="resposta"]');
    const resultado = container.querySelector('.resultado');
    let selecionado = null;

    // Verifica qual opção foi selecionada
    radios.forEach((radio) => {
        if (radio.checked) {
            selecionado = radio.value;
        }
    });

    // Se nenhuma opção foi selecionada
    if (!selecionado) {
        resultado.textContent = "Por favor, selecione uma alternativa.";
        resultado.style.color = "orange";
        return;
    }

    // Verifica se a resposta está correta (a chave correta deve ser ajustada para cada exercício)
    const respostasCorretas = {
        'ex1': 'd' // Exemplo: para o exercício com id="ex1", a resposta é "d"
    };

    // Obtém o ID do exercício ou usa um padrão
    const exercicioId = container.id || 'ex1';
    const respostaCorreta = respostasCorretas[exercicioId];

    if (selecionado === respostaCorreta) {
        resultado.textContent = "✅ Correto!";
        resultado.style.color = "green";
    } else {
        resultado.textContent = "❌ Incorreto. Tente novamente.";
        resultado.style.color = "red";
    }
}

// Função para mostrar a resposta das questões com o efeito de transição
function openResposta(id) {
    let resposta = document.getElementById(`answer-${id}`);
    let botao = document.getElementById(`bt-reposta-${id}`);

    if (resposta && botao) {
        botao.style.pointerEvents = 'none';
        botao.style.backgroundColor = '#d4175e';
        resposta.style.height = `${resposta.scrollHeight}px`;
    }
}

// Carregar conteudo de forma dinamica
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("container-exemplos");
    if (!container) return;

    const totalExemplos = 10; // ajuste conforme necessário
    let exemplosCarregados = 0;

    for (let i = 1; i <= totalExemplos; i++) {
        const numeroFormatado = String(i).padStart(2, '0');
        // Caminho relativo ao diretório da página atual
        const url = `exemplo${numeroFormatado}.html`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                const div = document.createElement("div");
                div.innerHTML = html;

                // Mostra conteúdos expansíveis marcados como "expandido"
                div.querySelectorAll(".conteudo-expansivel.expandido, .resolucao-expansivel.expandido").forEach(el => {
                    el.style.display = "block";
                });

                container.appendChild(div);
                exemplosCarregados++;

                // Reprocessa MathJax após o carregamento
                if (window.MathJax) {
                    MathJax.typesetPromise([div]);
                }
            })
            .catch(error => {
                console.log(`Erro ao carregar exemplo ${i}:`, error);
            });
    }
});

// Adiciona reprocessamento MathJax após mostrar resoluções ou exemplos
function wrapWithMathJaxProcessing(fn) {
    return function (...args) {
        fn.apply(this, args);
        if (window.MathJax) {
            setTimeout(() => MathJax.typesetPromise(), 100);
        }
    };
}

// Só redefine se já existem essas funções
if (typeof toggleResolucao === "function") {
    toggleResolucao = wrapWithMathJaxProcessing(toggleResolucao);
}
if (typeof toggleExemplo === "function") {
    toggleExemplo = wrapWithMathJaxProcessing(toggleExemplo);
}

