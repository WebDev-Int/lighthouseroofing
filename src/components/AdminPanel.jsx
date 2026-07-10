import { useState } from 'react';
import { AdminResourceTab } from './AdminResourceTab.jsx';
import { ReviewsTab } from './ReviewsTab.jsx';

const employeeFields = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'middleName', label: 'Middle Name' },
  { name: 'lastName', label: 'Last Name', required: true },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'Administrator', label: 'Administrator' },
      { value: 'Office Manager', label: 'Office Manager' },
      { value: 'Sales / Estimator', label: 'Sales / Estimator' },
      { value: 'Project Manager', label: 'Project Manager' },
      { value: 'Crew Lead / Foreman', label: 'Crew Lead / Foreman' },
      { value: 'Roofer / Technician', label: 'Roofer / Technician' },
      { value: 'Accountant / Bookkeeper', label: 'Accountant / Bookkeeper' },
      { value: 'Subcontractor', label: 'Subcontractor' },
      { value: 'Other', label: 'Other' },
    ],
  },
  { name: 'dateOfEmployment', label: 'Date of Employment', type: 'date', required: true },
  { name: 'customerContractsCompleted', label: 'Customer Contracts Completed', type: 'number', required: true },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'position', label: 'Position' },
];
const employeeFile = { name: 'file', label: 'Employee Contract', required: false };

const customerContractFields = [
  { name: 'notes', label: 'Notes', type: 'textarea' },
];
const customerContractFile = { name: 'file', label: 'Customer Contract File', required: true };

const employeeContractFields = [
  { name: 'notes', label: 'Notes', type: 'textarea' },
];
const employeeContractFile = { name: 'file', label: 'Employee Document', required: true };

export function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState('reviews');

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
          description="Hub for all uploaded customer contracts and related files."
          fields={customerContractFields}
          fileField={customerContractFile}
        />
      )}
      {activeTab === 'employee-contracts' && (
        <AdminResourceTab
          resource="employee-contracts"
          title="Employee Documents"
          description="Hub for employee files such as blank W-2s, 1099s, and contracts."
          fields={employeeContractFields}
          fileField={employeeContractFile}
        />
      )}
    </div>
  );
}

