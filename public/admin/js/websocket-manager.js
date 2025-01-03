export class WebSocketManager {
    constructor() {
        this.ws = null;
        this.handlers = new Map();
        this.connect();
    }

    connect() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsPort = '8081';
        this.ws = new WebSocket(`${wsProtocol}//localhost:${wsPort}`);

        this.ws.onopen = () => {
            console.log('WebSocket 연결 성공');
            this.authenticate();
        };

        this.ws.onmessage = (event) => this.handleMessage(event);
    }

    authenticate() {
        this.send('admin_auth', {
            token: 'admin_token_123' // 실제 환경에서는 보안 토큰 사용
        });
    }

    send(type, payload) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        }
    }

    registerHandler(type, handler) {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, []);
        }
        this.handlers.get(type).push(handler);
    }

    handleMessage(event) {
        const data = JSON.parse(event.data);
        const handlers = this.handlers.get(data.type);
        if (handlers) {
            handlers.forEach(handler => handler(data.payload));
        }
    }
}

// 전역 WebSocket 관리자 인스턴스 생성
window.wsManager = new WebSocketManager();
export default window.wsManager; 