-- 사용자 테이블
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 게임 설정 테이블 (전역 설정)
CREATE TABLE game_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    timer_duration INT NOT NULL DEFAULT 60,
    betting_end_time INT NOT NULL DEFAULT 10,
    auto_betting_enabled BOOLEAN DEFAULT false,
    auto_betting_amount DECIMAL(15,2) DEFAULT 10000,
    auto_betting_delay INT DEFAULT 1,
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    betting_mode ENUM('single', 'combination') DEFAULT 'single',
    default_pair_handling ENUM('banker_win', 'player_win', 'tie') DEFAULT 'banker_win',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 베팅 옵션별 설정 테이블
CREATE TABLE betting_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    option_name VARCHAR(10) NOT NULL,  -- '1', '2', '3', '홀', '짝'
    min_bet DECIMAL(15,2) NOT NULL DEFAULT 1000,
    max_bet DECIMAL(15,2) NOT NULL DEFAULT 1000000,
    odds DECIMAL(5,2) NOT NULL DEFAULT 1.95,
    is_active BOOLEAN DEFAULT true,
    total_bet DECIMAL(15,2) DEFAULT 0,  -- 현재 게임의 총 베팅액
    bet_count INT DEFAULT 0,           -- 현재 게임의 베팅 횟수
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_option (option_name)
);

-- 게임 히스토리 테이블
CREATE TABLE game_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_number VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('waiting', 'running', 'closed', 'ended') NOT NULL,
    result VARCHAR(10) NULL,
    result_details JSON NULL,
    total_bet DECIMAL(15,2) DEFAULT 0,
    total_payout DECIMAL(15,2) DEFAULT 0,
    profit DECIMAL(15,2) DEFAULT 0,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 베팅 히스토리 테이블
CREATE TABLE betting_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    bet_option VARCHAR(10) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status ENUM('active', 'cancelled', 'settled') NOT NULL,
    payout DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES game_history(id)
);

-- 휴대폰 인증 테이블
CREATE TABLE phone_verification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    verified BOOLEAN DEFAULT false,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터 삽입
INSERT INTO game_settings (timer_duration, betting_end_time) VALUES (30, 10);

INSERT INTO betting_options (option_name, min_bet, max_bet, odds) VALUES 
('1', 1000, 1000000, 1.95),
('2', 1000, 1000000, 1.95),
('3', 1000, 1000000, 1.95),
('홀', 1000, 1000000, 1.95),
('짝', 1000, 1000000, 1.95); 