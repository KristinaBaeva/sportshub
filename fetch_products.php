<?php
$host = 'localhost'; // Database host
$db = 'sportshub'; // Database name
$user = 'root'; // Database username
$pass = 'Krasnodar2023'; // Database password

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch products
$sql = "SELECT p.id, p.name, p.description, p.price, p.image_url, s.name AS subcategory_name 
        FROM products p 
        JOIN subcategories s ON p.subcategory_id = s.id";
$result = $conn->query($sql);

$products = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($products);

$conn->close();
?>
