<?php
use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/../../public/server/GameLogic.php';
require_once __DIR__ . '/../mocks/MockGameState.php';

class GameLogicTest extends TestCase {
    private $gameLogic;
    private $mockGameState;
    private $helper;
    private $token;

    protected function setUp(): void {
        $this->helper = new TestHelper();
        $this->mockGameState = new MockGameState();
        $this->gameLogic = new GameLogic($this->mockGameState);

        // 테스트 유저 로그인
        $response = $this->helper->makeRequest('POST', '/api/auth/login.php', [
            'username' => 'testuser',
            'password' => 'password123'
        ]);
        $this->token = $response['data']['token'];
    }

    public function testBettingFlow() {
        // 1. 게임 시작
        $this->gameLogic->startGame();
        $this->assertEquals('running', $this->mockGameState->getStatus());

        // 2. 베팅 처리
        $betResult = $this->gameLogic->processBet([
            'user_id' => 1,
            'bet_option' => '1',
            'amount' => 10000
        ]);
        $this->assertTrue($betResult['success']);

        // 베팅 총액 확인
        $betTotals = $this->mockGameState->getBetTotals();
        $this->assertEquals(10000, $betTotals['1']);

        // 3. API를 통한 베팅 테스트
        $response = $this->helper->makeRequest('POST', '/api/game/place-bet.php', [
            'bet_option' => '1',
            'amount' => 10000
        ], ['Authorization: Bearer ' . $this->token]);

        $this->assertEquals(200, $response['status']);
        $this->assertTrue($response['data']['success']);

        // 4. 베팅 내역 확인
        $response = $this->helper->makeRequest('GET', '/api/game/betting-history.php', null, [
            'Authorization: Bearer ' . $this->token
        ]);
        $this->assertNotEmpty($response['data']);
    }

    public function testInvalidBetting() {
        $this->gameLogic->startGame();

        // 1. 잘못된 베팅 금액
        $result = $this->gameLogic->processBet([
            'user_id' => 1,
            'bet_option' => '1',
            'amount' => -1000
        ]);
        $this->assertFalse($result['success']);

        // 2. 잘못된 베팅 옵션
        $result = $this->gameLogic->processBet([
            'user_id' => 1,
            'bet_option' => 'invalid',
            'amount' => 10000
        ]);
        $this->assertFalse($result['success']);

        // 3. 베팅 시간 초과
        $this->mockGameState->updateTimer(['remaining' => 5]);
        $result = $this->gameLogic->processBet([
            'user_id' => 1,
            'bet_option' => '1',
            'amount' => 10000
        ]);
        $this->assertFalse($result['success']);
    }

    public function testGameResult() {
        $this->gameLogic->startGame();

        // 베팅 추가
        $this->gameLogic->processBet([
            'user_id' => 1,
            'bet_option' => '1',
            'amount' => 10000
        ]);

        // 게임 결과 처리
        $result = $this->gameLogic->endGame();
        
        $this->assertArrayHasKey('result', $result);
        $this->assertArrayHasKey('bet_totals', $result);
        $this->assertEquals(10000, $result['bet_totals']['1']);
    }

    protected function tearDown(): void {
        $this->helper->cleanupTestData();
    }
} 