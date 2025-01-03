<?php
class MockGameState {
    private $status = 'waiting';
    private $betTotals = [];
    private $remainingTime = 60;

    public function updateGameStatus($data) {
        $this->status = $data['status'];
    }

    public function updateBetTotal($option, $amount) {
        if (!isset($this->betTotals[$option])) {
            $this->betTotals[$option] = 0;
        }
        $this->betTotals[$option] += $amount;
    }

    public function updateTimer($data) {
        $this->remainingTime = $data['remaining'];
    }

    public function getStatus() {
        return $this->status;
    }

    public function getBetTotals() {
        return $this->betTotals;
    }

    public function getRemainingTime() {
        return $this->remainingTime;
    }

    public function isBettingAllowed() {
        return $this->status === 'running' && $this->remainingTime > 10;
    }
} 