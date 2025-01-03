<?php
use PHPUnit\Framework\TestCase;

class AdminApiTest extends TestCase {
    private $helper;
    private $adminToken;

    protected function setUp(): void {
        $this->helper = new TestHelper();
        // 관리자 로그인
        $response = $this->helper->makeRequest('POST', '/api/admin/login.php', [
            'username' => 'admin',
            'password' => 'admin123'
        ]);
        $this->adminToken = $response['data']['token'];
    }

    public function testGameSettings() {
        $response = $this->helper->makeRequest('POST', '/api/admin/update-settings.php', [
            'timer_duration' => 60,
            'betting_end_time' => 50,
            'min_bet' => 1000,
            'max_bet' => 1000000
        ], ['Authorization: Bearer ' . $this->adminToken]);

        $this->assertEquals(200, $response['status']);
    }

    public function testCancelBet() {
        $response = $this->helper->makeRequest('POST', '/api/admin/cancel-bet.php', [
            'bet_id' => 1
        ], ['Authorization: Bearer ' . $this->adminToken]);

        $this->assertEquals(200, $response['status']);
    }
} 