<?php
require_once '../config/database.php';

try {
    // game_history 테이블 구조 확인
    $sql = "DESCRIBE game_history";
    $stmt = $pdo->query($sql);
    $columns = $stmt->fetchAll();
    
    echo "=== game_history 테이블 구조 ===\n";
    foreach ($columns as $column) {
        echo "{$column['Field']}: {$column['Type']} {$column['Null']} {$column['Key']} {$column['Default']}\n";
    }
    
    // betting_history 테이블과의 관계 확인
    $sql = "SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
    FROM
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE
        REFERENCED_TABLE_NAME = 'game_history'
        AND TABLE_SCHEMA = 'newmoon'";
    
    $stmt = $pdo->query($sql);
    $relations = $stmt->fetchAll();
    
    echo "\n=== 외래 키 관계 ===\n";
    foreach ($relations as $relation) {
        echo "테이블 {$relation['TABLE_NAME']}의 {$relation['COLUMN_NAME']}이(가) ";
        echo "game_history의 {$relation['REFERENCED_COLUMN_NAME']}을(를) 참조합니다.\n";
    }
    
    // 테스트 데이터 삽입 시도
    $pdo->beginTransaction();
    
    $sql = "INSERT INTO game_history 
            (game_number, status, result, result_details, total_bet, total_payout, profit, start_time) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $testData = [
        'TEST001',
        'waiting',
        null,
        json_encode(['test' => true]),
        1000.00,
        0.00,
        0.00
    ];
    
    $stmt->execute($testData);
    
    echo "\n=== 테스트 데이터 삽입 성공 ===\n";
    
    // 삽입된 데이터 확인
    $sql = "SELECT * FROM game_history WHERE game_number = 'TEST001'";
    $stmt = $pdo->query($sql);
    $testRecord = $stmt->fetch();
    
    echo "삽입된 데이터: \n";
    print_r($testRecord);
    
    // 테스트 데이터 정리
    $sql = "DELETE FROM game_history WHERE game_number = 'TEST001'";
    $pdo->exec($sql);
    
    $pdo->commit();
    
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    die("검증 오류: " . $e->getMessage() . "\n");
} 