import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await loginUser(form);
      toast.success('Welcome back!');
      navigate('/properties');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-brand">⌂ EstateHub</div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required placeholder="you@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required placeholder="Your password"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}

export function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name:'', email:'', password:'', role:'buyer', phone:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await registerUser(form);
      toast.success('Account created! Welcome to EstateHub.');
      navigate('/properties');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-brand">⌂ EstateHub</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join thousands of buyers and sellers</p>

        {/* Role selector */}
        <div className="role-selector">
          {['buyer','seller'].map(r => (
            <button key={r} type="button"
              className={`role-opt ${form.role===r?'selected':''}`}
              onClick={() => setForm({...form, role: r})}>
              <span>{r==='buyer'?'🏠':'🏡'}</span>
              <strong>{r.charAt(0).toUpperCase()+r.slice(1)}</strong>
              <small>{r==='buyer'?'Looking to buy/rent':'Want to sell/rent'}</small>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input required placeholder="Your full name"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required placeholder="you@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" required placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Phone (Optional)</label>
              <input placeholder="+91 XXXXX XXXXX"
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
