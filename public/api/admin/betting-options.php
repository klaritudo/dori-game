<?php
require_once '../../config/database.php';
require_once '../../middleware/admin-auth.php';

try {
    $stmt = $pdo->query("SELECT * FROM betting_options ORDER BY option_name");
    $options = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'options' => $options
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '베팅 옵션 조회 중 오류가 발생했습니다.'
    ]);
} 