<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../server/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['user_id'] ?? null;
    $page = max(1, intval($data['page'] ?? 1));
    $limit = 20;
    $offset = ($page - 1) * $limit;

    $where = [];
    $params = [];

    if ($userId) {
        $where[] = "bh.user_id = ?";
        $params[] = $userId;
    }

    $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

    $stmt = $db->prepare("
        SELECT 
            bh.id,
            bh.game_id,
            gh.game_number,
            bh.bet_option,
            bh.amount,
            bh.status,
            bh.payout_amount,
            gh.result,
            bh.created_at
        FROM betting_history bh
        JOIN game_history gh ON bh.game_id = gh.id
        {$whereClause}
        ORDER BY bh.created_at DESC
        LIMIT ? OFFSET ?
    ");

    $params[] = $limit;
    $params[] = $offset;
    $stmt->execute($params);

    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 전체 레코드 수 조회
    $stmt = $db->prepare("
        SELECT COUNT(*) as total 
        FROM betting_history bh
        {$whereClause}
    ");
    
    if (!empty($params)) {
        array_pop($params); // limit 제거
        array_pop($params); // offset 제거
        $stmt->execute($params);
    } else {
        $stmt->execute();
    }

    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    $totalPages = ceil($total / $limit);

    echo json_encode([
        'success' => true,
        'data' => [
            'history' => $history,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => $totalPages,
                'total_records' => $total
            ]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '서버 오류가 발생했습니다.'
    ]);
} 