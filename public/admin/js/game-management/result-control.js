class ResultManager {
    constructor() {
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.resultSelect = document.getElementById('gameResult');
        this.submitButton = document.getElementById('submitResult');
    }

    bindEvents() {
        this.submitButton.addEventListener('click', () => this.submitResult());
    }

    submitResult() {
        const result = {
            value: this.resultSelect.value
        };

        // 결과 확인 모달
        if (confirm('결과값이 정확한가요?')) {
            if (confirm('결과값을 저장하겠습니다.')) {
                // API로 결과 전송
                fetch('/api/admin/game-result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(result)
                })
                .then(response => {
                    if (response.ok) {
                        alert('게임 결과가 저장되었습니다.');
                    }
                });
            }
        }
    }
} 