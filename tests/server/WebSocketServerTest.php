<?php
use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/../../public/server/WebSocketServer.php';
require_once __DIR__ . '/MockWebSocketConnection.php';

class WebSocketServerTest extends TestCase {
    private $server;
    private $mockConnection;

    protected function setUp(): void {
        $this->server = new WebSocketServer();
        $this->mockConnection = new MockWebSocketConnection();
        $this->server->addClient($this->mockConnection, 1); // user_id = 1
    }

    public function testGameCycle() {
        // 게임 시작
        $this->server->startGame();
        $this->assertEquals('running', $this->server->getGameStatus());
        
        // 첫 번째 메시지는 게임 상태여야 함
        $message = json_decode($this->mockConnection->messages[0], true);
        $this->assertEquals('game_status', $message['type']);
        $this->assertEquals('running', $message['data']['status']);

        // 베팅 처리
        $this->server->handleBet([
            'user_id' => 1,
            'bet_option' => '1',
            'amount' => 10000
        ]);
        
        // 베팅 업데이트 메시지 확인
        $betMessage = json_decode($this->mockConnection->messages[1], true);
        $this->assertEquals('bet_update', $betMessage['type']);
        $this->assertEquals(10000, $betMessage['data']['amount']);

        // 게임 종료
        $result = $this->server->endGame();
        $this->assertNotNull($result);
        
        // 결과 메시지 확인
        $resultMessage = json_decode($this->mockConnection->messages[2], true);
        $this->assertEquals('game_result', $resultMessage['type']);
    }

    public function testBroadcast() {
        $testMessage = [
            'type' => 'game_status',
            'data' => ['status' => 'running']
        ];
        
        $this->server->broadcast($testMessage);
        
        // 브로드캐스트된 메시지 확인
        $lastMessage = json_decode($this->mockConnection->messages[0], true);
        $this->assertEquals($testMessage['type'], $lastMessage['type']);
        $this->assertEquals($testMessage['data'], $lastMessage['data']);
    }

    public function testInvalidBet() {
        $this->server->startGame();

        // 잘못된 베팅 금액
        $result = $this->server->handleBet([
            'user_id' => 1,
            'bet_option' => '1',
            'amount' => -1000
        ]);

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('잘못된 베팅', $result['message']);
    }

    protected function tearDown(): void {
        $this->server->removeClient($this->mockConnection);
    }
} 