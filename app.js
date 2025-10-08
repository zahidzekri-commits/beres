<?php
// webhook.php

// Verify token (used during webhook setup)
$verify_token = "YOUR_VERIFY_TOKEN";

// Handle the GET request (for webhook verification)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $mode = $_GET['hub_mode'] ?? '';
    $token = $_GET['hub_verify_token'] ?? '';
    $challenge = $_GET['hub_challenge'] ?? '';

    if ($mode === 'subscribe' && $token === $verify_token) {
        // Verification success
        echo $challenge;
        exit;
    } else {
        // Verification failed
        http_response_code(403);
        echo "Forbidden";
        exit;
    }
}

// Handle the POST request (for incoming webhook events)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the POST body content
    $input = file_get_contents('php://input');

    // Decode JSON
    $data = json_decode($input, true);

    // Log or process the webhook data
    file_put_contents('webhook_log.txt', print_r($data, true), FILE_APPEND);

    // Send a 200 OK response back to Meta
    http_response_code(200);
    echo "EVENT_RECEIVED";
    exit;
}

// If method not GET or POST
http_response_code(405);
echo "Method Not Allowed";
