let rodadaAtual = 30; // Altere este valor para definir a rodada inicial a ser exibida
const rodadaMin = 1;
const rodadaMax = 38;

async function atualizarJogos() {

if (rodadaAtual === 1) {
    btnAnterior.style.visibility = "hidden"; 
} else if (rodadaAtual === 38) {
    btnProximo.style.visibility = "hidden"; 
}

    try {
        const response = await fetch('/DPNA FutGame/imagens FutGame/jogosPL.json'); // Arquivo JSON local com os jogos
        const jogos = await response.json();

        const listaJogos = document.getElementById('lista-jogos');
        listaJogos.innerHTML = '';

        const jogosDaRodada = jogos.filter(jogo => jogo.rodada === rodadaAtual);

        jogosDaRodada.forEach(jogo => {
            const item = document.createElement('li');
            item.innerHTML = `
                <span>${jogo.data}</span>
                <div class="match-container">
                    <img src="${jogo.logoTimeA}" alt="Escudo ${jogo.timeA}">
                    <div class="match-info">
                        <span>${jogo.timeA}</span>
                        <span>VS</span>
                        <span>${jogo.timeB}</span>
                        <button>Apostar</button>
                    </div>
                    <img src="${jogo.logoTimeB}" alt="Escudo ${jogo.timeB}">
                </div>`;
            listaJogos.appendChild(item);
        });

        // Atualiza o número da rodada exibido na página
        document.getElementById('rodada').textContent = rodadaAtual;

        // Desabilita botões caso atinja os limites
        document.getElementById('btnAnterior').disabled = rodadaAtual <= rodadaMin;
        document.getElementById('btnProximo').disabled = rodadaAtual >= rodadaMax;
    } catch (error) {
        console.error('Erro ao carregar os jogos:', error);
    }
}

function mudarRodada(delta) {
    if ((delta === -1 && rodadaAtual > rodadaMin) || (delta === 1 && rodadaAtual < rodadaMax)) {
        rodadaAtual += delta;
        atualizarJogos();
    }
}

setInterval(atualizarJogos, 60000); // Atualiza os jogos a cada 60 segundos

window.onload = atualizarJogos; // Atualiza os jogos ao carregar a página
