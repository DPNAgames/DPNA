// Executa o código apenas quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", () => {

    // Variável que armazenará os dados do time sorteado
    let timeSelecionado = null;

    // Número de erros cometidos pelo usuário
    let tentativas = 0;

    // Número máximo de erros permitidos antes do fim do jogo
    const maxErros = 5;

    // Referências para os elementos da interface (HTML)
    const tentativasElem = document.getElementById("tentativas");         // Texto com erros
    const input = document.getElementById("guessInput");                  // Campo de texto para palpite
    const enviarButton = document.getElementById("enviarButton");        // Botão de envio
    const feedback = document.getElementById("feedback");                // Mensagem de acerto/erro
    const suggestionsBox = document.getElementById("suggestions");      // Caixa de sugestões (autocomplete)
    const imagemAntiga = document.getElementById("imagemAntiga");       // Imagem da logo antiga
    const imagemAtual = document.getElementById("imagemAtual");         // Imagem da logo atual
    const nacionalidade = document.getElementById("nacionalidade");     // Exibe a nacionalidade
    const dicaNome = document.getElementById("dicaNome");               // Exibe o nome do time (ou ???)
    const titulosHeader = document.getElementById("titulosHeader");     // Cabeçalho do campo "Time:"
    const reiniciarButton = document.getElementById("reiniciarButton"); // Botão "Trocar time"

    // Lista com todos os times carregados do banco de dados
    let todosTimes = [];

    // Função para normalizar o texto (remover acentos e deixar minúsculo)
    function normalizarTexto(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // Retorna uma lista de sugestões filtradas pelo texto digitado
    function filtrarSugestoes(valor) {
        const texto = normalizarTexto(valor);
        return todosTimes.filter(t => normalizarTexto(t.nome).includes(texto));
    }

    // Mostra sugestões de nomes abaixo do campo de texto
    function exibirSugestoes(lista) {
        suggestionsBox.style.display = "block";
        suggestionsBox.innerHTML = "";
        lista.forEach(time => {
            const li = document.createElement("li");
            li.textContent = time.nome;
            li.addEventListener("click", () => {
                input.value = time.nome;
                suggestionsBox.innerHTML = "";
            });
            suggestionsBox.appendChild(li);
        });

        if (lista.length === 0) {
            suggestionsBox.style.display = "none";
        }
    }

    // Evento de digitação no campo de texto (para autocomplete)
    input.addEventListener("input", () => {
        const valor = input.value.trim();
        if (valor.length === 0) {
            suggestionsBox.innerHTML = "";
            return;
        }
        const sugestoes = filtrarSugestoes(valor);
        exibirSugestoes(sugestoes);
    });

    // Esconde sugestões se clicar fora do campo
    document.addEventListener("click", (e) => {
        if (e.target !== input) {
            suggestionsBox.innerHTML = "";
            suggestionsBox.style.display = "none";
        }
    });

    // Carrega a lista de times do arquivo FotosQEE.json e sorteia um para o jogo
    function carregarTimes() {
        fetch('FotosQEE.json') // Caminho correto do banco de dados
            .then(res => {
                if (!res.ok) throw new Error("Falha ao buscar FotosQEE.json");
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) throw new Error("Banco de times vazio ou inválido");
                todosTimes = data; // Salva todos os times
                carregarNovoTime(); // Sorteia o primeiro time
            })
            .catch(err => {
                console.error("Erro ao carregar os times:", err);
                alert("Erro ao carregar os dados dos times.");
            });
    }

    // Sorteia um novo time aleatório e reseta o estado do jogo
    function carregarNovoTime() {
        tentativas = 0;
        tentativasElem.innerText = `Erros cometidos: 0/${maxErros}`;
        feedback.innerText = "";
        input.disabled = false;
        enviarButton.disabled = false;
        titulosHeader.innerText = "Time:";
        dicaNome.innerText = "Nome - ???";
        input.value = "";

        const index = Math.floor(Math.random() * todosTimes.length); // Índice aleatório
        timeSelecionado = todosTimes[index]; // Define o time atual

        // Mostra a logo antiga
        imagemAntiga.src = timeSelecionado.imagemAntiga;
        imagemAntiga.style.display = "block";

        // Oculta a logo atual até o fim do jogo
        imagemAtual.style.display = "none";

        // Exibe a nacionalidade do time
        nacionalidade.innerText = `Nacionalidade: ${timeSelecionado.Pais || "-"}`;
    }

    // Verifica o palpite quando o usuário clica no botão "Enviar"
    enviarButton.addEventListener("click", () => {
        const palpite = normalizarTexto(input.value.trim());
        input.value = "";
        suggestionsBox.innerHTML = "";

        if (!timeSelecionado || !palpite) return;

        const nomeCorreto = normalizarTexto(timeSelecionado.nome);

        // Se acertou o nome do time
        if (palpite === nomeCorreto) {
            feedback.innerText = "Acertou!";
            dicaNome.innerText = `Nome - ${timeSelecionado.nome}`;
            titulosHeader.innerText = "Time revelado:";

            imagemAtual.src = timeSelecionado.imagemAtual;
            imagemAtual.style.display = "block";

            input.disabled = true;
            enviarButton.disabled = true;
        } else {
            // Erro no palpite
            tentativas++;
            tentativasElem.innerText = `Erros cometidos: ${tentativas}/${maxErros}`;
            feedback.innerText = "Errou!";

            // Se atingiu o limite de erros
            if (tentativas >= maxErros) {
                feedback.innerText = `Fim de jogo! O time era: ${timeSelecionado.nome}`;
                dicaNome.innerText = `Nome - ${timeSelecionado.nome}`;
                imagemAtual.src = timeSelecionado.imagemAtual;
                imagemAtual.style.display = "block";
                input.disabled = true;
                enviarButton.disabled = true;
            }
        }
    });

    // Troca o time e reinicia o jogo ao clicar em "Trocar time"
    reiniciarButton.addEventListener("click", carregarNovoTime);

    // Inicializa o jogo carregando os dados
    carregarTimes();
});
