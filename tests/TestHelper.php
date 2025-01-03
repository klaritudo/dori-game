<?php
require_once __DIR__ . '/config/test-config.php';

class TestHelper {
    private $baseUrl = 'http://localhost:8080';
    private $pdo;

    public function __construct() {
        $this->pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS
        );
    }

    public function makeRequest($method, $endpoint, $data = null, $headers = []) {
        $ch = curl_init();
        $url = $this->baseUrl . $endpoint;

        $defaultHeaders = ['Content-Type: application/json'];
        $headers = array_merge($defaultHeaders, $headers);

        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers
        ];

        if ($data) {
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
        }

        curl_setopt_array($ch, $options);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'status' => $httpCode,
            'data' => json_decode($response, true)
        ];
    }

    public function cleanupTestData() {
        // 테스트 데이터 정리
        $this->pdo->exec("DELETE FROM betting_history WHERE 1");
        $this->pdo->exec("DELETE FROM game_history WHERE 1");
        $this->pdo->exec("DELETE FROM phone_verification WHERE 1");
    }
} 