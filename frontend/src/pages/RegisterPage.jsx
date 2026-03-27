import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHomeRouteByRole } from '../utils/auth';
import { alertApiError } from '../utils/apiError';

function RegisterPage() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff'
  });
  const [error, setError] = useState('');

  if (user) return <Navigate to={getHomeRouteByRole(user.role)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
    } catch (err) {
      setError(alertApiError(err, 'Unable to register'));
    }
  };

  return (
    <div className="auth-container"><form className="card form-grid" onSubmit={submit}>
      <h1>Create Account</h1>
      <input type="text" placeholder="Name" required onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="staff">Staff</option>
      </select>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit">Register</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form></div>
  );
}

export default RegisterPage;

