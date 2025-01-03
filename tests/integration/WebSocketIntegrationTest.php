<?php
use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/../../public/server/WebSocketServer.php';
require_once __DIR__ . '/../../public/ex/js/websocket-client.js';

class WebSocketIntegrationTest extends TestCase {
    private $server;
    private $client;
    private $testUserId = 1;

    protected function setUp(): void {
        // WebSocket 서버 시작
        $this->server = new WebSocketServer();
        
        // 테스트용 클라이언트 연결
        $this->client = new WebSocketTestClient([
            'url' => 'ws://localhost:8081',
            'userId' => $this->testUserId
        ]);

        // 연결 대기
        sleep(1);
    }

    public function testGameFlow() {
        // 1. 게임 시작 메시지 수신 확인
        $this->client->on('game_status', function($data) {
            $this->assertEquals('running', $data['status']);
            $this->assertNotNull($data['currentGame']);
        });

        $this->server->startGame();
        
        // 2. 베팅 처리 테스트
        $betData = [
            'user_id' => $this->testUserId,
            'bet_option' => '1',
            'amount' => 10000
        ];

        $this->client->send('PLACE_BET', $betData);
        
        $this->client->on('bet_update', function($data) use ($betData) {
            $this->assertEquals($betData['bet_option'], $data['bet_option']);
            $this->assertEquals($betData['amount'], $data['amount']);
        });

        // 3. 게임 결과 수신 확인
        $this->client->on('game_result', function($data) {
            $this->assertArrayHasKey('result', $data);
            $this->assertArrayHasKey('game_number', $data);
            $this->assertArrayHasKey('bet_totals', $data);
        });

        $this->server->endGame();
    }

    public function testMultipleClients() {
        // 여러 클라이언트 동시 접속 테스트
        $client2 = new WebSocketTestClient([
            'url' => 'ws://localhost:8081',
            'userId' => 2
        ]);

        $messageReceived = [false, false];

        $this->client->on('game_status', function() use (&$messageReceived) {
            $messageReceived[0] = true;
        });

        $client2->on('game_status', function() use (&$messageReceived) {
            $messageReceived[1] = true;
        });

        $this->server->startGame();
        sleep(1);

        $this->assertTrue($messageReceived[0]);
        $this->assertTrue($messageReceived[1]);
    }

    public function testReconnection() {
        // 재연결 테스트
        $this->client->close();
        sleep(1);

        $this->client->connect();
        sleep(1);

        $connected = false;
        $this->client->onOpen(function() use (&$connected) {
            $connected = true;
        });

        $this->assertTrue($connected);
    }

    protected function tearDown(): void {
        $this->client->close();
        // 서버 종료
        $this->server->stop();
    }
} 