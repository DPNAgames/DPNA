const nomeUsuario = document.getElementById("nomeUsuario");
const idade = document.getElementById("idade");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");
const cadastrar = document.getElementById("cadastrar");

cadastrar.addEventListener("click", () => {
    if (nomeUsuario.value === "" || idade.value === "" || email.value === "" || senha.value === "" || confirmarSenha.value === "") {
        alert("Preencha todos os campos!");
        return;
    }
    else if (senha.value !== confirmarSenha.value) {
        alert("As senhas não coincidem!");
        return;
    } else if (idade.value < 16 || idade.value > 100) {
        alert("Idade inválida! A idade deve estar entre 16 e 100 anos.");
        return;
    } else {
        alert("Cadastro realizado com sucesso!");

    }
});