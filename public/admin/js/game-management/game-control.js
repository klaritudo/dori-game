import { WebSocketManager } from '../websocket-manager.js';

class GameController {
    constructor() {
        this.wsManager = new WebSocketManager();
        this.isGameRunning = false;
        this.initElements();
        this.bindEvents();
        this.registerWebSocketHandlers();
    }

    initElements() {
        this.startButton = document.getElementById('startGame');
        this.stopButton = document.getElementById('stopGame');
        this.gameStatus = document.getElementById('gameStatus');
        
        // 초기 상태 설정
        this.stopButton.disabled = true;
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.stopButton.addEventListener('click', () => this.stopGame());
    }

    registerWebSocketHandlers() {
        this.wsManager.registerHandler('GAME_STATE_CHANGE', (data) => {
            this.updateGameState(data);
        });
    }

    toggleSettingsFields(disable) {
        const settingsFields = document.querySelectorAll('.game-settings input, .game-settings select');
        settingsFields.forEach(field => {
            field.disabled = disable;
        });
    }

    startGame() {
        this.toggleSettingsFields(true);
        const totalGameTime = document.getElementById('totalGameTime');
        const bettingEndTime = document.getElementById('bettingEndTime');
        const autoBettingEnabled = document.getElementById('autoBettingEnabled');
        const autoBettingAmount = document.getElementById('autoBettingAmount');
        const tieEnabled = document.getElementById('tieEnabled');
        const tieDefaultAction = document.getElementById('tieDefaultAction');
        const commissionRate = document.getElementById('commissionRate');

        // 필수 요소 존재 확인
        if (!this.validateElements([
            totalGameTime, bettingEndTime, autoBettingEnabled, 
            autoBettingAmount, tieEnabled, tieDefaultAction, commissionRate
        ])) {
            alert('게임 설정값을 찾을 수 없습니다.');
            return;
        }

        // 타이머 유효성 검사
        if (!this.validateTimerSettings(totalGameTime.value, bettingEndTime.value)) {
            return;
        }

        // 수수료율 유효성 검사
        const commission = parseFloat(commissionRate.value);
        if (commission < 0 || commission > 100) {
            alert('수수료율은 0~100% 사이여야 합니다.');
            return;
        }

        this.wsManager.send('GAME_START', {
            totalTime: parseInt(totalGameTime.value),
            bettingEndTime: parseInt(bettingEndTime.value),
            autoBettingEnabled: autoBettingEnabled.checked,
            autoBettingAmount: parseInt(autoBettingAmount.value) || 1000,
            tieSettings: {
                enabled: tieEnabled.checked,
                defaultAction: tieDefaultAction.value
            },
            commissionRate: commission / 100
        });
    }

    validateTimerSettings(totalTime, endTime) {
        totalTime = parseInt(totalTime);
        endTime = parseInt(endTime);
        
        if (totalTime < 5) {
            alert('전체 게임 시간은 최소 5초 이상이어야 합니다.');
            return false;
        }
        
        if (endTime < 3) {
            alert('베팅 마감 시간은 최소 3초 이상이어야 합니다.');
            return false;
        }
        
        if (endTime >= totalTime) {
            alert('베팅 마감 시간은 전체 게임 시간보다 작아야 합니다.');
            return false;
        }

        return true;
    }

    validateElements(elements) {
        return elements.every(element => element !== null);
    }

    stopGame() {
        this.toggleSettingsFields(false);
        if (!this.isGameRunning) {
            alert('진행 중인 게임이 없습니다.');
            return;
        }

        if (confirm('게임을 정지하시겠습니까? 모든 베팅이 취소됩니다.')) {
            this.wsManager.send('GAME_STOP', {});
        }
    }

    updateGameState(data) {
        this.isGameRunning = data.status === 'running';
        this.startButton.disabled = this.isGameRunning;
        this.stopButton.disabled = !this.isGameRunning;
        
        const statusText = this.isGameRunning ? '진행중' : '대기중';
        this.gameStatus.textContent = statusText;
    }
}

// 게임 컨트롤러 인스턴스 생성
const gameController = new GameController();
export default gameController; 