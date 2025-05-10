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

// função botão copiar
function copiarCodigo(botao) {
  const codeBlock = botao.nextElementSibling.querySelector('code');
  const texto = codeBlock.innerText;

  navigator.clipboard.writeText(texto).then(() => {
    botao.innerText = "Copiado!";
    setTimeout(() => botao.innerText = "Copiar", 2000);
  }).catch(err => {
    console.error("Erro ao copiar:", err);
  });
}

// Função para reprocessar o MathJax no conteúdo carregado dinamicamente
function processarMathJax() {
    console.log("Reprocessando MathJax...");

    // Verifica se MathJax está disponível como objeto global
    if (window.MathJax) {
        console.log("MathJax global encontrado, usando MathJax.typeset()");
        window.MathJax.typeset();
    }
    // Para versões mais antigas do MathJax
    else if (window.MathJax && window.MathJax.Hub) {
        console.log("MathJax.Hub encontrado, usando MathJax.Hub.Queue()");
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }
    // Para KaTeX
    else if (typeof renderMathInElement === 'function') {
        console.log("renderMathInElement encontrado (KaTeX)");
        renderMathInElement(document.body, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "\\[", right: "\\]", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\(", right: "\\)", display: false}
            ]
        });
    } else {
        console.warn("Não foi possível encontrar MathJax ou KaTeX para processar equações");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Inicializa o KaTeX, se disponível, para o conteúdo inicial
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "\\[", right: "\\]", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\(", right: "\\)", display: false}
            ]
        });
    }

    // Carrega os exemplos
    const container = document.getElementById("container-exemplos");
    if (!container) return;

    const totalExemplos = 10; // altere conforme o número de exemplos
    let exemplosCarregados = 0;

    for (let i = 1; i <= totalExemplos; i++) {
        const numeroFormatado = String(i).padStart(2, '0');
        const url = `t3/exemplo${numeroFormatado}.html`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                const div = document.createElement("div");
                div.innerHTML = html;

                // Garante visualização correta de conteúdos expansíveis
                div.querySelectorAll(".conteudo-expansivel.expandido, .resolucao-expansivel.expandido").forEach(el => {
                    el.style.display = "block";
                });

                container.appendChild(div);
                exemplosCarregados++;

                // Reprocessa MathJax após o carregamento de cada exemplo
                // ou quando todos os exemplos forem carregados
                if (exemplosCarregados === 1 || exemplosCarregados === totalExemplos) {
                    // Adiciona um pequeno atraso para garantir que o DOM foi atualizado
                    setTimeout(processarMathJax, 200);
                }
            })
            .catch(error => {
                console.log(`Exemplo ${i} não encontrado ou erro ao carregar:`, error);
            });
    }
});

// Adicionar processamento MathJax aos eventos que mostram conteúdo
const oldToggleResolucao = toggleResolucao;
toggleResolucao = function(botao) {
    oldToggleResolucao(botao);
    setTimeout(processarMathJax, 100);
};

const oldToggleExemplo = toggleExemplo;
toggleExemplo = function(titulo) {
    oldToggleExemplo(titulo);
    setTimeout(processarMathJax, 100);
};
