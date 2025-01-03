export class GameState {
    constructor() {
        this.currentGame = null;
        this.gameStatus = 'waiting';
        this.remainingTime = 0;
        this.bettingEndTime = 0;
        this.betTotals = {
            '1': 0,
            '2': 0,
            '3': 0
        };
    }

    updateGameStatus(data) {
        this.gameStatus = data.status;
        this.currentGame = data.currentGame;
        
        if (data.settings) {
            this.bettingEndTime = data.settings.betting_end_time;
        }

        return this.gameStatus;
    }

    updateTimer(data) {
        this.remainingTime = data.remaining;
        this.bettingRemaining = data.betting_remaining;
        
        return {
            remaining: this.remainingTime,
            bettingRemaining: this.bettingRemaining
        };
    }

    updateBetTotal(option, amount) {
        if (this.betTotals[option] !== undefined) {
            this.betTotals[option] += amount;
        }
        return this.betTotals;
    }

    isBettingAllowed() {
        return this.gameStatus === 'running' && this.bettingRemaining > 0;
    }

    resetBetTotals() {
        Object.keys(this.betTotals).forEach(key => {
            this.betTotals[key] = 0;
        });
    }
} 