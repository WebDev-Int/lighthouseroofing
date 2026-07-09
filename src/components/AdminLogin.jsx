import { useState } from 'react';

export function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin(password)) {
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div id="login-section" className="card">
      <p className="eyebrow">Enter admin password</p>
      <h3>Login to manage reviews</h3>
      <form id="login-form" onSubmit={handleSubmit}>
        <label>
          Password
          <input
            type="password"
            id="admin-password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="btn solid">Login</button>
        <p className="form-note" style={{ color: '#ef4444' }} role="status">
          {error}
        </p>
      </form>
    </div>
  );
}
