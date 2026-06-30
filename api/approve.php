<?php
// Handle review approval/deletion operations
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

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

$reviews = $input['reviews'] ?? null;
if (!is_array($reviews)) {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Invalid reviews data']);
  exit;
}

$storagePath = __DIR__ . '/../data/reviews.json';

if (file_put_contents($storagePath, json_encode($reviews, JSON_PRETTY_PRINT))) {
  echo json_encode(['success' => true, 'message' => 'Reviews updated']);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Could not save reviews']);
}
