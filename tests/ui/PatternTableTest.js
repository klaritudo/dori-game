import { PatternTable } from '../../public/ex/js/pattern-table.js';

describe('PatternTable Component Tests', () => {
    let patternTable;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="pattern-table-left">
                <div class="pattern-grid"></div>
            </div>
            <div class="pattern-table-right">
                <div class="pattern-grid"></div>
            </div>
        `;
        patternTable = new PatternTable();
    });

    test('should update pattern with result', () => {
        patternTable.updatePattern('1');
        
        const leftCell = document.querySelector('.pattern-table-left .pattern-cell');
        const rightCell = document.querySelector('.pattern-table-right .pattern-cell');
        
        expect(leftCell.textContent).toBe('홀');
        expect(rightCell.textContent).toBe('1');
        expect(rightCell.classList.contains('number-1')).toBeTruthy();
    });

    test('should load history correctly', () => {
        const history = [
            { result: '1' },
            { result: '2' },
            { result: '3' }
        ];

        patternTable.loadHistory(history);
        
        const rightCells = document.querySelectorAll('.pattern-table-right .pattern-cell');
        expect(rightCells[2].textContent).toBe('1');
        expect(rightCells[1].textContent).toBe('2');
        expect(rightCells[0].textContent).toBe('3');
    });

    test('should clear patterns', () => {
        patternTable.updatePattern('1');
        patternTable.clear();
        
        const cells = document.querySelectorAll('.pattern-cell');
        cells.forEach(cell => {
            expect(cell.classList.contains('empty')).toBeTruthy();
            expect(cell.textContent).toBe('');
        });
    });
}); 