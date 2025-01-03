export class AdminController {
    constructor(wsManager) {
        this.wsManager = wsManager;
        this.gameStatus = 'waiting';
        this.currentGame = null;
        this.statusTranslation = {
            'waiting': '대기 중',
            'running': '진행 중',
            'ended': '종료'
        };
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 게임 시작 버튼
        document.getElementById('startGameBtn')?.addEventListener('click', () => {
            this.wsManager.send('GAME_START', {});
        });

        // 게임 중지 버튼
        document.getElementById('stopGameBtn')?.addEventListener('click', () => {
            this.wsManager.send('GAME_STOP', {});
        });

        // 결과 입력 버튼들
        document.querySelectorAll('.result-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const result = btn.dataset.result;
                this.setGameResult(result);
            });
        });

        // 베팅 취소 버튼들
        document.querySelectorAll('.cancel-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const option = btn.dataset.option;
                this.cancelBet(option);
            });
        });

        // 설정 저장 버튼
        document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
            this.saveSettings();
        });
    }

    setGameResult(result) {
        if (!this.currentGame) {
            this.showError('진행 중인 게임이 없습니다.');
            return;
        }

        this.wsManager.send('SET_RESULT', { result });
    }

    cancelBet(option) {
        if (!this.currentGame) {
            this.showError('진행 중인 게임이 없습니다.');
            return;
        }

        this.wsManager.send('CANCEL_BET', { bet_option: option });
    }

    saveSettings() {
        const settings = {
            timer_duration: parseInt(document.getElementById('timerDuration').value),
            betting_end_time: parseInt(document.getElementById('bettingEndTime').value),
            min_bet: parseFloat(document.getElementById('minBet').value),
            max_bet: parseFloat(document.getElementById('maxBet').value)
        };

        this.wsManager.send('UPDATE_SETTINGS', settings);
    }

    updateGameStatus(status) {
        this.gameStatus = status;
        document.getElementById('gameStatus').textContent = this.statusTranslation[status] || status;
        
        // 버튼 상태 업데이트
        document.getElementById('startGameBtn').disabled = status === 'running';
        document.getElementById('stopGameBtn').disabled = status === 'waiting';
        
        document.querySelectorAll('.result-btn').forEach(btn => {
            btn.disabled = status !== 'running';
        });
    }

    updateBetInfo(data) {
        const { bet_option, amount, total } = data;
        document.querySelector(`.bet-total-${bet_option}`).textContent = 
            this.formatNumber(total);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    formatNumber(num) {
        return num.toLocaleString('ko-KR');
    }

    handleMessage(message) {
        console.log('Received message:', message); // 디버깅용 로그 추가
        switch (message.type) {
            case 'settings_updated':
                if (message.data.success) {
                    alert(message.data.message);
                    this.settings = message.data.settings;
                } else {
                    alert(message.data.message);
                }
                break;
            case 'game_status':
                this.updateGameStatus(message.data.status);
                this.currentGame = message.data.currentGame;
                break;
            // ... other cases
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize WebSocket Manager
    const wsManager = new WebSocketManager();
    window.wsManager = wsManager;

    // Initialize odd/even buttons
    const oddEvenContainer = document.getElementById('oddEvenContainer');
    if (oddEvenContainer) {
        wsManager.createOddEvenButtons(oddEvenContainer);
    }

    // ... existing code ...
}); 