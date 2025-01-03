import { LoadingSpinner } from '../../public/ex/js/components/loading.js';

describe('LoadingSpinner Component Tests', () => {
    let spinner;

    beforeEach(() => {
        document.body.innerHTML = '';
        spinner = new LoadingSpinner();
    });

    test('should create spinner element', () => {
        const spinnerElement = document.querySelector('.loading-spinner');
        expect(spinnerElement).not.toBeNull();
        expect(spinnerElement.style.display).toBe('none');
    });

    test('should show spinner', () => {
        spinner.show();
        const spinnerElement = document.querySelector('.loading-spinner');
        expect(spinnerElement.style.display).toBe('flex');
    });

    test('should hide spinner', () => {
        spinner.show();
        spinner.hide();
        const spinnerElement = document.querySelector('.loading-spinner');
        expect(spinnerElement.style.display).toBe('none');
    });

    test('should contain loading text', () => {
        const loadingText = document.querySelector('.loading-text');
        expect(loadingText).not.toBeNull();
        expect(loadingText.textContent).toBe('Loading...');
    });
}); 