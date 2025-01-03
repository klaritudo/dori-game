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
    $bet_id = $data['bet_id'] ?? null;

    if (!$bet_id) {
        http_response_code(400);
        echo json_encode(['error' => '베팅 ID가 필요합니다.']);
        exit;
    }

    $db->beginTransaction();

    // 베팅 정보 조회
    $stmt = $db->prepare("
        SELECT bh.*, u.balance 
        FROM betting_history bh
        JOIN users u ON bh.user_id = u.id
        WHERE bh.id = ? AND bh.status = 'active'
    ");
    $stmt->execute([$bet_id]);
    $bet = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$bet) {
        $db->rollBack();
        http_response_code(404);
        echo json_encode(['error' => '해당 베팅을 찾을 수 없거나 이미 처리되었습니다.']);
        exit;
    }

    // 베팅 취소 처리
    $stmt = $db->prepare("
        UPDATE betting_history 
        SET status = 'cancelled', 
            updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([$bet_id]);

    // 베팅 금액 환불
    $stmt = $db->prepare("
        UPDATE users 
        SET balance = balance + ? 
        WHERE id = ?
    ");
    $stmt->execute([$bet['amount'], $bet['user_id']]);

    // 환불 내역 기록
    $stmt = $db->prepare("
        INSERT INTO balance_history (
            user_id, amount, balance, type, reference_id, description
        ) VALUES (?, ?, ?, 'refund', ?, '베팅 취소 환불')
    ");
    $stmt->execute([
        $bet['user_id'],
        $bet['amount'],
        $bet['balance'] + $bet['amount'],
        $bet_id
    ]);

    $db->commit();

    echo json_encode([
        'success' => true,
        'message' => '베팅이 취소되었습니다.'
    ]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => '서버 오류가 발생했습니다.']);
} 