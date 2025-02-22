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
$title = $_POST['title'];
$description = $_POST['description'];

$sql = "UPDATE task SET title='$title', description='$description' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    echo "Task updated successfully";
} else {
    echo "Error updating task: " . $conn->error;
}

$conn->close();

?>