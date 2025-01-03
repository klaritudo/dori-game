<?php
use PHPUnit\Framework\TestCase;

class AuthIntegrationTest extends TestCase {
    private $helper;

    protected function setUp(): void {
        $this->helper = new TestHelper();
    }

    public function testFullLoginFlow() {
        // 1. 휴대폰 인증 요청
        $response = $this->helper->makeRequest('POST', '/api/auth/verify-phone.php', [
            'phone' => '01012345678'
        ]);
        $this->assertEquals(200, $response['status']);

        // 2. 인증 코드 확인
        $response = $this->helper->makeRequest('POST', '/api/auth/verify-code.php', [
            'phone' => '01012345678',
            'code' => '123456'
        ]);
        $this->assertEquals(200, $response['status']);

        // 3. 로그인
        $response = $this->helper->makeRequest('POST', '/api/auth/login.php', [
            'username' => 'testuser',
            'password' => 'password123'
        ]);
        $this->assertEquals(200, $response['status']);
        $this->assertArrayHasKey('token', $response['data']);
    }
} 