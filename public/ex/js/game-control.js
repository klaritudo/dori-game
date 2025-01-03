import { WebSocketClient } from './websocket-client.js';

export class GameController {
    constructor() {
        this.wsClient = new WebSocketClient();
        this.initElements();
        this.bindEvents();
        this.registerWebSocketHandlers();
    }

    registerWebSocketHandlers() {
        this.wsClient.on('GAME_STATE', (data) => {
            this.updateGameState(data);
        });
    }

    initElements() {
        this.bettingSpots = document.querySelectorAll('.betting-spot');
        this.timerDisplay = document.querySelector('.game-timer');
        this.statusDisplay = document.querySelector('.game-status');
    }

    bindEvents() {
        this.bettingSpots.forEach(spot => {
            spot.addEventListener('click', (e) => this.handleBetting(e));
        });
    }

    handleBetting(e) {
        const spot = e.currentTarget;
        const spotNumber = spot.dataset.spot;
        // 베팅 처리 로직
    }

    updateGameState(data) {
        if (this.statusDisplay) {
            this.statusDisplay.textContent = data.status === 'running' ? '진행중' : '대기중';
        }
    }
} 