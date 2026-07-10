import { ADMIN_PASSWORD } from './api.js';

const ADMIN_DATA_ENDPOINT = '/api/admin-data.php';
const IS_DEV = import.meta.env.DEV;

const devStores = {};

const sampleEmployees = [
  {
    id: 'emp1',
    firstName: 'John',
    middleName: 'A',
    lastName: 'Doe',
    dateOfEmployment: '2022-03-15',
    role: 'Crew Lead / Foreman',
    customerContractsCompleted: 12,
    phone: '(555) 010-1001',
    email: 'john@lighthouseroofing.com',
    position: 'Roofing Lead',
  },
  {
    id: 'emp2',
    firstName: 'Jane',
    middleName: '',
    lastName: 'Smith',
    dateOfEmployment: '2021-07-01',
    role: 'Sales / Estimator',
    customerContractsCompleted: 8,
    phone: '(555) 010-1002',
    email: 'jane@lighthouseroofing.com',
    position: 'Gutter Specialist',
  },
  {
    id: 'emp3',
    firstName: 'Mike',
    middleName: 'R',
    lastName: 'Johnson',
    dateOfEmployment: '2023-01-10',
    role: 'Roofer / Technician',
    customerContractsCompleted: 5,
    phone: '(555) 010-1003',
    email: 'mike@lighthouseroofing.com',
    position: 'Siding Installer',
  },
  {
    id: 'emp4',
    firstName: 'John',
    middleName: 'Paul',
    lastName: 'Cook',
    dateOfEmployment: '2026-01-01',
    role: 'Administrator',
    customerContractsCompleted: 0,
    phone: '(346) 679-3429',
    email: 'cooksta120021@gmail.com',
    position: 'Administrator',
  },
];

function getDevStore(resource) {
  if (!devStores[resource]) {
    const saved = IS_DEV ? localStorage.getItem(`dev-${resource}`) : null;
    devStores[resource] = saved ? JSON.parse(saved) : [];
  }
  return devStores[resource];
}

function saveDevStore(resource, items) {
  devStores[resource] = items;
  if (IS_DEV) {
    localStorage.setItem(`dev-${resource}`, JSON.stringify(items));
  }
}

function seedEmployees() {
  const store = getDevStore('employees');
  if (store.length === 0) {
    store.push(...sampleEmployees);
    saveDevStore('employees', store);
  }
}

function seedEmployeeContracts() {
  const store = getDevStore('employee-contracts');
  if (store.length === 0) {
    store.push({
      id: 'ec_sample',
      notes: 'Mock employee document for development testing',
      file: '/uploads/employee-contracts/mock-contract.pdf',
      createdAt: new Date().toISOString(),
    });
    saveDevStore('employee-contracts', store);
  }
}

function seedCustomerContracts() {
  const store = getDevStore('customer-contracts');
  if (store.length === 0) {
    store.push({
      id: 'cc_sample',
      notes: 'Mock customer contract for development testing',
      file: '/uploads/customer-contracts/mock-contract.pdf',
      createdAt: new Date().toISOString(),
    });
    saveDevStore('customer-contracts', store);
  }
}

function formDataToRecord(formData, existing = null) {
  const record = {};
  for (const [key, value] of formData.entries()) {
    if (key === 'action' || key === 'id' || key === 'password' || key === 'existingFile') continue;
    record[key] = value;
  }
  const file = formData.get('file');
  if (file && file instanceof File && file.name) {
    record.file = `/uploads/dev/${file.name}`;
  } else if (existing && existing.file) {
    record.file = existing.file;
  }
  return record;
}

function devDelay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchResource(resource) {
  if (IS_DEV) {
    await devDelay();
    if (resource === 'employees') seedEmployees();
    if (resource === 'employee-contracts') {
      seedEmployees();
      seedEmployeeContracts();
    }
    if (resource === 'customer-contracts') seedCustomerContracts();
    return { [resource]: getDevStore(resource) };
  }

  const res = await fetch(`${ADMIN_DATA_ENDPOINT}?resource=${encodeURIComponent(resource)}`, {
    cache: 'no-cache',
  });
  if (!res.ok) throw new Error('Unable to load ' + resource);
  return res.json();
}

export async function createResource(resource, formData) {
  if (IS_DEV) {
    await devDelay();
    const record = formDataToRecord(formData);
    record.id = 'dev_' + Math.random().toString(36).slice(2, 9);
    record.createdAt = new Date().toISOString();
    const store = getDevStore(resource);
    store.push(record);
    saveDevStore(resource, store);
    return { success: true, record };
  }

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
  if (IS_DEV) {
    await devDelay();
    const store = getDevStore(resource);
    const index = store.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Record not found');
    const existing = store[index];
    const record = formDataToRecord(formData, existing);
    record.id = id;
    record.createdAt = existing.createdAt;
    store[index] = record;
    saveDevStore(resource, store);
    return { success: true, record };
  }

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

export async function sendFiles({ to, subject, message, files }) {
  if (IS_DEV) {
    await devDelay();
    console.log('[DEV] Would email files:', { to, subject, message, files });
    return { success: true, message: 'Dev mode - email not sent' };
  }

  const formData = new FormData();
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('message', message);
  files.forEach((file) => formData.append('files[]', file));
  formData.append('password', ADMIN_PASSWORD);

  const res = await fetch('/api/send-files.php', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Network response was not ok');

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to send email');
  return data;
}

export async function deleteResource(resource, id) {
  if (IS_DEV) {
    await devDelay();
    const store = getDevStore(resource);
    const next = store.filter((item) => item.id !== id);
    saveDevStore(resource, next);
    return { success: true };
  }

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
