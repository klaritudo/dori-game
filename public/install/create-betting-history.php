<?php
require_once '../config/database.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS betting_history (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        game_id INT NOT NULL,
        bet_option VARCHAR(10) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        status ENUM('active', 'cancelled', 'settled') NOT NULL,
        payout DECIMAL(15,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES game_history(id) ON DELETE RESTRICT ON UPDATE CASCADE
    )";
    
    $pdo->exec($sql);
    echo "betting_history 테이블이 성공적으로 생성되었습니다.\n";
    
    // 테스트 데이터 생성
    $pdo->beginTransaction();
    
    // 1. game_history 테스트 레코드 생성
    $sql = "INSERT INTO game_history (game_number, status) VALUES ('TEST002', 'waiting')";
    $pdo->exec($sql);
    $gameId = $pdo->lastInsertId();
    
    // 2. betting_history 테스트 레코드 생성
    $sql = "INSERT INTO betting_history (user_id, game_id, bet_option, amount, status) 
            VALUES (1, ?, '홀', 1000.00, 'active')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$gameId]);
    
    echo "테스트 데이터 생성 성공\n";
    
    // 3. 관계 확인
    $sql = "SELECT bh.*, gh.game_number 
            FROM betting_history bh 
            JOIN game_history gh ON bh.game_id = gh.id 
            WHERE gh.game_number = 'TEST002'";
    $stmt = $pdo->query($sql);
    $testData = $stmt->fetch();
    
    echo "연관 데이터 확인:\n";
    print_r($testData);
    
    // 4. 테스트 데이터 정리
    $sql = "DELETE FROM betting_history WHERE game_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$gameId]);
    
    $sql = "DELETE FROM game_history WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$gameId]);
    
    $pdo->commit();
    
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    die("테이블 생성 오류: " . $e->getMessage());
} 