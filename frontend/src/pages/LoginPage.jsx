import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHomeRouteByRole } from '../utils/auth';
import { alertApiError } from '../utils/apiError';

function LoginPage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  if (user) return <Navigate to={getHomeRouteByRole(user.role)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try { await login(form); } catch (err) { setError(alertApiError(err, 'Unable to login')); }
  };

  return (
    <div className="auth-container"><form className="card" onSubmit={submit}>
      <h1>Inventory Login</h1>
      <input type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error ? <p className="error">{error}</p> : null}
      <button type="submit">Login</button>
      <p>New user? <Link to="/register">Create account</Link></p>
    </form></div>
  );
}

export default LoginPage;
