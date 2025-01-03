<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../server/db.php';

try {
    // 관리자 권한 확인
    session_start();
    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['error' => '관리자 권한이 필요합니다.']);
        exit;
    }

    // 오늘의 통계
    $stmt = $db->prepare("
        SELECT 
            COUNT(DISTINCT game_id) as total_games,
            COUNT(id) as total_bets,
            SUM(amount) as total_bet_amount,
            SUM(payout_amount) as total_payout
        FROM betting_history
        WHERE DATE(created_at) = CURDATE()
    ");
    $stmt->execute();
    $today_stats = $stmt->fetch(PDO::FETCH_ASSOC);

    // 실시간 베팅 현황
    $stmt = $db->prepare("
        SELECT 
            bh.bet_option,
            COUNT(bh.id) as bet_count,
            SUM(bh.amount) as total_amount,
            u.username,
            u.nickname
        FROM betting_history bh
        JOIN users u ON bh.user_id = u.id
        WHERE bh.game_id = (
            SELECT id FROM game_history 
            WHERE status = 'running' 
            ORDER BY created_at DESC 
            LIMIT 1
        )
        GROUP BY bh.bet_option
    ");
    $stmt->execute();
    $current_bets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 최근 게임 결과
    $stmt = $db->prepare("
        SELECT 
            game_number,
            result,
            total_bet,
            total_payout,
            profit,
            created_at
        FROM game_history
        WHERE status = 'ended'
        ORDER BY created_at DESC
        LIMIT 10
    ");
    $stmt->execute();
    $recent_games = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => [
            'today_stats' => $today_stats,
            'current_bets' => $current_bets,
            'recent_games' => $recent_games
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => '서버 오류가 발생했습니다.']);
} 