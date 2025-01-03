<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../server/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['phone']) || !isset($data['code'])) {
        http_response_code(400);
        echo json_encode(['error' => '필수 정보가 누락되었습니다.']);
        exit;
    }

    $stmt = $db->prepare("
        SELECT * FROM phone_verifications 
        WHERE phone_number = ? 
        AND verification_code = ? 
        AND verified = false 
        AND expires_at > NOW()
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    
    $stmt->execute([$data['phone'], $data['code']]);
    $verification = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$verification) {
        http_response_code(400);
        echo json_encode(['error' => '인증번호가 올바르지 않거나 만료되었습니다.']);
        exit;
    }

    // 인증 성공 처리
    $stmt = $db->prepare("
        UPDATE phone_verifications 
        SET verified = true 
        WHERE id = ?
    ");
    $stmt->execute([$verification['id']]);

    echo json_encode([
        'success' => true,
        'message' => '인증이 완료되었습니다.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => '서버 오류가 발생했습니다.']);
} 