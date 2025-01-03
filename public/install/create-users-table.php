<?php
require_once '../config/database.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        balance DECIMAL(15,2) DEFAULT 0,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    echo "users 테이블이 생성되었습니다.\n";
    
} catch (PDOException $e) {
    die("테이블 생성 오류: " . $e->getMessage() . "\n");
} 