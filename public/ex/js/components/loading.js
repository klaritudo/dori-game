export class LoadingSpinner {
    constructor() {
        this.spinner = document.createElement('div');
        this.spinner.className = 'loading-spinner';
        this.spinner.innerHTML = `
            <div class="spinner-container">
                <div class="spinner"></div>
                <p class="loading-text">Loading...</p>
            </div>
        `;
        document.body.appendChild(this.spinner);
        this.hide();
    }

    show() {
        this.spinner.style.display = 'flex';
    }

    hide() {
        this.spinner.style.display = 'none';
    }
} 