<?php
use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/../../public/server/BetCalculator.php';

class BetCalculatorTest extends TestCase {
    private $calculator;

    protected function setUp(): void {
        $this->calculator = new BetCalculator();
    }

    public function testNumberBetPayout() {
        // 숫자 베팅 테스트
        $bet = ['bet_option' => '1', 'amount' => 10000];
        
        // 승리 케이스
        $payout = $this->calculator->calculatePayout($bet, '1');
        $this->assertEquals(29500, $payout); // 1:2.95 배당

        // 패배 케이스
        $payout = $this->calculator->calculatePayout($bet, '2');
        $this->assertEquals(0, $payout);
    }

    public function testOddEvenPayout() {
        // 홀짝 베팅 테스트
        $oddBet = ['bet_option' => '홀', 'amount' => 10000];
        $evenBet = ['bet_option' => '짝', 'amount' => 10000];

        // 홀수 결과
        $payout = $this->calculator->calculatePayout($oddBet, '1');
        $this->assertEquals(19500, $payout); // 1:1.95 배당

        // 짝수 결과
        $payout = $this->calculator->calculatePayout($evenBet, '2');
        $this->assertEquals(19500, $payout);
    }

    public function testInvalidBetOption() {
        // 잘못된 베팅 옵션 테스트
        $bet = ['bet_option' => 'invalid', 'amount' => 10000];
        
        $this->expectException(InvalidArgumentException::class);
        $this->calculator->calculatePayout($bet, '1');
    }

    public function testNegativeAmount() {
        // 음수 베팅 금액 테스트
        $bet = ['bet_option' => '1', 'amount' => -1000];
        
        $this->expectException(InvalidArgumentException::class);
        $this->calculator->calculatePayout($bet, '1');
    }
} 