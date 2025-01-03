<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../server/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // 필수 필드 검증
    $required_fields = ['username', 'password', 'nickname', 'name', 'birth', 'phone', 'bank_name', 'account_holder', 'account_number'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => '모든 필드를 입력해주세요.']);
            exit;
        }
    }

    // 아이디 중복 체크
    $stmt = $db->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$data['username']]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => '이미 사용 중인 아이디입니다.']);
        exit;
    }

    // 닉네임 중복 체크
    $stmt = $db->prepare("SELECT id FROM users WHERE nickname = ?");
    $stmt->execute([$data['nickname']]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => '이미 사용 중인 닉네임입니다.']);
        exit;
    }

    // 사용자 등록
    $stmt = $db->prepare("
        INSERT INTO users (
            username, password, nickname, name, birth, phone,
            bank_name, account_holder, account_number, status,
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())
    ");

    $stmt->execute([
        $data['username'],
        hash('sha256', $data['password']),
        $data['nickname'],
        $data['name'],
        $data['birth'],
        $data['phone'],
        $data['bank_name'],
        $data['account_holder'],
        $data['account_number']
    ]);

    echo json_encode([
        'success' => true,
        'message' => '회원가입이 완료되었습니다.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => '서버 오류가 발생했습니다.']);
} 