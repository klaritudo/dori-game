import { WebSocketTestClient } from './WebSocketTestClient';
import { jest } from '@jest/globals';

describe('Game WebSocket Tests', () => {
    let wsClient;

    beforeEach(() => {
        wsClient = new WebSocketTestClient('ws://localhost:8081');
    });

    afterEach(() => {
        wsClient.close();
    });

    test('should connect successfully', (done) => {
        wsClient.onOpen(() => {
            expect(wsClient.isConnected()).toBe(true);
            done();
        });
    });

    test('should receive game status', (done) => {
        wsClient.on('game_status', (data) => {
            expect(data).toHaveProperty('status');
            expect(data).toHaveProperty('currentGame');
            expect(['waiting', 'running', 'ended']).toContain(data.status);
            done();
        });
    });

    test('should place bet successfully', (done) => {
        const betData = {
            bet_option: '1',
            amount: 10000
        };

        wsClient.send('PLACE_BET', betData);

        wsClient.on('bet_update', (data) => {
            expect(data.bet_option).toBe(betData.bet_option);
            expect(data.amount).toBe(betData.amount);
            expect(data).toHaveProperty('total');
            done();
        });
    });

    test('should reject invalid bet', (done) => {
        const invalidBet = {
            bet_option: 'invalid',
            amount: -1000
        };

        wsClient.send('PLACE_BET', invalidBet);

        wsClient.on('error', (data) => {
            expect(data).toHaveProperty('message');
            expect(data.message).toMatch(/잘못된 베팅/);
            done();
        });
    });

    test('should receive timer updates', (done) => {
        wsClient.on('timer_update', (data) => {
            expect(data).toHaveProperty('remaining');
            expect(typeof data.remaining).toBe('number');
            expect(data.remaining).toBeGreaterThanOrEqual(0);
            done();
        });
    });
}); 