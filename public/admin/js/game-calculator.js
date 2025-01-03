export class GameCalculator {
    constructor() {
        // 유효한 '짓기' 조합 정의
        this.JITGI_COMBINATIONS = {
            30: [[10, 10, 10]],
            20: [
                [1, 9, 10], [2, 8, 10], [3, 7, 10], [3, 8, 9],
                [4, 6, 10], [4, 7, 9], [5, 5, 10], [5, 6, 9],
                [5, 7, 8], [6, 6, 8], [7, 7, 6], [8, 8, 4], [9, 9, 2]
            ],
            10: [
                [1, 1, 8], [1, 2, 7], [1, 3, 6], [1, 4, 5],
                [2, 2, 6], [2, 3, 5], [3, 3, 4], [4, 4, 2]
            ]
        };
    }

    // 카드 유효성 검사
    validateCards(cards) {
        if (!Array.isArray(cards)) return false;
        if (cards.length !== 5) return false;  // 반드시 5장이어야 함
        return cards.every(card => 
            Number.isInteger(card) && card >= 1 && card <= 10
        );
    }

    // 결과 계산
    calculateSpotResult(cards) {
        if (!this.validateCards(cards)) {
            throw new Error('Invalid cards');
        }

        // 1. 황 체크 - 5장의 카드로 판정
        if (this.isHwang(cards)) {
            const hwangValue = this.calculateHwangValue(cards);
            return {
                type: 'hwang',
                cards: [...cards],
                value: hwangValue,
                name: '황',
                odd_even: this.calculateOddEven(hwangValue)
            };
        }

        // 2. 짓기 체크
        const jitgiResult = this.findBestJitgiCombination(cards);
        if (jitgiResult) {
            const remainingCards = this.getRemainingCards(cards, jitgiResult.usedCards);
            const endResult = this.calculateEndResult(remainingCards);
            
            return {
                type: 'jitgi',
                jitgi: {
                    sum: jitgiResult.sum,
                    cards: jitgiResult.usedCards
                },
                end: endResult,
                odd_even: this.calculateOddEven(endResult.value)
            };
        }

        // 3. 첫 두 장으로 땡/끗/망통 판정
        const endResult = this.calculateEndResult(cards.slice(0, 2));
        return {
            type: endResult.type,
            value: endResult.value,
            name: endResult.name,
            cards: cards.slice(0, 2),
            odd_even: this.calculateOddEven(endResult.value)
        };
    }

    // 황 판정
    isHwang(cards) {
        // 모든 3장 조합을 확인하여 유효한 짓기 조합이 있는지 확인
        for (const [sum, combinations] of Object.entries(this.JITGI_COMBINATIONS)) {
            for (const combination of combinations) {
                if (this.findMatchingCards(cards, combination)) {
                    return false;  // 유효한 짓기 조합이 있으면 황이 아님
                }
            }
        }
        return true;  // 유효한 짓기 조합이 없으면 황
    }

    // 황의 값 계산 (5장의 합의 일의 자리)
    calculateHwangValue(cards) {
        return cards.reduce((sum, card) => sum + card, 0) % 10;
    }

    // 최적의 '짓기' 조합 찾기 (30 > 20 > 10 순서)
    findBestJitgiCombination(cards) {
        for (const [sum, combinations] of Object.entries(this.JITGI_COMBINATIONS).reverse()) {
            for (const combination of combinations) {
                const found = this.findMatchingCards(cards, combination);
                if (found) {
                    return {
                        sum: parseInt(sum),
                        usedCards: found
                    };
                }
            }
        }
        return null;
    }

    // 주어진 조합에 맞는 카드 찾기
    findMatchingCards(cards, targetCombination) {
        // 모든 가능한 3장 조합을 확인
        for (let i = 0; i < cards.length - 2; i++) {
            for (let j = i + 1; j < cards.length - 1; j++) {
                for (let k = j + 1; k < cards.length; k++) {
                    const currentCombo = [cards[i], cards[j], cards[k]].sort((a, b) => a - b);
                    const targetComboSorted = [...targetCombination].sort((a, b) => a - b);
                    
                    // 정확히 일치하는지 확인
                    if (currentCombo.length === targetComboSorted.length &&
                        currentCombo.every((card, index) => card === targetComboSorted[index])) {
                        return [cards[i], cards[j], cards[k]];
                    }
                }
            }
        }
        return null;
    }

    // 남은 카드 구하기
    getRemainingCards(allCards, usedCards) {
        const remainingCards = [];
        const usedIndices = new Set();

        // 사용된 카드의 인덱스 찾기
        for (const usedCard of usedCards) {
            for (let i = 0; i < allCards.length; i++) {
                if (!usedIndices.has(i) && allCards[i] === usedCard) {
                    usedIndices.add(i);
                    break;
                }
            }
        }

        // 남은 카드 수집
        for (let i = 0; i < allCards.length; i++) {
            if (!usedIndices.has(i)) {
                remainingCards.push(allCards[i]);
            }
        }

        return remainingCards.slice(0, 2);
    }

    // 끗/끗/망통 계산
    calculateEndResult(cards) {
        if (cards.length !== 2) {
            return { type: 'invalid', value: 0 };
        }

        // 땡 체크
        if (cards[0] === cards[1]) {
            return {
                type: 'ddang',
                value: cards[0],
                name: cards[0] === 10 ? '장땡' : `${cards[0]}땡`,
                cards: [...cards]
            };
        }

        // 끗수 계산
        const sum = cards.reduce((acc, curr) => acc + curr, 0) % 10;
        return {
            type: sum === 0 ? 'mangtong' : 'kkeut',
            value: sum,
            name: sum === 0 ? '망통' : (sum === 9 ? '갑오' : `${sum}끗`),
            cards: [...cards]
        };
    }

    // 홀/짝 계산
    calculateOddEven(value) {
        return value % 2 === 0 ? '짝' : '홀';
    }

    // 결과 포맷팅
    formatResult(result) {
        if (!result) return '-';

        switch (result.type) {
            case 'hwang':
                return `[${result.cards.join(', ')}][황]`;
            
            case 'jitgi':
                const endResult = result.end.type === 'mangtong' ? '망통' : 
                                result.end.type === 'ddang' ? result.end.name : 
                                result.end.name;
                return `[${result.jitgi.cards.join(', ')}][${result.jitgi.sum}짓고] ` +
                       `[${result.end.cards.join(', ')}][${endResult}]`;
            
            case 'ddang':
                return `[${result.cards.join(', ')}][${result.name}]`;
            
            case 'mangtong':
                return `[${result.cards.join(', ')}][망통]`;
            
            case 'kkeut':
                return `[${result.cards.join(', ')}][${result.name}]`;
            
            default:
                return '-';
        }
    }

    // 페어 처리
    handlePair(pairs, bankerResult) {
        // 페어가 발생한 경우, 관리자의 선택을 기다림
        this.pairDecision = {
            pairs,
            bankerResult,
            status: 'pending'  // 'pending', 'banker_win', 'banker_lose', 'draw'
        };

        // 관리자 선택이 없는 경우 임시로 대기 상태 반환
        if (!this.pairDecision.status || this.pairDecision.status === 'pending') {
            return null;
        }

        // 관리자 선택에 따른 결과 반환
        switch (this.pairDecision.status) {
            case 'banker_win':
                return bankerResult.spot;
            case 'banker_lose':
                return pairs[0].find(p => p.spot !== bankerResult.spot).spot;
            case 'draw':
                // 동점 처리 - 베팅금 반환을 위해 null 반환
                return null;
            default:
                return bankerResult.spot;  // 기본값은 뱅커 승리
        }
    }

    // 페어 결정 설정 메서드 추가
    setPairDecision(decision) {
        if (this.pairDecision) {
            this.pairDecision.status = decision;
        }
    }

    // 승자 결정 메서드 수정
    determineWinner(results) {
        const spots = results.map(r => ({
            spot: r.spot,
            result: r.result
        }));

        // 1. 황 체크 (기존 코드와 동일)
        const hwangResults = spots.filter(s => s.result.type === 'hwang');
        if (hwangResults.length > 0) {
            if (hwangResults.length === spots.length) {
                return spots.find(s => s.spot === this.bankerSpot).spot;
            }
            return spots.find(s => s.result.type !== 'hwang').spot;
        }

        // 2. 짓기 비교 (수정된 부분)
        const jitgiResults = spots.filter(s => s.result.type === 'jitgi');
        if (jitgiResults.length > 0) {
            const sortedByJitgi = jitgiResults.sort((a, b) => {
                if (a.result.jitgi.sum !== b.result.jitgi.sum) {
                    return b.result.jitgi.sum - a.result.jitgi.sum;
                }
                // 짓기 배수가 같은 경우, 끗수 비교
                const aEndValue = a.result.end.value;
                const bEndValue = b.result.end.value;
                if (aEndValue === bEndValue) {
                    // 끗수도 같은 경우 짓기 배수로 승패 결정
                    return b.result.jitgi.sum - a.result.jitgi.sum;
                }
                return this.compareEndResults(a.result.end, b.result.end);
            });
            return sortedByJitgi[0].spot;
        }

        // 3. 땡/끗/망통 비교 (수정된 부분)
        const endResults = spots.map(s => ({
            spot: s.spot,
            result: s.result.type === 'jitgi' ? s.result.end : s.result
        }));

        // 페어(동일 끗수) 처리
        const pairs = this.findPairs(endResults);
        if (pairs.length > 0) {
            const bankerResult = endResults.find(r => r.spot === this.bankerSpot);
            if (bankerResult) {
                const pairResult = this.handlePair(pairs, bankerResult);
                if (pairResult !== null) {
                    return pairResult;
                }
                // null이 반환된 경우 (동점 또는 대기 상태) 처리
                return null;
            }
        }

        // 일반적인 승패 결정
        return this.determineWinnerByEndResults(endResults);
    }

    // 남은 패 비교 (땡 > 끗 > 망통)
    compareEndResults(a, b) {
        const typeOrder = { ddang: 3, kkeut: 2, mangtong: 1 };
        if (a.type !== b.type) {
            return typeOrder[a.type] - typeOrder[b.type];
        }
        
        // 같은 타입일 경우
        if (a.type === 'ddang') {
            return a.value - b.value;  // 높은 땡이 승리
        }
        if (a.type === 'kkeut') {
            return a.value - b.value;  // 높은 끗이 승리
        }
        return 0;  // 망통끼리는 동점
    }

    // 페어(동일 끗수) 찾기
    findPairs(results) {
        const pairs = [];
        for (let i = 0; i < results.length; i++) {
            for (let j = i + 1; j < results.length; j++) {
                const a = results[i];
                const b = results[j];
                if (a.result.type === b.result.type && a.result.value === b.result.value) {
                    pairs.push([a, b]);
                }
            }
        }
        return pairs;
    }

    // 일반적인 승패 결정
    determineWinnerByEndResults(results) {
        return results.sort((a, b) => {
            if (a.result.type === 'mangtong' && b.result.type === 'hwang') {
                return 1;  // 망통이 황을 이김
            }
            if (a.result.type === 'hwang' && b.result.type === 'mangtong') {
                return -1;  // 망통이 황을 이김
            }
            return this.compareEndResults(a.result, b.result);
        })[0].spot;
    }
} 