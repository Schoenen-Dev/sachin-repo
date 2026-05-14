import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
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
    if (!form.name || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email)                                errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))     errs.email = 'Enter a valid email';
    if (!form.password)                             errs.password = 'Password is required';
    else if (form.password.length < 6)              errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm)             errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setAlert(null);
    try {
      const { data } = await api.post('/auth/signup', {
        name: form.name, email: form.email, password: form.password
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      setAlert({ type: 'success', msg: 'Account created! Redirecting...' });
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Signup failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const getStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: '#ef4444', w: '33%' };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: 'Medium', color: '#f59e0b', w: '66%' };
    return { label: 'Strong', color: '#10b981', w: '100%' };
  };
  const strength = getStrength();

  return (
    <div className="auth-wrapper">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-logo">
          <div className="logo-icon">🔐</div>
          <span>AuthApp</span>
        </div>
        <div className="auth-tagline">
          <h1>Join us today.<br />It's free.</h1>
          <p>Create your account in seconds. Your data is protected with industry-standard encryption.</p>
        </div>
        <div className="auth-features">
          {['Free to create an account', 'Passwords encrypted with bcrypt', 'Tokens expire automatically', 'Instant access after signup'].map(f => (
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
          <p className="card-title">Create account</p>
          <p className="card-subtitle">Fill in your details to get started</p>

          {alert && (
            <div className={`alert-custom ${alert.type}`}>
              <i className={`bi bi-${alert.type === 'error' ? 'exclamation-circle' : 'check-circle'}`} />
              {alert.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <i className="bi bi-person input-icon" />
                <input
                  type="text"
                  name="name"
                  className={`custom-input ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="input-error"><i className="bi bi-x-circle" />{errors.name}</p>}
            </div>

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
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPw(!showPw)}>
                  <i className={`bi bi-eye${showPw ? '-slash' : ''}`} />
                </button>
              </div>
              {errors.password && <p className="input-error"><i className="bi bi-x-circle" />{errors.password}</p>}
              {strength && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ height: 4, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: strength.w, height: '100%', background: strength.color, borderRadius: 4, transition: 'width 0.3s ease' }} />
                  </div>
                  <p style={{ fontSize: 11, color: strength.color, marginTop: 3, fontWeight: 600 }}>{strength.label} password</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <i className="bi bi-shield-check input-icon" />
                <input
                  type="password"
                  name="confirm"
                  className={`custom-input ${errors.confirm ? 'is-invalid' : ''}`}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirm && <p className="input-error"><i className="bi bi-x-circle" />{errors.confirm}</p>}
            </div>

            <button type="submit" className="btn-primary-custom" disabled={loading}>
              {loading ? <><div className="spinner" /> Creating account...</> : <><i className="bi bi-person-plus" /> Create Account</>}
            </button>
          </form>

          <div className="auth-link-row">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
