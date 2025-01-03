export class GameUI {
    constructor() {
        this.initializeElements();
    }

    initializeElements() {
        // 타이머 요소
        this.timerElement = document.querySelector('.timer');
        this.bettingTimerElement = document.querySelector('.betting-timer');
        
        // 베팅 금액 표시 요소들
        this.betTotalElements = {
            '1': document.querySelector('.bet-total-1'),
            '2': document.querySelector('.bet-total-2'),
            '3': document.querySelector('.bet-total-3')
        };
        
        // 잔액 표시 요소
        this.balanceElement = document.querySelector('.user-balance');
        
        // 게임 번호 표시 요소
        this.gameNumberElement = document.querySelector('.game-number');
        
        // 결과 표시 요소
        this.resultElement = document.querySelector('.game-result');
    }

    updateTimer(remaining, bettingRemaining) {
        if (this.timerElement) {
            this.timerElement.textContent = this.formatTime(remaining);
        }
        
        if (this.bettingTimerElement) {
            if (bettingRemaining > 0) {
                this.bettingTimerElement.textContent = `베팅마감 ${this.formatTime(bettingRemaining)}`;
                this.bettingTimerElement.classList.remove('ended');
            } else {
                this.bettingTimerElement.textContent = '베팅마감';
                this.bettingTimerElement.classList.add('ended');
            }
        }
    }

    updateBetTotal(option, total) {
        const element = this.betTotalElements[option];
        if (element) {
            element.textContent = this.formatNumber(total);
            this.highlightElement(element);
        }
    }

    updateBalance(balance) {
        if (this.balanceElement) {
            this.balanceElement.textContent = this.formatNumber(balance);
            this.highlightElement(this.balanceElement);
        }
    }

    updateGameNumber(number) {
        if (this.gameNumberElement) {
            this.gameNumberElement.textContent = number;
        }
    }

    showResult(result) {
        if (this.resultElement) {
            this.resultElement.textContent = result;
            this.resultElement.classList.add('show');
            
            setTimeout(() => {
                this.resultElement.classList.remove('show');
            }, 3000);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    formatNumber(num) {
        return num.toLocaleString('ko-KR');
    }

    highlightElement(element) {
        element.classList.remove('highlight');
        void element.offsetWidth; // 리플로우 강제 발생
        element.classList.add('highlight');
    }
} 