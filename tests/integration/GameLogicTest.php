<?php
use PHPUnit\Framework\TestCase;

class GameLogicTest extends TestCase {
    private $helper;
    private $token;

    protected function setUp(): void {
        $this->helper = new TestHelper();
        // 테스트 유저 로그인
        $response = $this->helper->makeRequest('POST', '/api/auth/login.php', [
            'username' => 'testuser',
            'password' => 'password123'
        ]);
        $this->token = $response['data']['token'];
    }

    public function testCompleteBettingFlow() {
        // 1. 잔액 확인
        $response = $this->helper->makeRequest('GET', '/api/user/balance.php', null, [
            'Authorization: Bearer ' . $this->token
        ]);
        $initialBalance = $response['data']['balance'];

        // 2. 베팅
        $betData = [
            'bet_option' => '1',
            'amount' => 10000
        ];
        $response = $this->helper->makeRequest('POST', '/api/game/place-bet.php', $betData, [
            'Authorization: Bearer ' . $this->token
        ]);
        $this->assertEquals(200, $response['status']);

        // 3. 베팅 후 잔액 확인
        $response = $this->helper->makeRequest('GET', '/api/user/balance.php', null, [
            'Authorization: Bearer ' . $this->token
        ]);
        $this->assertEquals($initialBalance - 10000, $response['data']['balance']);

        // 4. 베팅 내역 확인
        $response = $this->helper->makeRequest('GET', '/api/game/betting-history.php', null, [
            'Authorization: Bearer ' . $this->token
        ]);
        $this->assertNotEmpty($response['data']);
    }
} 