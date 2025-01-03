// 전역 상태 관리
window.balanceState = {
    balance: 100000000,
    points: 1000000
};

// 화면 업데이트 함수
function updateBalanceDisplay() {
    const formattedBalance = window.balanceState.balance.toLocaleString('ko-KR');
    const formattedPoints = window.balanceState.points.toLocaleString('ko-KR');

    // top-bar 업데이트
    const $topBar = $('.balance-info');
    if ($topBar.length > 0) {
        $topBar.find('.balance-item:first .point-container .balance-value').text(formattedBalance + '원');
        $topBar.find('.balance-item:last .point-container .balance-value').text(formattedPoints);
    }

    // 마이페이지 업데이트
    const $depositForm = $('.deposit-form');
    if ($depositForm.length > 0) {
        $depositForm.find('.balance-item:first .point-amount').text(formattedBalance);
        $depositForm.find('.balance-item:first .point-unit').text('원');
        $depositForm.find('.balance-item:last .point-amount').text(formattedPoints);
        $depositForm.find('.balance-item:last .point-unit').text('P');
    }
}

// 포인트 전환 처리
function handlePointConversion(e) {
    e.preventDefault();
    
    const currentPoints = window.balanceState.points;
    
    if (currentPoints <= 0) {
        showModal("전환할 포인트가 없습니다.");
        return;
    }

    const $confirmModal = $('#confirmModal');
    if ($confirmModal.length === 0) {
        console.error('Confirm modal not found');
        return;
    }

    $confirmModal.find('.modal-text').text("포인트 전환 하시겠습니까?");
    $confirmModal.css('display', 'flex');

    // 이벤트 중복 방지
    $confirmModal.find('.modal-confirm').off('click').one('click', function() {
        // 보유금액 증가, 포인트 차감
        window.balanceState.balance += currentPoints;
        window.balanceState.points = 0;
        
        // 화면 업데이트
        updateBalanceDisplay();
        
        // 모달 닫기
        $confirmModal.css('display', 'none');
        
        // 완료 메시지
        setTimeout(() => {
            showModal("포인트 전환이 완료되었습니다.");
        }, 300);
    });

    // 취소 버튼
    $confirmModal.find('.modal-cancel').off('click').one('click', function() {
        $confirmModal.css('display', 'none');
    });
}

// 새로고침 처리
function handleRefresh(e) {
    e.preventDefault();
    
    const $button = $(this);
    const $svg = $button.find('svg');
    
    // 애니메이션
    $svg.css({
        'transform': 'rotate(360deg)',
        'transition': 'transform 0.5s'
    });
    
    setTimeout(() => {
        $svg.css({
            'transform': 'rotate(0deg)',
            'transition': 'none'
        });
    }, 500);

    // 화면 업데이트
    updateBalanceDisplay();
}

// 일반 모달 표시
function showModal(message) {
    const $modal = $('#alertModal');
    $modal.find('.modal-text').text(message);
    $modal.css('display', 'flex');

    // 확인 버튼
    $modal.find('.modal-confirm').off('click').one('click', function() {
        $modal.css('display', 'none');
    });
}

// 초기화 함수
function initializePointConversion() {
    // 이벤트 리스너 초기화
    $(document).off('click', '.convert-button, .refresh-button');
    
    // 이벤트 리스너 등록
    $(document).on('click', '.convert-button', handlePointConversion);
    $(document).on('click', '.refresh-button', handleRefresh);

    // 모달 외부 클릭 시 닫기
    $(window).off('click.modal').on('click.modal', function(e) {
        if ($(e.target).hasClass('modal')) {
            $(e.target).css('display', 'none');
        }
    });

    // 초기 화면 업데이트
    updateBalanceDisplay();
}

// 초기화 실행
$(document).ready(initializePointConversion); 