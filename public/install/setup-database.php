<?php
require_once '../config/database.php';

try {
    // tables.sql 파일 읽기
    $sql = file_get_contents(__DIR__ . '/../../database/tables.sql');
    
    // SQL 문을 개별 쿼리로 분리
    $queries = array_filter(explode(';', $sql), 'trim');
    
    // 각 쿼리 개별 실행
    foreach ($queries as $query) {
        if (!empty($query)) {
            $pdo->exec($query);
            echo "쿼리 실행 성공: " . substr($query, 0, 50) . "...<br>";
        }
    }
    
    echo "데이터베이스 테이블이 성공적으로 생성되었습니다.";
} catch (PDOException $e) {
    die("데이터베이스 설정 오류: " . $e->getMessage() . "<br>Query: " . $query);
} 