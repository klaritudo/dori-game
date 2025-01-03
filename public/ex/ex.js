import { WebSocketClient } from './js/websocket-client.js';
import { BettingPlugin } from './betting-plugin.js';

class GameClient {
    constructor() {
        this.wsClient = new WebSocketClient();
        if (!this.wsClient.checkAuth()) {
            return;
        }
        this.bettingPlugin = new BettingPlugin(this.wsClient);
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 게임 상태 업데이트
        this.wsClient.on('game_status', (data) => {
            this.updateGameStatus(data);
        });

        // 타이머 업데이트
        this.wsClient.on('timer_update', (data) => {
            this.updateTimer(data);
        });

        // 베팅 종료
        this.wsClient.on('betting_end', () => {
            this.disableBetting();
        });

        // 게임 결과
        this.wsClient.on('game_result', (data) => {
            this.showResult(data);
        });

        // 잔액 업데이트
        this.wsClient.on('balance_update', (data) => {
            this.updateBalance(data);
        });

        // 베팅 버튼 이벤트
        document.querySelectorAll('.betting-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const option = e.target.dataset.option;
                const amount = document.querySelector('#betting-amount').value;
                this.bettingPlugin.placeBet(option, amount);
            });
        });
    }

    updateGameStatus(data) {
        const { status, currentGame } = data;
        
        if (status === 'running') {
            this.enableBetting();
                } else {
            this.disableBetting();
        }

        // 게임 번호 업데이트
        if (currentGame) {
            document.querySelector('.game-number').textContent = currentGame.game_number;
        }
    }

    updateTimer(data) {
        const { remaining, betting_remaining } = data;
        document.querySelector('.timer').textContent = remaining;
        
        if (betting_remaining <= 0) {
            this.disableBetting();
        }
    }

    enableBetting() {
        document.querySelectorAll('.betting-button').forEach(btn => {
            btn.disabled = false;
        });
        document.querySelector('#betting-amount').disabled = false;
    }

    disableBetting() {
        document.querySelectorAll('.betting-button').forEach(btn => {
            btn.disabled = true;
        });
        document.querySelector('#betting-amount').disabled = true;
    }

    showResult(data) {
        const resultElement = document.querySelector('.game-result');
        resultElement.textContent = data.result;
        resultElement.classList.add('show');
        
        setTimeout(() => {
            resultElement.classList.remove('show');
        }, 3000);
    }

    updateBalance(data) {
        const balanceElement = document.querySelector('.user-balance');
        if (balanceElement) {
            balanceElement.textContent = this.formatNumber(data.newBalance);
        }
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
    new GameClient();
});