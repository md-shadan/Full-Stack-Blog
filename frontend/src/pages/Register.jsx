import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { register } from '../services/posts.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || form.password.length < 6) {
      setError('Name, email, and password (min 6) are required');
      return;
    }
    try {
      setLoading(true);
      const data = await register(form);
      storeLogin(data);
      navigate('/dashboard');
    } catch (e) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Create account</h1>
      {error && <Toast type="error" message={error} />}
      <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary w-full" type="submit" disabled={loading}>
          {loading ? <LoadingSpinner label="Creating" /> : 'Register'}
        </button>
      </form>
      <p className="text-sm text-ink/60">Already have an account? <Link className="text-ink font-semibold" to="/login">Login</Link></p>
    </div>
  );
}
