<?php
require_once '../../config/database.php';
require_once '../../middleware/admin-auth.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $data['result'];
    
    // 트랜잭션 시작
    $pdo->beginTransaction();
    
    // 현재 게임 정보 조회
    $stmt = $pdo->prepare("
        SELECT id, game_number, status 
        FROM game_history 
        WHERE status = 'closed' 
        ORDER BY id DESC LIMIT 1
    ");
    $stmt->execute();
    $game = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$game) {
        throw new Exception('처리할 게임이 없습니다.');
    }
    
    // 게임 결과 업데이트
    $stmt = $pdo->prepare("
        UPDATE game_history 
        SET result = :result, 
            status = 'ended',
            end_time = CURRENT_TIMESTAMP 
        WHERE id = :game_id
    ");
    $stmt->execute([
        'result' => $result,
        'game_id' => $game['id']
    ]);
    
    // 베팅 결과 처리
    $stmt = $pdo->prepare("
        SELECT bh.*, bo.odds 
        FROM betting_history bh
        JOIN betting_options bo ON bh.bet_option = bo.option_name
        WHERE bh.game_id = :game_id AND bh.status = 'active'
    ");
    $stmt->execute(['game_id' => $game['id']]);
    $bets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $totalPayout = 0;
    foreach ($bets as $bet) {
        $payout = 0;
        if ($bet['bet_option'] === $result) {
            $payout = $bet['amount'] * $bet['odds'];
            // 수수료 적용
            $commission = $payout * $settings['commission_rate'];
            $payout -= $commission;
        }
        
        // 베팅 상태 업데이트
        $stmt = $pdo->prepare("
            UPDATE betting_history 
            SET status = 'settled',
                payout = :payout 
            WHERE id = :bet_id
        ");
        $stmt->execute([
            'payout' => $payout,
            'bet_id' => $bet['id']
        ]);
        
        // 사용자 잔액 업데이트
        if ($payout > 0) {
            $stmt = $pdo->prepare("
                UPDATE users 
                SET balance = balance + :payout 
                WHERE id = :user_id
            ");
            $stmt->execute([
                'payout' => $payout,
                'user_id' => $bet['user_id']
            ]);
        }
        
        $totalPayout += $payout;
    }
    
    // 게임 통계 업데이트
    $stmt = $pdo->prepare("
        UPDATE game_history 
        SET total_payout = :total_payout,
            profit = total_bet - :total_payout
        WHERE id = :game_id
    ");
    $stmt->execute([
        'total_payout' => $totalPayout,
        'game_id' => $game['id']
    ]);
    
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'game_number' => $game['game_number'],
        'result' => $result,
        'total_payout' => $totalPayout
    ]);
    
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '결과처리 오류가 발생하였습니다.'
    ]);
} 