<?php
$host = 'localhost';  // ou IP do servidor MySQL
$db = 'dpna';         // nome do seu banco de dados
$user = 'root';       // usuário do banco
$pass = '';           // senha do banco

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

$nome = $_POST['nome'];
$senha = $_POST['senha'];

$sql = "SELECT * FROM usuarios WHERE usuario_nome = ? AND usuario_senha_hash = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $nome, $senha);
$stmt->execute();
$result = $stmt->get_result();

echo ($result->num_rows > 0) ? "OK" : "NAO";

$conn->close();
?>
