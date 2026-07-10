import { useState, useMemo } from 'react';
import { useAdminResource } from '../hooks/useAdminResource.js';
import { sendFiles } from '../services/adminDataService.js';
import { PhoneInput } from './PhoneInput.jsx';

export function AdminResourceTab({ resource, title, description, fields, fileField, selectOptions = {} }) {
  const { items, loading, error, create, update, delete: remove } = useAdminResource(resource);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const [emailingId, setEmailingId] = useState(null);
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', message: '' });
  const [emailStatus, setEmailStatus] = useState('');

  const emptyForm = useMemo(() => {
    const obj = {};
    fields.forEach((field) => {
      obj[field.name] = field.type === 'number' ? 0 : '';
    });
    return obj;
  }, [fields]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setFile(null);
    setStatus('');
  };

  const startEdit = (item) => {
    const next = {};
    fields.forEach((field) => {
      next[field.name] = item[field.name] ?? (field.type === 'number' ? 0 : '');
    });
    setFormData(next);
    setEditingId(item.id);
    setFile(null);
    setStatus('');
  };

  const handleChange = (e, field) => {
    const value = field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData((prev) => ({ ...prev, [field.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');

    const data = new FormData();
    fields.forEach((field) => {
      data.append(field.name, formData[field.name] ?? '');
    });
    if (file) {
      data.append(fileField.name, file);
    }
    if (editingId) {
      const existing = items.find((item) => item.id === editingId);
      if (existing && existing.file) {
        data.append('existingFile', existing.file);
      }
    }

    try {
      if (editingId) {
        await update(editingId, data);
        setStatus('Updated successfully.');
      } else {
        await create(data);
        setStatus('Created successfully.');
      }
      resetForm();
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await remove(id);
      setStatus('Deleted successfully.');
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + err.message);
    }
  };

  const startEmail = (item) => {
    setEmailingId(item.id);
    setEmailForm({
      to: '',
      subject: `${title} document`,
      message: 'Please find the attached document.',
    });
    setEmailStatus('');
  };

  const cancelEmail = () => {
    setEmailingId(null);
    setEmailStatus('');
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = async (e, item) => {
    e.preventDefault();
    if (!item.file) return;
    setEmailStatus('Sending...');
    try {
      await sendFiles({ ...emailForm, files: [item.file] });
      setEmailStatus('Sent successfully.');
    } catch (err) {
      console.error(err);
      setEmailStatus('Error: ' + err.message);
    }
  };

  const getOptions = (field) => {
    if (selectOptions[field.name]) return selectOptions[field.name];
    return field.options || [];
  };

  if (loading) return <p className="lede">Loading {title.toLowerCase()}...</p>;
  if (error) return <p className="lede">Could not load {title.toLowerCase()}.</p>;

  return (
    <div>
      <div className="section-heading">
        <p className="eyebrow">Manage</p>
        <h2>{title}</h2>
        {description && <p className="lede">{description}</p>}
      </div>

      <div className="cards admin-cards" aria-live="polite">
        {items.length === 0 ? (
          <p className="lede">No records yet.</p>
        ) : (
          items.map((item) => (
            <article className="card" key={item.id}>
              {fields.map((field) => (
                <div key={field.name} style={{ marginBottom: 6 }}>
                  <strong>{field.label}:</strong>{' '}
                  {field.name === fileField?.name || item[field.name] === item.file ? (
                    item.file ? (
                      <a href={item.file} target="_blank" rel="noreferrer">
                        View file
                      </a>
                    ) : (
                      'No file'
                    )
                  ) : (
                    item[field.name] ?? ''
                  )}
                </div>
              ))}
              {item.file && fileField && (
                <div style={{ marginBottom: 6 }}>
                  <strong>{fileField.label}:</strong>{' '}
                  <a href={item.file} target="_blank" rel="noreferrer">
                    View file
                  </a>
                </div>
              )}
              <div className="review-actions">
                <button className="btn approve" onClick={() => startEdit(item)}>
                  Edit
                </button>
                {item.file && (
                  <button className="btn ghost" onClick={() => startEmail(item)}>
                    Email
                  </button>
                )}
                <button className="btn delete" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
              {emailingId === item.id && (
                <form className="admin-form" onSubmit={(e) => handleSendEmail(e, item)} style={{ marginTop: 12 }}>
                  <label>
                    Recipient email
                    <input
                      type="email"
                      name="to"
                      value={emailForm.to}
                      onChange={handleEmailChange}
                      required
                      placeholder="client@example.com"
                    />
                  </label>
                  <label>
                    Subject
                    <input
                      type="text"
                      name="subject"
                      value={emailForm.subject}
                      onChange={handleEmailChange}
                      required
                    />
                  </label>
                  <label>
                    Message
                    <textarea
                      name="message"
                      value={emailForm.message}
                      onChange={handleEmailChange}
                      rows={3}
                    />
                  </label>
                  <div className="review-actions">
                    <button type="submit" className="btn solid">
                      Send
                    </button>
                    <button type="button" className="btn ghost" onClick={cancelEmail}>
                      Cancel
                    </button>
                  </div>
                  <p className="form-note" role="status">
                    {emailStatus}
                  </p>
                </form>
              )}
            </article>
          ))
        )}
      </div>

      <div className="card" style={{ marginTop: 32 }}>
        <p className="eyebrow">{editingId ? 'Edit record' : 'Add new record'}</p>
        <h3>{editingId ? 'Edit' : 'Add'} {title}</h3>
        <form className="admin-form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}
              {field.type === 'select' ? (
                <select
                  value={formData[field.name] ?? ''}
                  onChange={(e) => handleChange(e, field)}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {getOptions(field).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] ?? ''}
                  onChange={(e) => handleChange(e, field)}
                  rows={3}
                  required={field.required}
                />
              ) : field.type === 'tel' ? (
                <PhoneInput
                  name={field.name}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => handleChange(e, field)}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => handleChange(e, field)}
                  required={field.required}
                />
              )}
            </label>
          ))}
          {fileField && (
            <label>
              {fileField.label} {editingId && '(leave blank to keep existing)'}
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0] || null)}
                required={!editingId && fileField.required}
              />
            </label>
          )}
          <div className="review-actions">
            <button type="submit" className="btn solid">
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button type="button" className="btn ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
          <p className="form-note" role="status">
            {status}
          </p>
        </form>
      </div>
    </div>
  );
}
