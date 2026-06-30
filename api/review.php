<?php
// Simple JSON-based review capture for shared hosting (no DB).
// Stores submissions in ../data/reviews.json and echoes a JSON response.

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

$name = trim($input['reviewer_name'] ?? '');
$rating = trim($input['rating'] ?? '');
$text = trim($input['review_text'] ?? '');

if ($name === '' || $rating === '' || $text === '') {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Missing required fields']);
  exit;
}

if (!is_numeric($rating) || $rating < 1 || $rating > 5) {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Invalid rating']);
  exit;
}

$review = [
  'name' => $name,
  'rating' => (int)$rating,
  'text' => $text,
  'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
  'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
  'date' => date('Y-m-d'),
  'approved' => false
];

$storagePath = __DIR__ . '/../data/reviews.json';
if (!file_exists($storagePath)) {
  file_put_contents($storagePath, json_encode([]));
}

$existing = json_decode(file_get_contents($storagePath), true);
if (!is_array($existing)) {
  $existing = [];
}

$existing[] = $review;

if (file_put_contents($storagePath, json_encode($existing, JSON_PRETTY_PRINT))) {
  echo json_encode(['success' => true, 'message' => 'Review stored']);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Could not save review']);
}
