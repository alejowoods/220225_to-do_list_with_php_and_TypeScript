<?php
$servername = "localhost";
$username = "root";
$password="";
$dbname = "todo_list";

$conn = new mysqli($servername, $username, $password);

//Verify conection
if ($conn->connect_error) {
    die("Failed connexion: " . $conn->connect_error);
}

//create database
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    echo "DB created sucessfully";
} else {
    echo "DB could not be created: " . $conn->error;
}

$conn->select_db($dbname);

$sql = "CREATE TABLE IF NOT EXISTS task (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table 'task'created successfully";
} else {
    echo "Error, table could not be created" . $conn->error;
}

$conn->close();
?>