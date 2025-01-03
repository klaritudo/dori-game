class LoginManager {
    constructor() {
        this.init();
    }

    init() {
        const loginBtn = document.querySelector('.login-submit-btn');
        const registerBtn = document.querySelector('.login-register-btn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => this.handleLogin(e));
        }
        
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                window.location.href = '/public/ex/register-page.html';
            });
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.querySelector('.login-input[type="text"]').value;
        const password = document.querySelector('.login-input[type="password"]').value;

        try {
            const response = await fetch('/public/api/auth/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                window.location.href = '/public/ex/dori-page.html';
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            this.showError('서버 오류가 발생했습니다.');
        }
    }

    showError(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const loginForm = document.querySelector('.login-form');
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

new LoginManager(); 