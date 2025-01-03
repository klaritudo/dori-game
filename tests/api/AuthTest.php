<?php
use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/../TestHelper.php';

class AuthTest extends TestCase {
    private $helper;

    protected function setUp(): void {
        $this->helper = new TestHelper();
    }

    public function testLogin() {
        // 로그인 성공 테스트
        $response = $this->helper->makeRequest('POST', '/api/auth/login.php', [
            'username' => 'testuser',
            'password' => 'password123'
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertTrue($response['data']['success']);
        $this->assertArrayHasKey('token', $response['data']);

        // 잘못된 비밀번호 테스트
        $response = $this->helper->makeRequest('POST', '/api/auth/login.php', [
            'username' => 'testuser',
            'password' => 'wrongpassword'
        ]);

        $this->assertEquals(401, $response['status']);
        $this->assertFalse($response['data']['success']);
    }

    public function testPhoneVerification() {
        // 휴대폰 인증 요청 테스트
        $response = $this->helper->makeRequest('POST', '/api/auth/verify-phone.php', [
            'phone' => '01012345678'
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertTrue($response['data']['success']);

        // 잘못된 형식의 전화번호 테스트
        $response = $this->helper->makeRequest('POST', '/api/auth/verify-phone.php', [
            'phone' => '010123'
        ]);

        $this->assertEquals(400, $response['status']);
        $this->assertFalse($response['data']['success']);
    }

    public function testVerifyCode() {
        // 인증 코드 확인 테스트
        $response = $this->helper->makeRequest('POST', '/api/auth/verify-code.php', [
            'phone' => '01012345678',
            'code' => '123456'
        ]);

        $this->assertEquals(200, $response['status']);
        $this->assertTrue($response['data']['success']);
    }
} 