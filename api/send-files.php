<?php
// Send uploaded files as email attachments.
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

define('ADMIN_PASSWORD', '7777777');

define('FROM_EMAIL', 'help@lighthouseroofing.com');

define('ALLOWED_UPLOAD_DIRS', ['employees', 'customer-contracts', 'employee-contracts']);

function sendJson($success, $message = '') {
  echo json_encode(['success' => $success, 'message' => $message]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  sendJson(false, 'Method not allowed');
}

$password = $_POST['password'] ?? '';
if ($password !== ADMIN_PASSWORD) {
  http_response_code(401);
  sendJson(false, 'Unauthorized');
}

$to = filter_var(trim($_POST['to'] ?? ''), FILTER_VALIDATE_EMAIL);
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');
$files = $_POST['files'] ?? [];

if (!$to) {
  sendJson(false, 'Invalid recipient email');
}
if ($subject === '') {
  sendJson(false, 'Subject is required');
}
if (!is_array($files) || empty($files)) {
  sendJson(false, 'No files selected');
}

$boundary = md5(uniqid());
$headers = "From: " . FROM_EMAIL . "\r\n";
$headers .= "Reply-To: " . FROM_EMAIL . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

$body = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=\"utf-8\"\r\n\r\n";
$body .= $message . "\r\n\r\n";

$attached = 0;
foreach ($files as $fileUrl) {
  $fileUrl = trim($fileUrl);
  if (strpos($fileUrl, '/uploads/') !== 0) {
    continue;
  }

  $parts = explode('/', $fileUrl);
  $dir = $parts[2] ?? '';
  $filename = $parts[3] ?? '';

  if (!in_array($dir, ALLOWED_UPLOAD_DIRS, true) || $filename === '' || strpos($filename, '..') !== false) {
    continue;
  }

  $filePath = __DIR__ . '/..' . $fileUrl;
  if (!file_exists($filePath) || !is_file($filePath)) {
    continue;
  }

  $content = file_get_contents($filePath);
  if ($content === false) {
    continue;
  }

  $encoded = chunk_split(base64_encode($content));
  $mime = mime_content_type($filePath) ?: 'application/octet-stream';

  $body .= "--$boundary\r\n";
  $body .= "Content-Type: $mime; name=\"$filename\"\r\n";
  $body .= "Content-Transfer-Encoding: base64\r\n";
  $body .= "Content-Disposition: attachment; filename=\"$filename\"\r\n\r\n";
  $body .= $encoded . "\r\n";
  $attached++;
}

$body .= "--$boundary--\r\n";

if ($attached === 0) {
  sendJson(false, 'None of the selected files could be attached');
}

if (mail($to, $subject, $body, $headers)) {
  sendJson(true, 'Email sent with ' . $attached . ' attachment' . ($attached > 1 ? 's' : ''));
} else {
  http_response_code(500);
  sendJson(false, 'Could not send email');
}
