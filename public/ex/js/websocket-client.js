export class WebSocketClient {
    constructor() {
        this.ws = null;
        this.isAuthenticated = false;
        this.handlers = new Map();
        this.connect();
    }

    connect() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsPort = '8081';  // WebSocket 서버 포트
        this.ws = new WebSocket(`${wsProtocol}//localhost:${wsPort}`);

        this.ws.onopen = () => {
            console.log('WebSocket 클라이언트 연결 성공');
            this.checkAuth();  // 연결 후 인증 체크
        };

        this.ws.onmessage = (event) => this.handleMessage(event);
    }

    checkAuth() {
        // 인증 체크 로직
        this.send('check_auth', {
            token: localStorage.getItem('userToken') // 저장된 토큰 사용
        });
    }

    send(type, payload) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        }
    }

    handleMessage(event) {
        const data = JSON.parse(event.data);
        const handlers = this.handlers.get(data.type);
        if (handlers) {
            handlers.forEach(handler => handler(data.payload));
        }
    }

    on(type, handler) {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, []);
        }
        this.handlers.get(type).push(handler);
    }
}