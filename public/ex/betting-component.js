// 베팅 컴포넌트 정의
const BettingComponent = videojs.extend(videojs.getComponent('ClickableComponent'), {
    constructor: function(player, options) {
        videojs.getComponent('ClickableComponent').call(this, player, options);
        this.player = player;
        this.setupBettingUI();
    },

    // 베팅 UI 생성
    setupBettingUI() {
        this.bettingContainer = videojs.dom.createEl('div', {
            className: 'vjs-betting-container'
        });

        // 베팅 스팟 생성
        this.createBettingSpots();
        // 베팅 컨트롤 생성
        this.createBettingControls();
        // 패턴 테이블 생성
        this.createPatternTable();

        // 플레이어에 추가
        this.player.el().appendChild(this.bettingContainer);
    },

    // 베팅 스팟 생성
    createBettingSpots() {
        const spots = [
            { label: '홀', class: 'odd', multiplier: '1.93' },
            { label: '1', class: 'one', multiplier: '1.93' },
            { label: '2', class: 'two', multiplier: '1.93' },
            { label: '3', class: 'three', multiplier: '1.93' },
            { label: '짝', class: 'even', multiplier: '1.93' }
        ];

        const spotsContainer = videojs.dom.createEl('div', {
            className: 'vjs-betting-spots'
        });

        spots.forEach(spot => {
            const spotEl = this.createSpot(spot);
            spotsContainer.appendChild(spotEl);
        });

        this.bettingContainer.appendChild(spotsContainer);
    },

    // 개별 베팅 스팟 생성
    createSpot(spot) {
        const spotEl = videojs.dom.createEl('button', {
            className: `vjs-bet-spot ${spot.class}`,
            innerHTML: `
                <span class="multiplier">${spot.multiplier}</span>
                <span class="total-bet">0</span>
                <span class="spot-label">${spot.label}</span>
            `
        });

        // 클릭 이벤트 핸들러 등록
        spotEl.addEventListener('click', () => this.handleSpotClick(spot));
        return spotEl;
    },

    // 베팅 컨트롤 생성
    createBettingControls() {
        const controls = [
            { name: 'undo', icon: 'undo', label: '돌리기' },
            { name: 'confirm', icon: 'confirm', label: '확인' },
            { name: 'double', icon: 'double', label: 'X2' },
            { name: 'cancel', icon: 'cancel', label: '취소' }
        ];

        const controlsContainer = videojs.dom.createEl('div', {
            className: 'vjs-betting-controls'
        });

        controls.forEach(control => {
            const button = this.createControlButton(control);
            controlsContainer.appendChild(button);
        });

        this.bettingContainer.appendChild(controlsContainer);
    },

    // 컨트롤 버튼 생성
    createControlButton(control) {
        const button = videojs.dom.createEl('button', {
            className: `vjs-control-button ${control.name}`,
            innerHTML: `<img src="img/betcontrol/betcontrol-${control.icon}.svg" alt="${control.label}">`
        });

        button.addEventListener('click', () => this.handleControlClick(control.name));
        return button;
    },

    // 베팅 스팟 클릭 핸들러
    handleSpotClick(spot) {
        // 베팅 로직 구현
        console.log(`베팅 스팟 클릭: ${spot.label}`);
        this.trigger('betPlaced', spot);
    },

    // 컨트롤 버튼 클릭 핸들러
    handleControlClick(action) {
        switch(action) {
            case 'undo':
                this.handleUndo();
                break;
            case 'confirm':
                this.handleConfirm();
                break;
            case 'double':
                this.handleDouble();
                break;
            case 'cancel':
                this.handleCancel();
                break;
        }
    },

    // 컨트롤 액션 핸들러들
    handleUndo() {
        console.log('베팅 되돌리기');
        this.trigger('betUndo');
    },

    handleConfirm() {
        console.log('베팅 확인');
        this.trigger('betConfirm');
    },

    handleDouble() {
        console.log('베팅 더블');
        this.trigger('betDouble');
    },

    handleCancel() {
        console.log('베팅 취소');
        this.trigger('betCancel');
    }
});

// 컴포넌트 등록
videojs.registerComponent('BettingComponent', BettingComponent);

// 플러그인 등록
videojs.registerPlugin('betting', function(options) {
    this.ready(() => {
        // 베팅 컴포넌트 생성
        const bettingComponent = new BettingComponent(this, options);

        // PIP 모드 이벤트 처리
        this.on('enterpictureinpicture', () => {
            bettingComponent.bettingContainer.classList.add('vjs-pip-mode');
        });

        this.on('leavepictureinpicture', () => {
            bettingComponent.bettingContainer.classList.remove('vjs-pip-mode');
        });

        // 전체화면 이벤트 처리
        this.on('fullscreenchange', () => {
            if (this.isFullscreen()) {
                bettingComponent.bettingContainer.classList.add('vjs-fullscreen');
            } else {
                bettingComponent.bettingContainer.classList.remove('vjs-fullscreen');
            }
        });

        // 베팅 이벤트 리스너
        bettingComponent.on('betPlaced', (spot) => {
            // 베팅 처리 로직
        });

        bettingComponent.on('betUndo', () => {
            // 베팅 되돌리기 로직
        });

        bettingComponent.on('betConfirm', () => {
            // 베팅 확인 로직
        });

        bettingComponent.on('betDouble', () => {
            // 베팅 더블 로직
        });

        bettingComponent.on('betCancel', () => {
            // 베팅 취소 로직
        });
    });
}); 