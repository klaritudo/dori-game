<?php
use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/../../public/ex/js/game-state.js';

class GameStateTest extends TestCase {
    private $gameState;

    protected function setUp(): void {
        $this->gameState = new GameState();
    }

    public function testInitialState() {
        $this->assertEquals('waiting', $this->gameState->getStatus());
        $this->assertEquals(0, $this->gameState->getRemainingTime());
        $this->assertEmpty($this->gameState->getBetTotals());
    }

    public function testUpdateGameStatus() {
        $gameData = [
            'status' => 'running',
            'currentGame' => [
                'id' => 1,
                'game_number' => 'G001',
                'start_time' => '2024-01-01 00:00:00'
            ]
        ];

        $this->gameState->updateGameStatus($gameData);
        
        $this->assertEquals('running', $this->gameState->getStatus());
        $this->assertEquals('G001', $this->gameState->getCurrentGame()['game_number']);
    }

    public function testBetTotalCalculation() {
        // 베팅 업데이트 테스트
        $this->gameState->updateBetTotal('1', 10000);
        $this->gameState->updateBetTotal('1', 5000);
        $this->gameState->updateBetTotal('홀', 20000);

        $betTotals = $this->gameState->getBetTotals();
        
        $this->assertEquals(15000, $betTotals['1']);
        $this->assertEquals(20000, $betTotals['홀']);
        $this->assertEquals(0, $betTotals['2'] ?? 0);
    }

    public function testBettingTimeValidation() {
        // 베팅 가능 시간 테스트
        $this->gameState->updateTimer(['remaining' => 45]);
        $this->assertTrue($this->gameState->isBettingAllowed());

        $this->gameState->updateTimer(['remaining' => 5]);
        $this->assertFalse($this->gameState->isBettingAllowed());
    }

    public function testGameReset() {
        // 게임 리셋 테스트
        $this->gameState->updateBetTotal('1', 10000);
        $this->gameState->resetGame();

        $this->assertEquals('waiting', $this->gameState->getStatus());
        $this->assertEmpty($this->gameState->getBetTotals());
    }
} 