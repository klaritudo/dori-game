import { Toast } from '../../public/ex/js/components/toast.js';
import { jest } from '@jest/globals';

describe('Toast Component Tests', () => {
    let toast;

    beforeEach(() => {
        document.body.innerHTML = '';
        toast = new Toast();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should create toast container', () => {
        const container = document.querySelector('.toast-container');
        expect(container).not.toBeNull();
    });

    test('should show error message', () => {
        toast.error('에러 메시지');
        const toastElement = document.querySelector('.toast.error');
        
        expect(toastElement).not.toBeNull();
        expect(toastElement.textContent).toContain('에러 메시지');
        expect(toastElement.querySelector('.toast-icon').textContent).toBe('❌');
    });

    test('should show success message', () => {
        toast.success('성공 메시지');
        const toastElement = document.querySelector('.toast.success');
        
        expect(toastElement).not.toBeNull();
        expect(toastElement.textContent).toContain('성공 메시지');
        expect(toastElement.querySelector('.toast-icon').textContent).toBe('✅');
    });

    test('should auto-hide after 3 seconds', () => {
        toast.show('테스트 메시지');
        const toastElement = document.querySelector('.toast');
        
        expect(toastElement).not.toBeNull();
        
        jest.advanceTimersByTime(3000);
        expect(document.querySelector('.toast')).toBeNull();
    });

    test('should add show class for animation', () => {
        toast.show('테스트 메시지');
        const toastElement = document.querySelector('.toast');
        
        jest.advanceTimersByTime(100);
        expect(toastElement.classList.contains('show')).toBeTruthy();
    });
}); 