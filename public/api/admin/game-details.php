<?php
require_once '../../config/database.php';
require_once '../../middleware/admin-auth.php';

try {
    $gameNumber = $_GET['game_number'];
    
    $stmt = $pdo->prepare("
        SELECT gh.*, 
               JSON_UNQUOTE(gh.result_details) as details,
               SUM(bh.amount) as total_bet,
               SUM(bh.payout) as total_payout,
               (SUM(bh.amount) - SUM(bh.payout)) as profit
        FROM game_history gh
        LEFT JOIN betting_history bh ON gh.id = bh.game_id
        WHERE gh.game_number = :game_number
        GROUP BY gh.id
    ");
    
    $stmt->execute(['game_number' => $gameNumber]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$game) {
        throw new Exception('게임을 찾을 수 없습니다.');
    }
    
    // 베팅 상세 정보 조회
    $stmt = $pdo->prepare("
        SELECT bh.*, u.username
        FROM betting_history bh
        JOIN users u ON bh.user_id = u.id
        WHERE bh.game_id = :game_id
    ");
    
    $stmt->execute(['game_id' => $game['id']]);
    $bets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $game['bets'] = $bets;
    
    echo json_encode([
        'success' => true,
        'data' => $game
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 