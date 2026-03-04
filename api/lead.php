<?php
// Simple JSON-based lead capture for shared hosting (no DB).
// Stores submissions in ../data/leads.json and echoes a JSON response.

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
  exit;
}

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$service = trim($input['service'] ?? '');
$message = trim($input['message'] ?? '');

if ($name === '' || $email === '' || $phone === '' || $service === '') {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Missing required fields']);
  exit;
}

$lead = [
  'name' => $name,
  'email' => $email,
  'phone' => $phone,
  'service' => $service,
  'message' => $message,
  'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
  'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
  'created_at' => date('c')
];

$storagePath = __DIR__ . '/../data/leads.json';
if (!file_exists($storagePath)) {
  file_put_contents($storagePath, json_encode([]));
}

$existing = json_decode(file_get_contents($storagePath), true);
if (!is_array($existing)) {
  $existing = [];
}

$existing[] = $lead;

if (file_put_contents($storagePath, json_encode($existing, JSON_PRETTY_PRINT))) {
  echo json_encode(['success' => true, 'message' => 'Lead stored']);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Could not save lead']);
}
