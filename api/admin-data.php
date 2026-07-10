<?php
// Admin data endpoint for employees, customer contracts, and employee contracts.
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

define('ADMIN_PASSWORD', '7777777');
define('MAX_UPLOAD_BYTES', 10 * 1024 * 1024);

$allowedResources = [
  'employees' => [
    'fields' => ['firstName', 'middleName', 'lastName', 'role', 'dateOfEmployment', 'phone', 'email', 'position'],
    'fileField' => 'file',
    'fileRequired' => false,
  ],
  'customer-contracts' => [
    'fields' => ['notes'],
    'fileField' => 'file',
    'fileRequired' => true,
  ],
  'employee-contracts' => [
    'fields' => ['notes'],
    'fileField' => 'file',
    'fileRequired' => true,
  ],
];

function sendJson($success, $message = '', $extra = []) {
  echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
  exit;
}

function requireAuth() {
  $password = $_POST['password'] ?? '';
  if ($password !== ADMIN_PASSWORD) {
    http_response_code(401);
    sendJson(false, 'Unauthorized');
  }
}

function sanitizeFilename($name) {
  $base = basename($name);
  $base = preg_replace('/[^a-zA-Z0-9.\-]/', '-', $base);
  $base = preg_replace('/\-+/', '-', $base);
  return strtolower($base);
}

function allowedExtension($ext) {
  $allowed = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'doc', 'docx'];
  return in_array(strtolower($ext), $allowed, true);
}

function handleFileUpload($file, $uploadDir) {
  if (empty($file['tmp_name']) || $file['error'] !== UPLOAD_ERR_OK) {
    return ['success' => false, 'message' => 'File upload failed'];
  }
  if ($file['size'] > MAX_UPLOAD_BYTES) {
    return ['success' => false, 'message' => 'File is too large (max 10MB)'];
  }
  $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
  if (!allowedExtension($ext)) {
    return ['success' => false, 'message' => 'Invalid file type'];
  }
  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
  }
  $filename = uniqid() . '-' . sanitizeFilename($file['name']);
  $destination = $uploadDir . $filename;
  if (move_uploaded_file($file['tmp_name'], $destination)) {
    return ['success' => true, 'path' => '/uploads/' . basename($uploadDir) . '/' . $filename];
  }
  return ['success' => false, 'message' => 'Could not save uploaded file'];
}

function deleteUploadedFile($uploadDir, $storedPath) {
  if (empty($storedPath)) return;
  $basename = basename($storedPath);
  $file = $uploadDir . $basename;
  if (file_exists($file)) {
    unlink($file);
  }
}

function loadRecords($path) {
  if (!file_exists($path)) {
    file_put_contents($path, json_encode([]));
  }
  $contents = file_get_contents($path);
  return json_decode($contents, true) ?: [];
}

function saveRecords($path, $records) {
  if (file_put_contents($path, json_encode($records, JSON_PRETTY_PRINT)) === false) {
    sendJson(false, 'Could not save data');
  }
}

function findIndex($records, $id) {
  foreach ($records as $i => $record) {
    if (($record['id'] ?? '') === $id) {
      return $i;
    }
  }
  return -1;
}

$resource = $_GET['resource'] ?? '';
if (!isset($allowedResources[$resource])) {
  http_response_code(400);
  sendJson(false, 'Invalid resource');
}

$config = $allowedResources[$resource];
$dataPath = __DIR__ . '/../data/' . $resource . '.json';
$uploadDir = __DIR__ . '/../uploads/' . $resource . '/';

$records = loadRecords($dataPath);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  sendJson(true, '', [$resource => $records]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  requireAuth();

  $action = $_POST['action'] ?? '';
  $id = $_POST['id'] ?? '';

  if ($action === 'delete') {
    $index = findIndex($records, $id);
    if ($index === -1) {
      sendJson(false, 'Record not found');
    }
    deleteUploadedFile($uploadDir, $records[$index]['file'] ?? '');
    array_splice($records, $index, 1);
    saveRecords($dataPath, $records);
    sendJson(true, 'Deleted');
  }

  $record = [];
  foreach ($config['fields'] as $field) {
    $value = $_POST[$field] ?? '';
    if ($field === 'customerContractsCompleted' || $field === 'contractAmount') {
      $value = is_numeric($value) ? (float)$value : 0;
    }
    $record[$field] = $value;
  }

  $fileInfo = null;
  $fileKey = $config['fileField'];
  if (!empty($_FILES[$fileKey]['tmp_name'])) {
    $fileResult = handleFileUpload($_FILES[$fileKey], $uploadDir);
    if (!$fileResult['success']) {
      sendJson(false, $fileResult['message']);
    }
    $fileInfo = $fileResult['path'];
  } elseif ($config['fileRequired'] && ($action !== 'update' || empty($_POST['existingFile']))) {
    sendJson(false, 'A file is required');
  }

  if ($action === 'create') {
    $newId = uniqid();
    $record['id'] = $newId;
    $record['createdAt'] = date('Y-m-d H:i:s');
    if ($fileInfo) {
      $record['file'] = $fileInfo;
    }
    $records[] = $record;
    saveRecords($dataPath, $records);
    sendJson(true, 'Created', ['record' => $record]);
  }

  if ($action === 'update') {
    $index = findIndex($records, $id);
    if ($index === -1) {
      sendJson(false, 'Record not found');
    }
    $existing = $records[$index];
    $record['id'] = $id;
    $record['createdAt'] = $existing['createdAt'] ?? date('Y-m-d H:i:s');
    if ($fileInfo) {
      deleteUploadedFile($uploadDir, $existing['file'] ?? '');
      $record['file'] = $fileInfo;
    } else {
      $record['file'] = $existing['file'] ?? '';
    }
    $records[$index] = $record;
    saveRecords($dataPath, $records);
    sendJson(true, 'Updated', ['record' => $record]);
  }

  sendJson(false, 'Invalid action');
}

http_response_code(405);
sendJson(false, 'Method not allowed');
