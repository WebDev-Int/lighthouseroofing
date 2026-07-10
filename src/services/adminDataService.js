import { ADMIN_PASSWORD } from './api.js';

const ADMIN_DATA_ENDPOINT = '/api/admin-data.php';

export async function fetchResource(resource) {
  const res = await fetch(`${ADMIN_DATA_ENDPOINT}?resource=${encodeURIComponent(resource)}`, {
    cache: 'no-cache',
  });
  if (!res.ok) throw new Error('Unable to load ' + resource);
  return res.json();
}

export async function createResource(resource, formData) {
  formData.append('action', 'create');
  formData.append('password', ADMIN_PASSWORD);

  const res = await fetch(`${ADMIN_DATA_ENDPOINT}?resource=${encodeURIComponent(resource)}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Network response was not ok');

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to create');
  return data;
}

export async function updateResource(resource, id, formData) {
  formData.append('action', 'update');
  formData.append('id', id);
  formData.append('password', ADMIN_PASSWORD);

  const res = await fetch(`${ADMIN_DATA_ENDPOINT}?resource=${encodeURIComponent(resource)}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Network response was not ok');

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update');
  return data;
}

export async function deleteResource(resource, id) {
  const formData = new FormData();
  formData.append('action', 'delete');
  formData.append('id', id);
  formData.append('password', ADMIN_PASSWORD);

  const res = await fetch(`${ADMIN_DATA_ENDPOINT}?resource=${encodeURIComponent(resource)}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Network response was not ok');

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to delete');
  return data;
}
