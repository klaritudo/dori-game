<?php
require_once '../../config/database.php';
require_once '../../middleware/admin-auth.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    // 게임 상태 확인
    $stmt = $pdo->query("SELECT status FROM game_history WHERE status = 'running' LIMIT 1");
    if ($stmt->fetch()) {
        throw new Exception('게임 중에는 설정을 변경할 수 없습니다.');
    }

    // 유효성 검사
    if ($data['min_bet'] <= 0 || $data['max_bet'] <= 0 || $data['odds'] <= 1) {
        throw new Exception('잘못된 설정값입니다.');
    }

    $stmt = $pdo->prepare("
        UPDATE betting_options 
        SET min_bet = :min_bet,
            max_bet = :max_bet,
            odds = :odds,
            is_active = :is_active,
            updated_at = CURRENT_TIMESTAMP
        WHERE option_name = :option_name
    ");

    $stmt->execute([
        'min_bet' => $data['min_bet'],
        'max_bet' => $data['max_bet'],
        'odds' => $data['odds'],
        'is_active' => $data['is_active'],
        'option_name' => $data['option_name']
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 