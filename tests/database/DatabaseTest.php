<?php
use PHPUnit\Framework\TestCase;

class DatabaseTest extends TestCase {
    private $db;

    protected function setUp(): void {
        $this->db = new PDO('mysql:host=localhost;dbname=test_db', 'user', 'password');
    }

    public function testBetHistoryInsert() {
        $stmt = $this->db->prepare("
            INSERT INTO betting_history (
                user_id, game_id, bet_option, amount, status
            ) VALUES (?, ?, ?, ?, ?)
        ");

        $result = $stmt->execute([1, 1, '1', 10000, 'active']);
        $this->assertTrue($result);
    }

    public function testGameHistoryQuery() {
        $stmt = $this->db->prepare("
            SELECT * FROM game_history 
            WHERE DATE(created_at) = CURDATE()
        ");

        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $this->assertNotEmpty($results);
    }
} 