<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../server/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['phone'])) {
        http_response_code(400);
        echo json_encode(['error' => '휴대폰 번호를 입력해주세요.']);
        exit;
    }

    // 이전 인증 코드 만료 처리
    $stmt = $db->prepare("
        UPDATE phone_verifications 
        SET verified = false 
        WHERE phone_number = ? AND verified = false
    ");
    $stmt->execute([$data['phone']]);

    // 새 인증 코드 생성
    $code = sprintf("%06d", rand(0, 999999));
    
    // 인증 코드 저장
    $stmt = $db->prepare("
        INSERT INTO phone_verifications (
            phone_number, verification_code, expires_at
        ) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 3 MINUTE))
    ");
    
    $stmt->execute([$data['phone'], $code]);

    // 실제 환경에서는 SMS 발송 로직 구현
    // sendSMS($data['phone'], "인증번호: {$code}");

    echo json_encode([
        'success' => true,
        'message' => '인증번호가 발송되었습니다.',
        'code' => $code // 개발용, 실제 환경에서는 제거
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => '서버 오류가 발생했습니다.']);
} 