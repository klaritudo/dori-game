<?php
require 'vendor/autoload.php';
require_once __DIR__ . '/public/server/WebSocketServer.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new WebSocketServer()
        )
    ),
    8081
);

echo "WebSocket Server started at port 8081\n";
$server->run(); 