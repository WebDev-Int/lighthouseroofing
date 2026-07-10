import { useState } from 'react';
import { useAdminResource } from '../hooks/useAdminResource.js';
import { AdminResourceTab } from './AdminResourceTab.jsx';
import { ReviewsTab } from './ReviewsTab.jsx';

const employeeFields = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'middleName', label: 'Middle Name' },
  { name: 'lastName', label: 'Last Name', required: true },
  { name: 'dateOfEmployment', label: 'Date of Employment', type: 'date', required: true },
  { name: 'customerContractsCompleted', label: 'Customer Contracts Completed', type: 'number', required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'position', label: 'Position' },
];
const employeeFile = { name: 'file', label: 'Employee Contract', required: false };

const customerContractFields = [
  { name: 'customerName', label: 'Customer Name', required: true },
  { name: 'address', label: 'Address' },
  { name: 'service', label: 'Service', required: true },
  { name: 'contractDate', label: 'Contract Date', type: 'date', required: true },
  { name: 'contractAmount', label: 'Contract Amount', type: 'number' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'Pending', label: 'Pending' },
      { value: 'Active', label: 'Active' },
      { value: 'Completed', label: 'Completed' },
      { value: 'Cancelled', label: 'Cancelled' },
    ],
  },
  { name: 'employeeId', label: 'Assigned Employee', type: 'select' },
  { name: 'notes', label: 'Notes', type: 'textarea' },
];
const customerContractFile = { name: 'file', label: 'Customer Contract File', required: false };

const employeeContractFields = [
  { name: 'employeeId', label: 'Employee', type: 'select', required: true },
  { name: 'contractDate', label: 'Contract Date', type: 'date', required: true },
  { name: 'notes', label: 'Notes', type: 'textarea' },
];
const employeeContractFile = { name: 'file', label: 'Signed Employee Contract', required: true };

export function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState('reviews');
  const { items: employees } = useAdminResource('employees');

  const employeeOptions = employees.map((e) => ({
    value: e.id,
    label: `${e.firstName} ${e.lastName}`,
  }));

  const tabs = [
    { id: 'reviews', label: 'Reviews' },
    { id: 'employees', label: 'Employees' },
    { id: 'customer-contracts', label: 'Customer Contracts' },
    { id: 'employee-contracts', label: 'Employee Contracts' },
  ];

  return (
    <div id="admin-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? 'solid' : 'ghost'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button id="logout-btn" className="btn ghost" onClick={onLogout}>
          Logout
        </button>
      </div>

      {activeTab === 'reviews' && <ReviewsTab />}
      {activeTab === 'employees' && (
        <AdminResourceTab
          resource="employees"
          title="Employees"
          description="Manage employees, assign them to contracts, and upload their employment contracts."
          fields={employeeFields}
          fileField={employeeFile}
        />
      )}
      {activeTab === 'customer-contracts' && (
        <AdminResourceTab
          resource="customer-contracts"
          title="Customer Contracts"
          description="Track customer projects, contracts, and assigned employees."
          fields={customerContractFields}
          fileField={customerContractFile}
          selectOptions={{ employeeId: employeeOptions }}
        />
      )}
      {activeTab === 'employee-contracts' && (
        <AdminResourceTab
          resource="employee-contracts"
          title="Employee Contracts"
          description="Upload and manage signed employment contracts for each employee."
          fields={employeeContractFields}
          fileField={employeeContractFile}
          selectOptions={{ employeeId: employeeOptions }}
        />
      )}
    </div>
  );
}

