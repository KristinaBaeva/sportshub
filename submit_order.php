<?php
// submit_order.php
// Receives order data via POST and saves to database

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$customer = $data['customer'] ?? null;
$cart = $data['cart'] ?? null;
$delivery = $data['delivery'] ?? null;
$payment = $data['payment'] ?? null;
$comment = $data['comment'] ?? null;

if (!$customer || !$cart || !is_array($cart)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// TODO: Connect to your database here
// Example using PDO (adjust with your DB credentials)
try {
    $pdo = new PDO('mysql:host=localhost;dbname=sportshub;charset=utf8', 'dbuser', 'dbpassword');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Insert order
    $stmt = $pdo->prepare('INSERT INTO orders (name, phone, email, address, delivery, payment, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())');
    $stmt->execute([
        $customer['name'],
        $customer['phone'],
        $customer['email'],
        $customer['address'],
        $delivery,
        $payment,
        $comment
    ]);
    $orderId = $pdo->lastInsertId();

    // Insert order items
    $stmtItem = $pdo->prepare('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)');
    foreach ($cart as $item) {
        $stmtItem->execute([$orderId, $item['id'], $item['quantity']]);
    }

    echo json_encode(['success' => true, 'orderId' => $orderId]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
