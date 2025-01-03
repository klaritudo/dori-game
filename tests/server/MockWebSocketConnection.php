<?php
class MockWebSocketConnection {
    public $messages = [];
    public $closed = false;

    public function send($message) {
        $this->messages[] = $message;
    }

    public function close() {
        $this->closed = true;
    }
} 