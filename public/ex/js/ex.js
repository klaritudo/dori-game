import { WebSocketClient } from './websocket-client.js';

class GameClient {
    constructor() {
        this.wsClient = new WebSocketClient();
        this.init();
    }

    init() {
        // WebSocket 이벤트 핸들러 등록
        this.wsClient.on('auth_result', (data) => {
            if (data.success) {
                console.log('인증 성공');
                this.startGame();
            } else {
                console.error('인증 실패');
            }
        });
    }

    startGame() {
        // 게임 시작 로직
    }
}

// DOM이 로드된 후 게임 클라이언트 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    const gameClient = new GameClient();
}); 