<?php
require_once __DIR__ . '/../config/test-config.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST,
        DB_USER,
        DB_PASS
    );

    // 테스트 데이터베이스 생성
    $pdo->exec("DROP DATABASE IF EXISTS " . DB_NAME);
    $pdo->exec("CREATE DATABASE " . DB_NAME);
    $pdo->exec("USE " . DB_NAME);

    // 테이블 생성
    $sql = file_get_contents(__DIR__ . '/../../database/tables.sql');
    $pdo->exec($sql);

    // 테스트 데이터 추가
    $pdo->exec("
        INSERT INTO users (username, password, phone, role) VALUES 
        ('admin', '" . password_hash('admin123', PASSWORD_DEFAULT) . "', '01012345678', 'admin'),
        ('testuser', '" . password_hash('password123', PASSWORD_DEFAULT) . "', '01087654321', 'user')
    ");

    echo "Test database initialized successfully\n";
} catch (PDOException $e) {
    die("DB ERROR: " . $e->getMessage());
} 