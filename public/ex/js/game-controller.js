import { GameState } from './game-state.js';
import { GameUI } from './game-ui.js';
import { PatternTable } from './pattern-table.js';
import { LoadingSpinner } from './components/loading.js';
import { Toast } from './components/toast.js';

export class GameController {
    constructor(wsClient) {
        this.ws = wsClient;
        this.initElements();
        this.bindEvents();
        this.registerWebSocketHandlers();
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

    registerWebSocketHandlers() {
        this.ws.on('GAME_STATUS', (data) => {
            this.updateGameStatus(data);
        });

        this.ws.on('TIMER_UPDATE', (data) => {
            this.updateTimer(data);
        });

        this.ws.on('BETTING_END', () => {
            this.disableBetting();
        });
    }

    updateGameStatus(data) {
        if (data.status === 'running') {
            this.enableBetting();
        } else {
            this.disableBetting();
        }
        
        if (this.statusDisplay) {
            this.statusDisplay.textContent = data.status === 'running' ? '진행중' : '대기중';
        }
    }

    updateTimer(data) {
        if (this.timerDisplay) {
            const minutes = Math.floor(data.remaining / 60);
            const seconds = data.remaining % 60;
            this.timerDisplay.textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        if (data.betting_remaining <= 0) {
            this.disableBetting();
        }
    }

    enableBetting() {
        this.bettingSpots.forEach(spot => {
            spot.classList.remove('disabled');
        });
    }

    disableBetting() {
        this.bettingSpots.forEach(spot => {
            spot.classList.add('disabled');
        });
    }

    handleBetting(e) {
        const spot = e.currentTarget;
        if (spot.classList.contains('disabled')) return;
        
        const spotNumber = spot.dataset.spot;
        // 베팅 처리 로직
    }
} 