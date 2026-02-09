import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { login } from '../services/posts.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    try {
      setLoading(true);
      const data = await login(form);
      storeLogin(data);
      navigate('/dashboard');
    } catch (e) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      {error && <Toast type="error" message={error} />}
      <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary w-full" type="submit" disabled={loading}>
          {loading ? <LoadingSpinner label="Signing in" /> : 'Login'}
        </button>
      </form>
      <p className="text-sm text-ink/60">No account? <Link className="text-ink font-semibold" to="/register">Register</Link></p>
    </div>
  );
}
