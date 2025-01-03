export class BettingPlugin {
    constructor(socket) {
        this.socket = socket;
        this.token = localStorage.getItem('userToken');
        this.user = JSON.parse(localStorage.getItem('userData'));
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.socket.on('auth_success', (data) => {
            this.user = data.user;
            this.updateUserInfo();
        });

        this.socket.on('balance_update', (data) => {
            if (this.user && this.user.id === data.userId) {
                this.user.balance = data.newBalance;
                this.updateUserInfo();
            }
        });

        this.socket.on('bet_error', (data) => {
            alert(data.message);
        });
    }

    updateUserInfo() {
        const balanceElement = document.querySelector('.user-balance');
        if (balanceElement && this.user) {
            balanceElement.textContent = this.formatNumber(this.user.balance);
        }
    }

    placeBet(option, amount) {
        if (!this.socket.isAuthenticated()) {
            alert('로그인이 필요합니다.');
            window.location.href = '/ex/login-page.html';
            return;
        }

        if (!this.user || this.user.balance < amount) {
            alert('잔액이 부족합니다.');
            return;
        }

        this.socket.send('PLACE_BET', {
            bet_option: option,
            amount: parseInt(amount)
        });
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
} 