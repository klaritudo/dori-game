import { GameCalculator } from './game-calculator.js';

const calculator = new GameCalculator();

// 테스트 케이스들
const testCases = [
    // 황 케이스
    {
        cards: [1, 2, 4, 6, 8],
        description: "황 케이스 1 - 짓기가 불가능한 경우"
    },
    {
        cards: [10, 10, 1, 2, 3],
        description: "황 케이스 2 - 짓기가 불가능한 경우"
    },
    {
        cards: [1, 3, 5, 7, 9],
        description: "황 케이스 3 - 홀수 카드만 있는 경우"
    },
    {
        cards: [2, 4, 6, 8, 10],
        description: "황 케이스 4 - 짝수 카드만 있는 경우"
    },
    
    // 30짓기 케이스
    {
        cards: [10, 10, 10, 1, 1],
        description: "30짓고 1땡"
    },
    {
        cards: [10, 10, 10, 2, 2],
        description: "30짓고 2땡"
    },
    {
        cards: [10, 10, 10, 3, 3],
        description: "30짓고 3땡"
    },
    {
        cards: [10, 10, 10, 4, 4],
        description: "30짓고 4땡"
    },
    {
        cards: [10, 10, 10, 5, 5],
        description: "30짓고 5땡"
    },
    {
        cards: [10, 10, 10, 6, 6],
        description: "30짓고 6땡"
    },
    {
        cards: [10, 10, 10, 7, 7],
        description: "30짓고 7땡"
    },
    {
        cards: [10, 10, 10, 8, 8],
        description: "30짓고 8땡"
    },
    {
        cards: [10, 10, 10, 9, 9],
        description: "30짓고 9땡"
    },
    {
        cards: [10, 10, 10, 10, 10],
        description: "30짓고 장땡"
    },
    {
        cards: [10, 10, 10, 1, 2],
        description: "30짓고 3끗"
    },
    {
        cards: [10, 10, 10, 2, 3],
        description: "30짓고 5끗"
    },
    {
        cards: [10, 10, 10, 4, 5],
        description: "30짓고 9끗(갑오)"
    },
    {
        cards: [10, 10, 10, 5, 5],
        description: "30짓고 망통"
    },
    
    // 20짓기 케이스 - [9,9,2], [8,8,4], [7,7,6], [6,6,8], [5,5,10] 조합
    {
        cards: [9, 9, 2, 1, 1],
        description: "20짓고 1땡"
    },
    {
        cards: [8, 8, 4, 2, 2],
        description: "20짓고 2땡"
    },
    {
        cards: [7, 7, 6, 3, 3],
        description: "20짓고 3땡"
    },
    {
        cards: [6, 6, 8, 4, 4],
        description: "20짓고 4땡"
    },
    {
        cards: [5, 5, 10, 5, 5],
        description: "20짓고 5땡"
    },
    {
        cards: [9, 9, 2, 1, 2],
        description: "20짓고 3끗"
    },
    {
        cards: [8, 8, 4, 2, 3],
        description: "20짓고 5끗"
    },
    {
        cards: [7, 7, 6, 4, 5],
        description: "20짓고 9끗(갑오)"
    },
    {
        cards: [6, 6, 8, 5, 5],
        description: "20짓고 망통"
    },
    
    // 10짓기 케이스 - [4,4,2], [3,3,4], [2,2,6], [1,1,8] 조합
    {
        cards: [4, 4, 2, 1, 1],
        description: "10짓고 1땡"
    },
    {
        cards: [3, 3, 4, 2, 2],
        description: "10짓고 2땡"
    },
    {
        cards: [2, 2, 6, 3, 3],
        description: "10짓고 3땡"
    },
    {
        cards: [1, 1, 8, 4, 4],
        description: "10짓고 4땡"
    },
    {
        cards: [4, 4, 2, 1, 2],
        description: "10짓고 3끗"
    },
    {
        cards: [3, 3, 4, 2, 3],
        description: "10짓고 5끗"
    },
    {
        cards: [2, 2, 6, 4, 5],
        description: "10짓고 9끗(갑오)"
    },
    {
        cards: [1, 1, 8, 5, 5],
        description: "10짓고 망통"
    },
    
    // 땡 케이스 (1땡부터 장땡까지)
    {
        cards: [1, 1, 3, 4, 5],
        description: "1땡"
    },
    {
        cards: [2, 2, 3, 4, 5],
        description: "2땡"
    },
    {
        cards: [3, 3, 4, 5, 6],
        description: "3땡"
    },
    {
        cards: [4, 4, 5, 6, 7],
        description: "4땡"
    },
    {
        cards: [5, 5, 6, 7, 8],
        description: "5땡"
    },
    {
        cards: [6, 6, 7, 8, 9],
        description: "6땡"
    },
    {
        cards: [7, 7, 8, 9, 10],
        description: "7땡"
    },
    {
        cards: [8, 8, 1, 2, 3],
        description: "8땡"
    },
    {
        cards: [9, 9, 1, 2, 3],
        description: "9땡"
    },
    {
        cards: [10, 10, 1, 2, 3],
        description: "장땡"
    },
    
    // 끗 케이스 (1끗부터 9끗까지)
    {
        cards: [1, 10, 3, 4, 5],
        description: "1끗"
    },
    {
        cards: [1, 1, 3, 4, 5],
        description: "2끗"
    },
    {
        cards: [1, 2, 3, 4, 5],
        description: "3끗"
    },
    {
        cards: [1, 3, 3, 4, 5],
        description: "4끗"
    },
    {
        cards: [1, 4, 3, 4, 5],
        description: "5끗"
    },
    {
        cards: [1, 5, 3, 4, 5],
        description: "6끗"
    },
    {
        cards: [1, 6, 3, 4, 5],
        description: "7끗"
    },
    {
        cards: [1, 7, 3, 4, 5],
        description: "8끗"
    },
    {
        cards: [1, 8, 3, 4, 5],
        description: "9끗(갑오)"
    },
    
    // 망통 케이스 (다양한 조합)
    {
        cards: [1, 9, 2, 3, 4],
        description: "망통 케이스 1"
    },
    {
        cards: [2, 8, 3, 4, 5],
        description: "망통 케이스 2"
    },
    {
        cards: [3, 7, 4, 5, 6],
        description: "망통 케이스 3"
    },
    {
        cards: [4, 6, 5, 7, 8],
        description: "망통 케이스 4"
    },
    {
        cards: [5, 5, 6, 7, 8],
        description: "망통 케이스 5"
    }
];

// 승자 결정 테스트 케이스 추가
const winnerTestCases = [
    {
        description: "황 vs 일반 패 - 일반 패 승리",
        spots: [
            { spot: "1", cards: [1, 2, 4, 6, 8] },  // 황
            { spot: "2", cards: [1, 1, 8, 3, 3] }   // 10짓고 3땡
        ],
        bankerSpot: "1",
        expectedWinner: "2"
    },
    {
        description: "모두 황인 경우 - 뱅커 승리",
        spots: [
            { spot: "1", cards: [1, 2, 4, 6, 8] },  // 황
            { spot: "2", cards: [2, 3, 5, 7, 9] }   // 황
        ],
        bankerSpot: "1",
        expectedWinner: "1"
    },
    {
        description: "황 vs 망통 - 망통 승리",
        spots: [
            { spot: "1", cards: [1, 2, 4, 6, 8] },  // 황
            { spot: "2", cards: [1, 9, 2, 3, 4] }   // 망통
        ],
        bankerSpot: "1",
        expectedWinner: "2"
    },
    {
        description: "짓기 배수 비교 - 높은 배수 승리",
        spots: [
            { spot: "1", cards: [10, 10, 10, 1, 1] },  // 30짓고 1땡
            { spot: "2", cards: [1, 1, 8, 3, 3] }      // 10짓고 3땡
        ],
        bankerSpot: "1",
        expectedWinner: "1"
    },
    {
        description: "동일 짓기 배수에서 남은 패 비교",
        spots: [
            { spot: "1", cards: [9, 9, 2, 1, 1] },  // 20짓고 1땡
            { spot: "2", cards: [9, 9, 2, 3, 3] }   // 20짓고 3땡
        ],
        bankerSpot: "1",
        expectedWinner: "2"
    },
    {
        description: "페어(동일 끗수) - 뱅커 승리",
        spots: [
            { spot: "1", cards: [1, 4, 3, 4, 5] },  // 5끗
            { spot: "2", cards: [2, 3, 3, 4, 5] }   // 5끗
        ],
        bankerSpot: "1",
        expectedWinner: "1"
    }
];

// 테어 처리 테스트 케이스 추가
const pairTestCases = [
    {
        description: "페어(동일 끗수) - 뱅커 승리 선택",
        spots: [
            { spot: "1", cards: [1, 4, 3, 4, 5] },  // 5끗
            { spot: "2", cards: [2, 3, 3, 4, 5] }   // 5끗
        ],
        bankerSpot: "1",
        pairDecision: "banker_win",
        expectedWinner: "1"
    },
    {
        description: "페어(동일 끗수) - 뱅커 패배 선택",
        spots: [
            { spot: "1", cards: [1, 4, 3, 4, 5] },  // 5끗
            { spot: "2", cards: [2, 3, 3, 4, 5] }   // 5끗
        ],
        bankerSpot: "1",
        pairDecision: "banker_lose",
        expectedWinner: "2"
    },
    {
        description: "페어(동일 끗수) - 동점 선택",
        spots: [
            { spot: "1", cards: [1, 4, 3, 4, 5] },  // 5끗
            { spot: "2", cards: [2, 3, 3, 4, 5] }   // 5끗
        ],
        bankerSpot: "1",
        pairDecision: "draw",
        expectedWinner: null
    }
];

// 짓기 배수 테스트 케이스 추가
const jitgiMultipleTestCases = [
    {
        description: "동일 끗수에서 짓기 배수가 높은 경우 승리",
        spots: [
            { spot: "1", cards: [10, 10, 10, 1, 2] },  // 30짓고 3끗
            { spot: "2", cards: [1, 1, 8, 1, 2] }      // 10짓고 3끗
        ],
        bankerSpot: "1",
        expectedWinner: "1"
    },
    {
        description: "동일 땡에서 짓기 배수가 높은 경우 승리",
        spots: [
            { spot: "1", cards: [10, 10, 10, 3, 3] },  // 30짓고 3땡
            { spot: "2", cards: [1, 1, 8, 3, 3] }      // 10짓고 3땡
        ],
        bankerSpot: "1",
        expectedWinner: "1"
    }
];

// 테어 처리 설정 테스트 케이스 추가
const pairSettingsTestCases = [
    {
        description: "페어(동일 끗수) - 설정: 뱅커 승리",
        spots: [
            { spot: "1", cards: [1, 4, 3, 4, 5] },  // 5끗
            { spot: "2", cards: [2, 3, 3, 4, 5] }   // 5끗
        ],
        bankerSpot: "1",
        settings: { default_pair_handling: "banker_win" },
        expectedWinner: "1"
    },
    {
        description: "페어(동일 끗수) - 설정: 뱅커 패배",
        spots: [
            { spot: "1", cards: [1, 4, 3, 4, 5] },  // 5끗
            { spot: "2", cards: [2, 3, 3, 4, 5] }   // 5끗
        ],
        bankerSpot: "1",
        settings: { default_pair_handling: "banker_lose" },
        expectedWinner: "2"
    },
    {
        description: "페어(동일 끗수) - 설정: 동점",
        spots: [
            { spot: "1", cards: [1, 4, 3, 4, 5] },  // 5끗
            { spot: "2", cards: [2, 3, 3, 4, 5] }   // 5끗
        ],
        bankerSpot: "1",
        settings: { default_pair_handling: "draw" },
        expectedWinner: null
    },
    {
        description: "페어(동일 땡) - 설정: 뱅커 승리",
        spots: [
            { spot: "1", cards: [3, 3, 4, 5, 6] },  // 3땡
            { spot: "2", cards: [3, 3, 1, 2, 4] }   // 3땡
        ],
        bankerSpot: "1",
        settings: { default_pair_handling: "banker_win" },
        expectedWinner: "1"
    },
    {
        description: "페어(동일 망통) - 설정: 뱅커 패배",
        spots: [
            { spot: "1", cards: [1, 9, 2, 3, 4] },  // 망통
            { spot: "2", cards: [2, 8, 3, 4, 5] }   // 망통
        ],
        bankerSpot: "1",
        settings: { default_pair_handling: "banker_lose" },
        expectedWinner: "2"
    }
];

// 테스트 실행
console.log("도리찜뽕 게임 계산기 테스트 시작\n");

testCases.forEach((testCase, index) => {
    console.log(`테스트 케이스 #${index + 1}: ${testCase.description}`);
    console.log(`입력: [${testCase.cards.join(', ')}]`);
    
    try {
        const result = calculator.calculateSpotResult(testCase.cards);
        console.log(`결과: ${calculator.formatResult(result)}`);
        console.log(`홀짝: ${result.odd_even}\n`);
    } catch (error) {
        console.error(`에러 발생: ${error.message}\n`);
    }
});

// 승자 결정 테스트 실행
console.log("\n승자 결정 테스트 시작\n");

winnerTestCases.forEach((testCase, index) => {
    console.log(`승자 결정 테스트 #${index + 1}: ${testCase.description}`);
    
    try {
        // 각 스팟의 결과 계산
        const results = testCase.spots.map(spot => ({
            spot: spot.spot,
            cards: spot.cards,
            result: calculator.calculateSpotResult(spot.cards)
        }));

        // 뱅커 스팟 설정
        calculator.bankerSpot = testCase.bankerSpot;

        // 승자 결정
        const winner = calculator.determineWinner(results);
        
        // 결과 검증
        const isCorrect = winner === testCase.expectedWinner;
        console.log(`예상 승자: ${testCase.expectedWinner}`);
        console.log(`실제 승자: ${winner}`);
        console.log(`결과: ${isCorrect ? '성공' : '실패'}\n`);
    } catch (error) {
        console.error(`테스트 실패: ${error.message}\n`);
    }
});

// 페어 처리 테스트 실행
console.log("\n페어 처리 테스트 시작\n");

pairTestCases.forEach((testCase, index) => {
    console.log(`페어 처리 테스트 #${index + 1}: ${testCase.description}`);
    
    try {
        const results = testCase.spots.map(spot => ({
            spot: spot.spot,
            cards: spot.cards,
            result: calculator.calculateSpotResult(spot.cards)
        }));

        calculator.bankerSpot = testCase.bankerSpot;
        calculator.setPairDecision(testCase.pairDecision);

        const winner = calculator.determineWinner(results);
        
        const isCorrect = winner === testCase.expectedWinner;
        console.log(`예상 승자: ${testCase.expectedWinner}`);
        console.log(`실제 승자: ${winner}`);
        console.log(`결과: ${isCorrect ? '성공' : '실패'}\n`);
    } catch (error) {
        console.error(`테스트 실패: ${error.message}\n`);
    }
});

// 짓기 배수 테스트 실행
console.log("\n짓기 배수 테스트 시작\n");

jitgiMultipleTestCases.forEach((testCase, index) => {
    console.log(`짓기 배수 테스트 #${index + 1}: ${testCase.description}`);
    
    try {
        const results = testCase.spots.map(spot => ({
            spot: spot.spot,
            cards: spot.cards,
            result: calculator.calculateSpotResult(spot.cards)
        }));

        calculator.bankerSpot = testCase.bankerSpot;
        
        const winner = calculator.determineWinner(results);
        
        const isCorrect = winner === testCase.expectedWinner;
        console.log(`예상 승자: ${testCase.expectedWinner}`);
        console.log(`실제 승자: ${winner}`);
        console.log(`결과: ${isCorrect ? '성공' : '실패'}\n`);
    } catch (error) {
        console.error(`테스트 실패: ${error.message}\n`);
    }
});

// 페어 설정 테스트 실행
console.log("\n페어 처리 설정 테스트 시작\n");

pairSettingsTestCases.forEach((testCase, index) => {
    console.log(`페어 설정 테스트 #${index + 1}: ${testCase.description}`);
    
    try {
        const results = testCase.spots.map(spot => ({
            spot: spot.spot,
            cards: spot.cards,
            result: calculator.calculateSpotResult(spot.cards)
        }));

        calculator.bankerSpot = testCase.bankerSpot;
        
        // 게임 설정 적용
        if (testCase.settings.default_pair_handling) {
            calculator.setPairDecision(testCase.settings.default_pair_handling);
        }

        const winner = calculator.determineWinner(results);
        
        const isCorrect = winner === testCase.expectedWinner;
        console.log(`예상 승자: ${testCase.expectedWinner}`);
        console.log(`실제 승자: ${winner}`);
        console.log(`설정된 페어 처리: ${testCase.settings.default_pair_handling}`);
        console.log(`결과: ${isCorrect ? '성공' : '실패'}\n`);
    } catch (error) {
        console.error(`테스트 실패: ${error.message}\n`);
    }
}); 