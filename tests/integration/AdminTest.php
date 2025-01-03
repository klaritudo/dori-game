<?php
use PHPUnit\Framework\TestCase;

class AdminTest extends TestCase {
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

    public function testGameManagement() {
        // 1. 게임 설정 변경
        $settingsData = [
            'timer_duration' => 60,
            'betting_end_time' => 50,
            'min_bet' => 1000,
            'max_bet' => 1000000
        ];
        
        $response = $this->helper->makeRequest('POST', '/api/admin/update-settings.php', 
            $settingsData, 
            ['Authorization: Bearer ' . $this->adminToken]
        );
        $this->assertEquals(200, $response['status']);

        // 2. 베팅 취소
        $response = $this->helper->makeRequest('POST', '/api/admin/cancel-bet.php', 
            ['bet_id' => 1], 
            ['Authorization: Bearer ' . $this->adminToken]
        );
        $this->assertEquals(200, $response['status']);

        // 3. 대시보드 데이터 조회
        $response = $this->helper->makeRequest('GET', '/api/admin/dashboard.php', null, 
            ['Authorization: Bearer ' . $this->adminToken]
        );
        $this->assertEquals(200, $response['status']);
        $this->assertArrayHasKey('total_bets', $response['data']);
    }
} 