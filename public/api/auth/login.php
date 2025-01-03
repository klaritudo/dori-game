<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../server/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['username']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['message' => '아이디와 비밀번호를 입력해주세요.']);
        exit;
    }

    // 비밀번호는 이미 해시되어 저장되어 있으므로, 입력된 비밀번호를 해시하여 비교
    $stmt = $db->prepare("
        SELECT id, username, password, balance, role 
        FROM users 
        WHERE username = ?
    ");
    
    $stmt->execute([$data['username']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($data['password'], $user['password'])) {
        http_response_code(401);
        echo json_encode(['message' => '아이디 또는 비밀번호가 일치하지 않습니다.']);
        exit;
    }

    // 토큰 생성
    $token = bin2hex(random_bytes(32));
    
    // 비밀번호 필드 제거
    unset($user['password']);
    
    echo json_encode([
        'token' => $token,
        'user' => $user
    ]);

} catch (Exception $e) {
    error_log($e->getMessage());  // 에러 로깅 추가
    http_response_code(500);
    echo json_encode(['message' => '서버 오류가 발생했습니다.']);
} 