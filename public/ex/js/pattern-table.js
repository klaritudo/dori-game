export class PatternTable {
    constructor() {
        this.leftGrid = document.querySelector('.pattern-table-left .pattern-grid');
        this.rightGrid = document.querySelector('.pattern-table-right .pattern-grid');
        this.patterns = {
            left: [],
            right: []
        };
        this.maxRows = 5;
        this.maxCols = 10;
    }

    updatePattern(result) {
        // 왼쪽 그리드 (홀짝)
        const isOdd = ['1', '3'].includes(result);
        this.patterns.left.unshift(isOdd ? '홀' : '짝');
        if (this.patterns.left.length > this.maxRows * this.maxCols) {
            this.patterns.left.pop();
        }

        // 오른쪽 그리드 (1,2,3)
        this.patterns.right.unshift(result);
        if (this.patterns.right.length > this.maxRows * this.maxCols) {
            this.patterns.right.pop();
        }

        this.renderPatterns();
    }

    renderPatterns() {
        // 왼쪽 그리드 렌더링
        this.leftGrid.innerHTML = '';
        for (let i = 0; i < this.maxRows * this.maxCols; i++) {
            const cell = document.createElement('div');
            cell.className = 'pattern-cell';
            
            if (this.patterns.left[i]) {
                cell.classList.add(this.patterns.left[i] === '홀' ? 'odd' : 'even');
                cell.textContent = this.patterns.left[i];
            } else {
                cell.classList.add('empty');
            }
            
            this.leftGrid.appendChild(cell);
        }

        // 오른쪽 그리드 렌더링
        this.rightGrid.innerHTML = '';
        for (let i = 0; i < this.maxRows * this.maxCols; i++) {
            const cell = document.createElement('div');
            cell.className = 'pattern-cell';
            
            if (this.patterns.right[i]) {
                cell.classList.add(`number-${this.patterns.right[i]}`);
                cell.textContent = this.patterns.right[i];
            } else {
                cell.classList.add('empty');
            }
            
            this.rightGrid.appendChild(cell);
        }
    }

    loadHistory(history) {
        history.forEach(game => {
            if (game.result) {
                this.updatePattern(game.result);
            }
        });
    }

    clear() {
        this.patterns = {
            left: [],
            right: []
        };
        this.renderPatterns();
    }
} 