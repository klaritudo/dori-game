class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('admin-theme') || 'dark';
        this.toggleBtn = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateToggleButton();
        this.bindEvents();
    }

    updateToggleButton() {
        const icon = this.toggleBtn.querySelector('.theme-icon');
        icon.innerHTML = this.theme === 'dark' 
            ? '🌙' // 다크모드 아이콘
            : '☀️'; // 라이트모드 아이콘
    }

    bindEvents() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('admin-theme', this.theme);
        this.init();
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
}); 