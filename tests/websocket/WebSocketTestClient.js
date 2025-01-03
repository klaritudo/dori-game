export class WebSocketTestClient {
    constructor(url) {
        this.url = url;
        this.socket = new WebSocket(url);
        this.eventHandlers = new Map();
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const handlers = this.eventHandlers.get(data.type) || [];
            handlers.forEach(handler => handler(data.data));
        };
    }

    isConnected() {
        return this.socket.readyState === WebSocket.OPEN;
    }

    onOpen(callback) {
        this.socket.onopen = callback;
    }

    on(eventType, callback) {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, []);
        }
        this.eventHandlers.get(eventType).push(callback);
    }

    send(type, data) {
        this.socket.send(JSON.stringify({ type, data }));
    }

    close() {
        this.socket.close();
    }
} 