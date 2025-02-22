<?php
header('content-Type: application/json');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todo_list";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
        die("Failed connection: " . $conn->connect_error);
};

$sql = "SELECT id, title, description, created_at FROM task";
$result = $conn->query($sql);

$tasks = [];
if ($result->num_rows > 0) {
    while($row =$result->fetch_assoc()) {
        $tasks[] =$row;
    }    
} else {
    echo "0 results";
}

echo json_encode($tasks);

$conn->close();

?>