<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../server/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['username']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => '아이디와 비밀번호를 입력해주세요.']);
        exit;
    }

    $stmt = $db->prepare("
        SELECT id, username, role 
        FROM admin_users 
        WHERE username = ? AND password = ? AND status = 'active'
    ");

    $stmt->execute([
        $data['username'],
        hash('sha256', $data['password'])
    ]);

    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin) {
        http_response_code(401);
        echo json_encode(['error' => '아이디 또는 비밀번호가 일치하지 않습니다.']);
        exit;
    }

    // 세션 시작 및 관리자 정보 저장
    session_start();
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_role'] = $admin['role'];

    // 마지막 로그인 시간 업데이트
    $stmt = $db->prepare("
        UPDATE admin_users 
        SET last_login = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([$admin['id']]);

    echo json_encode([
        'success' => true,
        'message' => '로그인 성공',
        'data' => [
            'username' => $admin['username'],
            'role' => $admin['role']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => '서버 오류가 발생했습니다.']);
} 