import { GAME_EVENTS } from '../constants/game-events.js';
import wsManager from '../core/websocket-manager.js';

class GameMonitoring {
    constructor() {
        this.initElements();
        this.registerWebSocketHandlers();
    }

    initElements() {
        // 게임 상태 요소
        this.roundElement = document.getElementById('currentRound');
        this.timerElement = document.getElementById('timeLeft');
        this.statusElement = document.getElementById('gameStatus');
        
        // 베팅 현황 요소
        this.spotElements = document.querySelectorAll('.spot-item');
        this.totalAmountElement = document.getElementById('totalAmount');
        this.totalCountElement = document.getElementById('totalCount');
    }

    registerWebSocketHandlers() {
        // 게임 상태 업데이트
        wsManager.registerHandler('GAME_STATUS_UPDATE', (data) => {
            this.updateGameStatus(data);
        });

        // 베팅 현황 업데이트
        wsManager.registerHandler('BETTING_UPDATE', (data) => {
            this.updateBettingStatus(data);
        });

        // 타이머 업데이트
        wsManager.registerHandler('TIMER_UPDATE', (data) => {
            this.updateTimer(data);
        });
    }

    updateGameStatus(data) {
        this.roundElement.textContent = data.round;
        this.statusElement.textContent = data.status;
    }

    updateTimer(data) {
        const minutes = Math.floor(data.timeLeft / 60);
        const seconds = data.timeLeft % 60;
        this.timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateBettingStatus(data) {
        // 각 스팟별 베팅 현황 업데이트
        this.spotElements.forEach(spotElement => {
            const spotNumber = spotElement.dataset.spot;
            const spotData = data.spots[spotNumber] || { amount: 0, count: 0 };
            
            spotElement.querySelector('.spot-amount').textContent = 
                this.formatAmount(spotData.amount);
            spotElement.querySelector('.spot-count').textContent = 
                `${spotData.count}건`;
        });

        // 전체 베팅 현황 업데이트
        this.totalAmountElement.textContent = this.formatAmount(data.totalAmount);
        this.totalCountElement.textContent = `${data.totalCount}건`;
    }

    formatAmount(amount) {
        return amount.toLocaleString('ko-KR') + '원';
    }
}

// 초기화
const monitoring = new GameMonitoring();
export default monitoring; 