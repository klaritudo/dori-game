<?php
use PHPUnit\Framework\TestCase;

class AuthFlowTest extends TestCase {
    private $helper;

    protected function setUp(): void {
        $this->helper = new TestHelper();
    }

    public function testCompleteAuthFlow() {
        // 1. 회원가입
        $registerData = [
            'username' => 'testuser' . time(),
            'password' => 'password123',
            'phone' => '01012345678'
        ];
        
        $response = $this->helper->makeRequest('POST', '/api/auth/register.php', $registerData);
        $this->assertEquals(200, $response['status']);

        // 2. 휴대폰 인증
        $response = $this->helper->makeRequest('POST', '/api/auth/verify-phone.php', [
            'phone' => $registerData['phone']
        ]);
        $this->assertEquals(200, $response['status']);

        // 3. 인증번호 확인
        $response = $this->helper->makeRequest('POST', '/api/auth/verify-code.php', [
            'phone' => $registerData['phone'],
            'code' => '123456' // 테스트용 코드
        ]);
        $this->assertEquals(200, $response['status']);

        // 4. 로그인
        $response = $this->helper->makeRequest('POST', '/api/auth/login.php', [
            'username' => $registerData['username'],
            'password' => $registerData['password']
        ]);
        $this->assertEquals(200, $response['status']);
        $this->assertArrayHasKey('token', $response['data']);

        return $response['data']['token'];
    }

    /**
     * @depends testCompleteAuthFlow
     */
    public function testAuthenticatedRequests($token) {
        // 인증이 필요한 API 테스트
        $response = $this->helper->makeRequest('GET', '/api/game/betting-history.php', null, [
            'Authorization: Bearer ' . $token
        ]);
        $this->assertEquals(200, $response['status']);
    }
} 