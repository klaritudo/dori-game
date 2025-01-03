<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../server/db.php';

try {
    session_start();
    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['error' => '관리자 권한이 필요합니다.']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    // 필수 필드 검증
    $required = ['timer_duration', 'betting_end_time', 'min_bet', 'max_bet'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => '모든 설정값을 입력해주세요.']);
            exit;
        }
    }

    // 값 검증
    if ($data['timer_duration'] < 10 || $data['timer_duration'] > 300) {
        http_response_code(400);
        echo json_encode(['error' => '게임 시간은 10초에서 300초 사이여야 합니다.']);
        exit;
    }

    if ($data['betting_end_time'] >= $data['timer_duration']) {
        http_response_code(400);
        echo json_encode(['error' => '베팅 마감 시간은 게임 시간보다 작아야 합니다.']);
        exit;
    }

    // 설정 업데이트
    $stmt = $db->prepare("
        INSERT INTO game_settings (
            timer_duration,
            betting_end_time,
            min_bet,
            max_bet,
            created_at
        ) VALUES (?, ?, ?, ?, NOW())
    ");

    $stmt->execute([
        $data['timer_duration'],
        $data['betting_end_time'],
        $data['min_bet'],
        $data['max_bet']
    ]);

    // WebSocket 서버에 설정 변경 알림
    $ws_message = json_encode([
        'type' => 'SETTINGS_UPDATE',
        'data' => $data
    ]);

    // WebSocket 클라이언트들에게 브로드캐스트
    $context = new ZMQContext();
    $socket = $context->getSocket(ZMQ::SOCKET_PUSH);
    $socket->connect("tcp://localhost:5555");
    $socket->send($ws_message);

    echo json_encode([
        'success' => true,
        'message' => '게임 설정이 업데이트되었습니다.',
        'data' => $data
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => '서버 오류가 발생했습니다.']);
} 