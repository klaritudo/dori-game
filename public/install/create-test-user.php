<?php
require_once '../config/database.php';

try {
    // 비밀번호 해시 생성 (비밀번호: test123)
    $password_hash = password_hash('test123', PASSWORD_DEFAULT);
    
    // 테스트 계정 추가
    $sql = "INSERT INTO users (username, password, phone, role, balance) 
            VALUES (:username, :password, :phone, :role, :balance)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'username' => 'test',
        'password' => $password_hash,
        'phone' => '01012345678',
        'role' => 'user',
        'balance' => 1000000
    ]);
    
    echo "테스트 계정이 생성되었습니다.\n";
    echo "아이디: test\n";
    echo "비밀번호: test123\n";
    
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // 중복 키 에러
        echo "테스트 계정이 이미 존재합니다.\n";
    } else {
        echo "에러 발생: " . $e->getMessage() . "\n";
    }
} 