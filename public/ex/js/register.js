class RegisterManager {
    constructor() {
        this.init();
    }

    init() {
        const registerForm = document.querySelector('.register-form');
        const verifyPhoneBtn = document.querySelector('.verify-phone-btn');
        const verifyCodeBtn = document.querySelector('.verify-code-btn');
        const registerBtn = document.querySelector('.register-submit-btn');

        if (verifyPhoneBtn) {
            verifyPhoneBtn.addEventListener('click', () => this.requestVerification());
        }

        if (verifyCodeBtn) {
            verifyCodeBtn.addEventListener('click', () => this.verifyCode());
        }

        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => this.handleRegister(e));
        }
    }

    async requestVerification() {
        const phoneInput = document.querySelector('input[name="phone"]');
        const phone = phoneInput.value.trim();

        if (!phone) {
            this.showError('휴대폰 번호를 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('/api/auth/verify-phone.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone })
            });

            const data = await response.json();

            if (response.ok) {
                this.showSuccess('인증번호가 발송되었습니다.');
                // 개발환경에서 인증번호 자동 입력
                if (data.code) {
                    document.querySelector('input[name="verification_code"]').value = data.code;
                }
            } else {
                this.showError(data.error);
            }
        } catch (error) {
            this.showError('서버 오류가 발생했습니다.');
        }
    }

    async verifyCode() {
        const phone = document.querySelector('input[name="phone"]').value.trim();
        const code = document.querySelector('input[name="verification_code"]').value.trim();

        if (!code) {
            this.showError('인증번호를 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('/api/auth/verify-code.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone, code })
            });

            const data = await response.json();

            if (response.ok) {
                this.showSuccess('인증이 완료되었습니다.');
                document.querySelector('input[name="phone"]').setAttribute('verified', 'true');
            } else {
                this.showError(data.error);
            }
        } catch (error) {
            this.showError('서버 오류가 발생했습니다.');
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const phoneInput = document.querySelector('input[name="phone"]');
        if (phoneInput.getAttribute('verified') !== 'true') {
            this.showError('휴대폰 인증을 완료해주세요.');
            return;
        }

        const formData = {
            username: document.querySelector('input[name="username"]').value,
            password: document.querySelector('input[name="password"]').value,
            nickname: document.querySelector('input[name="nickname"]').value,
            name: document.querySelector('input[name="name"]').value,
            birth: document.querySelector('input[name="birth"]').value,
            phone: phoneInput.value,
            bank_name: document.querySelector('select[name="bank_name"]').value,
            account_holder: document.querySelector('input[name="account_holder"]').value,
            account_number: document.querySelector('input[name="account_number"]').value
        };

        try {
            const response = await fetch('/api/auth/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                this.showSuccess('회원가입이 완료되었습니다.');
                setTimeout(() => {
                    window.location.href = '/ex/login-page.html';
                }, 1500);
            } else {
                this.showError(data.error);
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
        
        const form = document.querySelector('.register-form');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => errorDiv.remove(), 3000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const form = document.querySelector('.register-form');
        form.insertBefore(successDiv, form.firstChild);
        
        setTimeout(() => successDiv.remove(), 3000);
    }
}

// 페이지 로드 시 초기화
new RegisterManager(); 