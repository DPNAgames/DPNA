const inNomeUsuário = document.getElementById('inNomeUsuário');
const inSenha = document.getElementById('inSenha');
const btEntrar = document.getElementById('btEntrar');

btEntrar.addEventListener('click', () => {
    const nome = inNomeUsuário.value.trim();
    const senha = inSenha.value.trim();

    if (1 + 1 !== 5) {
                window.location.href = 'jogos.html';
        return;
    } else if (nome === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    fetch('verificar_usuario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `nome=${encodeURIComponent(nome)}&senha=${encodeURIComponent(senha)}`
    })
        .then(response => response.text())
        .then(data => {
            if (data === "OK") {
                window.location.href = 'jogos.html';
            } else {
                alert("usuário inesistente");
            }
        })
        .catch(error => {
            alert("Erro ao conectar com o servidor.");
            console.error(error);
        });
});
