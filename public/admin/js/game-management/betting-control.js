import wsManager from '../core/websocket-manager.js';

class BettingManager {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.loadCurrentLimits();
    }

    initElements() {
        this.minBetInput = document.getElementById('minBetAmount');
        this.maxBetInput = document.getElementById('maxBetAmount');
        this.saveButton = document.getElementById('saveBetLimits');
    }

    bindEvents() {
        this.saveButton.addEventListener('click', () => this.saveLimits());
    }

    loadCurrentLimits() {
        // API로부터 현재 베팅 제한 설정 불러오기
        fetch('/api/admin/betting-limits')
            .then(response => response.json())
            .then(data => {
                this.minBetInput.value = data.minBet;
                this.maxBetInput.value = data.maxBet;
            });
    }

    saveLimits() {
        const limits = {
            minBet: parseInt(this.minBetInput.value),
            maxBet: parseInt(this.maxBetInput.value)
        };

        // API로 제한 설정 저장 및 WebSocket으로 클라이언트에 알림
        fetch('/api/admin/betting-limits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(limits)
        })
        .then(response => {
            if (response.ok) {
                // WebSocket으로 클라이언트에 설정 변경 알림
                wsManager.send('UPDATE_BETTING_LIMITS', limits);
                alert('베팅 제한이 설정되었습니다.');
            }
        });
    }
} 