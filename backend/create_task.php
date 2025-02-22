<?php 

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todo_list";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Failed connection: " . $conn->connect_error);
}

$title = $_POST['title'];
$description = $_POST['description'];

$sql = "INSERT INTO task (title, description) values ('$title', '$description')";
if ($conn->query($sql) === TRUE) {
    echo "New task created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>