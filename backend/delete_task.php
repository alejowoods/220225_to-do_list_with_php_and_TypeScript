<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todo_list";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Failed connection: " . $conn->connect_error);
}

$id = $_POST['id'];

$sql = "DELETE from task WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    echo "Task deleted successfully";
} else {
    echo "Error updating task: " . $conn->error;
}

$conn->close();

?>


