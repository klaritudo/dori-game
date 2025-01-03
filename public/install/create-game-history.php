<?php
require_once '../config/database.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS game_history (
        id INT PRIMARY KEY AUTO_INCREMENT,
        game_number VARCHAR(20) UNIQUE NOT NULL,
        status ENUM('waiting', 'running', 'closed', 'ended') NOT NULL,
        result VARCHAR(10) NULL,
        result_details JSON NULL,
        total_bet DECIMAL(15,2) DEFAULT 0,
        total_payout DECIMAL(15,2) DEFAULT 0,
        profit DECIMAL(15,2) DEFAULT 0,
        start_time TIMESTAMP NULL,
        end_time TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    echo "game_history 테이블이 성공적으로 생성되었습니다.";
} catch (PDOException $e) {
    die("테이블 생성 오류: " . $e->getMessage());
} 