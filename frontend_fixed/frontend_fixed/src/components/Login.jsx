import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [alert, setAlert]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    if (alert) setAlert(null);
  };

  const validate = () => {
    const errs = {};
    if (!form.email)                      errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password)                   errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setAlert(null);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      setAlert({ type: 'success', msg: 'Login successful! Redirecting...' });
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Login failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-logo">
          <div className="logo-icon">🔐</div>
          <span>AuthApp</span>
        </div>
        <div className="auth-tagline">
          <h1>Secure auth,<br />beautifully built.</h1>
          <p>A production-ready authentication system with JWT tokens, encrypted passwords, and protected routes.</p>
        </div>
        <div className="auth-features">
          {['JWT-based authentication', 'Bcrypt password hashing', 'Protected API routes', 'MongoDB user storage'].map(f => (
            <div key={f} className="auth-feature-item">
              <div className="dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-card">
          <p className="card-title">Welcome back</p>
          <p className="card-subtitle">Sign in to your account to continue</p>

          {alert && (
            <div className={`alert-custom ${alert.type}`}>
              <i className={`bi bi-${alert.type === 'error' ? 'exclamation-circle' : 'check-circle'}`} />
              {alert.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrapper">
                <i className="bi bi-envelope input-icon" />
                <input
                  type="email"
                  name="email"
                  className={`custom-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="input-error"><i className="bi bi-x-circle" />{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <i className="bi bi-lock input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  className={`custom-input ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPw(!showPw)}>
                  <i className={`bi bi-eye${showPw ? '-slash' : ''}`} />
                </button>
              </div>
              {errors.password && <p className="input-error"><i className="bi bi-x-circle" />{errors.password}</p>}
            </div>

            <button type="submit" className="btn-primary-custom" disabled={loading}>
              {loading ? <><div className="spinner" /> Signing in...</> : <><i className="bi bi-box-arrow-in-right" /> Sign In</>}
            </button>
          </form>

          <div className="auth-link-row">
            Don't have an account? <Link to="/signup">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
