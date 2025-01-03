import { GAME_EVENTS } from '../constants/game-events.js';
import wsManager from '../core/websocket-manager.js';

class GameTimer {
    constructor() {
        this.totalGameTime = 0;
        this.bettingEndTime = 0;
        this.syncInterval = null;
        this.lastSyncTime = null;
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.totalTimeInput = document.getElementById('totalGameTime');
        this.endTimeInput = document.getElementById('bettingEndTime');
        this.saveButton = document.getElementById('saveTimerSettings');
        
        // 저장된 설정 불러오기
        this.loadSettings();
    }

    bindEvents() {
        this.saveButton.addEventListener('click', () => this.saveSettings());
        
        // 유효성 검사
        this.endTimeInput.addEventListener('change', () => {
            if (parseInt(this.endTimeInput.value) >= parseInt(this.totalTimeInput.value)) {
                alert('베팅 마감 시간은 전체 게임 시간보다 작아야 합니다.');
                this.endTimeInput.value = this.bettingEndTime;
            }
        });
    }

    loadSettings() {
        fetch('/api/admin/game-settings')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.totalTimeInput.value = data.data.timer_duration;
                    this.endTimeInput.value = data.data.betting_end_time;
                    
                    // 현재 설정값 저장
                    this.totalGameTime = data.data.timer_duration;
                    this.bettingEndTime = data.data.betting_end_time;
                    
                    console.log('설정값 로드 완료:', data.data);
                } else {
                    console.error('설정값 로드 실패:', data.message);
                }
            })
            .catch(error => {
                console.error('설정값 로드 중 오류 발생:', error);
            });
    }

    saveSettings() {
        const settings = {
            timer_duration: parseInt(this.totalTimeInput.value),
            betting_end_time: parseInt(this.endTimeInput.value)
        };

        // API로 설정 저장 및 WebSocket으로 클라이언트에 알림
        fetch('/api/admin/game-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // WebSocket으로 클라이언트에 설정 변경 알림
                wsManager.send('UPDATE_GAME_SETTINGS', settings);
                alert('설정이 저장되었습니다.');
                
                // 현재 설정값 업데이트
                this.totalGameTime = settings.timer_duration;
                this.bettingEndTime = settings.betting_end_time;
            } else {
                alert('설정 저장에 실패했습니다: ' + data.message);
            }
        })
        .catch(error => {
            console.error('설정 저장 중 오류 발생:', error);
            alert('설정 저장 중 오류가 발생했습니다.');
        });
    }

    startTimer(duration) {
        this.lastSyncTime = Date.now();
        this.syncInterval = setInterval(() => {
            const currentTime = Date.now();
            const expectedTime = this.lastSyncTime + 1000;
            const drift = currentTime - expectedTime;
            
            if (Math.abs(drift) > 50) { // 50ms 이상 차이나면 재동기화
                this.syncWithServer();
            }
            
            this.lastSyncTime = currentTime;
        }, 1000);
    }

    syncWithServer() {
        this.wsManager.send('SYNC_REQUEST', {
            clientTime: Date.now()
        });
    }

    handleSync(serverTime) {
        const latency = (Date.now() - serverTime) / 2;
        this.adjustTimer(serverTime + latency);
    }
} 