class BettingOverlay {
    constructor() {
        this.selectedSpot = null;
        this.selectedChip = null;
        this.chipStacks = new Map();
        this.activeChips = new Map();
        this.totalBettingAmount = 0;
        this.bettingHistory = [];
        this.lastDoubleBet = new Map();
        
        $(document).ready(() => {
            this.init();
        });

        $(window).on('resize', () => {
            this.repositionAllChips();
        });

        // 드래그 방지를 위한 이벤트 추가
        this.preventDrag();
    }

    preventDrag() {
        // 전체 게임 영역에 드래그 방지 적용
        $('.dori-game-container').on('dragstart', (e) => e.preventDefault());
        
        // 텍스트 선택 방지
        $('.dori-game-container').css({
            '-webkit-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none'
        });
    }

    init() {
        console.log('Initializing BettingOverlay');
        this.bettingSpots = $('.bet-spot');
        this.chips = $('.chip');
        this.$bettingAmount = $('.betting-amount .value');
        this.$balanceAmount = $('.balance-amount .value');
        
        if (this.bettingSpots.length === 0) {
            console.error('No betting spots found');
            return;
        }

        this.bettingSpots.each((index, spot) => {
            const $spot = $(spot);
            $spot.data('originalBorder', $spot.css('border'));
            this.chipStacks.set($spot[0], []);
        });

        this.$confirmBtn = $('.control-btn.confirm');
        this.$undoBtn = $('.control-btn.undo');
        this.$cancelBtn = $('.action-btn.cancel');
        this.$doubleBtn = $('.action-btn.double');

        this.initializeDefaultChip();
        
        this.bindEvents();
    }

    initializeDefaultChip() {
        const defaultChip = this.chips.filter('[data-value="1"]').first();
        if (defaultChip.length) {
            this.handleChipClick(null, defaultChip);
        }
    }

    bindEvents() {
        this.bettingSpots.each((index, spot) => {
            const $spot = $(spot);
            $spot.off('click touchstart').on('click touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleSpotSelection(e, $spot);
            });
        });

        this.chips.each((index, chip) => {
            const $chip = $(chip);
            $chip.off('click touchstart').on('click touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleChipClick(e, $chip);
            });
        });

        this.$confirmBtn.on('click', () => this.handleConfirm());
        this.$undoBtn.on('click', () => this.handleUndo());
        this.$cancelBtn.on('click', () => this.handleCancel());
        this.$doubleBtn.on('click', () => this.handleDouble());
    }

    handleChipClick(e, $chip) {
        if (this.selectedChip && this.selectedChip[0] === $chip[0]) {
            $chip.css({
                'transform': 'scale(1)',
                'border': 'none'
            });
            this.selectedChip = null;
            return;
        }

        if (this.selectedChip) {
            this.selectedChip.css({
                'transform': 'scale(1)',
                'border': 'none'
            });
        }

        $chip.css({
            'transform': 'scale(1.1)',
            'border': '2px solid white'
        });
        this.selectedChip = $chip;
    }

    handleSpotSelection(e, $spot) {
        if (this.selectedSpot && this.selectedSpot[0] !== $spot[0]) {
            this.selectedSpot.css('border', this.selectedSpot.data('originalBorder'));
        }

        $spot.css('border', '2px solid white');
        this.selectedSpot = $spot;

        if (this.selectedChip) {
            const chipValue = this.selectedChip.data('value') * 10000;
            const currentBalance = this.getCurrentBalance();

            if (chipValue > currentBalance) {
                this.showModal("보유금이 충분하지 않습니다.");
                return;
            }

            this.placeBet($spot, this.selectedChip, chipValue);
        }
    }

    placeBet($spot, $chip, chipValue) {
        const betInfo = {
            spot: $spot,
            chip: $chip,
            value: chipValue,
            type: 'bet'
        };
        this.bettingHistory.push(betInfo);

        this.animateChipToSpot($chip, $spot);
        this.updateBalance(-chipValue);
        this.totalBettingAmount += chipValue;
        this.updateBettingAmount();

        const spotKey = $spot[0];
        const currentSpotBet = this.lastDoubleBet.get(spotKey) || 0;
        this.lastDoubleBet.set(spotKey, chipValue);
    }

    handleDouble() {
        if (!this.selectedChip || !this.selectedSpot) return;

        const spotKey = this.selectedSpot[0];
        const chipValue = this.selectedChip.data('value') * 10000;
        const currentBet = parseInt(this.selectedSpot.find('.total-bet').text().replace(/,/g, '')) || 0;
        
        // 첫 더블인 경우 1배, 이후에는 2배
        let doubleAmount = chipValue;
        if (currentBet > chipValue) {
            doubleAmount = chipValue * 2;
        }

        // 보유금 체크
        if (doubleAmount > this.getCurrentBalance()) {
            this.showModal("보유금이 충분하지 않습니다.");
            return;
        }

        // 더블 베팅 실행
        this.placeBet(this.selectedSpot, this.selectedChip, doubleAmount);
    }

    handleUndo() {
        const lastAction = this.bettingHistory.pop();
        if (!lastAction) return;

        const spotKey = lastAction.spot[0];

        const activeChips = this.activeChips.get(spotKey);
        if (activeChips && activeChips.length > 0) {
            const removedChip = activeChips.pop();
            removedChip.remove();
        }

        this.chipStacks.get(spotKey).pop();

        this.updateBalance(lastAction.value);
        this.totalBettingAmount -= lastAction.value;
        this.updateBettingAmount();

        const $totalBet = lastAction.spot.find('.total-bet');
        const currentBet = parseInt($totalBet.text().replace(/,/g, ''));
        $totalBet.text((currentBet - lastAction.value).toLocaleString());

        const lastSpotBet = this.lastDoubleBet.get(spotKey) || 0;
        this.lastDoubleBet.set(spotKey, lastSpotBet / 2);

        this.repositionAllChips();
    }

    handleCancel() {
        const totalRefund = this.totalBettingAmount;
        if (totalRefund > 0) {
            this.updateBalance(totalRefund);
        }

        this.activeChips.forEach((chips, spotKey) => {
            chips.forEach(chip => chip.remove());
        });

        this.activeChips.clear();
        this.chipStacks.forEach(stack => stack.length = 0);
        this.bettingHistory = [];
        this.lastDoubleBet.clear();
        this.totalBettingAmount = 0;
        this.updateBettingAmount();

        this.bettingSpots.each((index, spot) => {
            $(spot).find('.total-bet').text('0');
        });

        this.initializeDefaultChip();
    }

    handleConfirm() {
        if (this.totalBettingAmount === 0) {
            this.showModal("베팅 금액이 없습니다.");
            return;
        }

        this.showModal("베팅이 되었습니다");
        
        this.initializeDefaultChip();
    }

    getCurrentBalance() {
        return parseInt(this.$balanceAmount.text().replace(/,/g, '')) || 0;
    }

    updateBalance(amount) {
        const currentBalance = this.getCurrentBalance();
        const newBalance = currentBalance + amount;
        this.$balanceAmount.text(newBalance.toLocaleString());
    }

    updateBettingAmount() {
        this.$bettingAmount.text(this.totalBettingAmount.toLocaleString());
    }

    updateTotalBet($spot, chipValue) {
        const $totalBet = $spot.find('.total-bet');
        const currentBet = parseInt($totalBet.text().replace(/,/g, '')) || 0;
        const newBet = currentBet + (chipValue * 10000);
        $totalBet.text(newBet.toLocaleString());
    }

    showModal(message) {
        $('.betting-modal').remove();

        const $modal = $('<div>', {
            class: 'betting-modal',
            css: {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '20px',
                borderRadius: '5px',
                zIndex: 9999,
                textAlign: 'center'
            }
        }).text(message);

        $('body').append($modal);

        setTimeout(() => {
            $modal.fadeOut(300, function() {
                $(this).remove();
            });
        }, 1000);
    }

    animateChipToSpot($chip, $spot) {
        const $clonedChip = $chip.clone();
        const chipValue = $chip.data('value');
        const spotKey = $spot[0];
        
        const stackHeight = this.chipStacks.get(spotKey).length * 2;
        
        $clonedChip.css({
            position: 'absolute',
            zIndex: 1000,
            transition: 'all 0.5s ease'
        });

        $spot.append($clonedChip);
        
        const chipSize = {
            width: $chip.outerWidth(),
            height: $chip.outerHeight()
        };

        $clonedChip.css({
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(0.7)',
            marginTop: -stackHeight
        });

        if (!this.activeChips.has(spotKey)) {
            this.activeChips.set(spotKey, []);
        }
        this.activeChips.get(spotKey).push($clonedChip);

        this.chipStacks.get(spotKey).push({
            element: $clonedChip,
            value: chipValue
        });

        this.updateTotalBet($spot, chipValue);
    }

    repositionAllChips() {
        this.activeChips.forEach((chips, spotKey) => {
            const $spot = $(spotKey);
            chips.forEach((chip, index) => {
                chip.css({
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%) scale(0.7)',
                    marginTop: -(index * 2)
                });
            });
        });
    }
}

$(document).ready(() => {
    console.log('Creating BettingOverlay instance');
    window.bettingOverlay = new BettingOverlay();
}); 