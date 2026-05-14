import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {
        // Token invalid — interceptor will redirect to /login
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = name =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const formatDate = dateStr =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : '—';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3, borderColor: '#dbeafe', borderTopColor: '#2563eb', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontFamily: 'Sora, sans-serif' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar-logo">
          <span>🔐</span> AuthApp
        </div>
        <div className="topbar-user">
          {user && (
            <>
              <div className="avatar">{getInitials(user.name)}</div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</span>
            </>
          )}
          <button className="btn-logout" onClick={logout}>
            <i className="bi bi-box-arrow-right" /> Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {/* Welcome banner */}
        <div className="welcome-banner">
          <div>
            <h2>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
            <p>You're securely logged in. Your session is protected with JWT.</p>
          </div>
          <div className="avatar" style={{ width: 56, height: 56, fontSize: 22, flexShrink: 0 }}>
            {getInitials(user?.name)}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>🔑</div>
            <div>
              <h4>Active</h4>
              <p>Session status</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
            <div>
              <h4>Secure</h4>
              <p>Password encrypted</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>⏱️</div>
            <div>
              <h4>7 days</h4>
              <p>Token expires in</p>
            </div>
          </div>
        </div>

        {/* Profile card */}
        <div className="profile-card">
          <h3><i className="bi bi-person-circle me-2" />Profile Details</h3>

          {[
            { label: 'Full Name',     value: user?.name },
            { label: 'Email Address', value: user?.email },
            { label: 'User ID',       value: user?._id },
            { label: 'Member Since',  value: formatDate(user?.createdAt) },
            { label: 'Account Status', value: '✅ Active' }
          ].map(({ label, value }) => (
            <div className="profile-field" key={label}>
              <label>{label}</label>
              <span style={label === 'User ID' ? { fontFamily: 'monospace', fontSize: 13, color: '#64748b' } : {}}>
                {value}
              </span>
            </div>
          ))}

          <div style={{ marginTop: 24, padding: '16px', background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="bi bi-shield-fill-check" style={{ color: '#16a34a', fontSize: 18 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#166534', margin: 0 }}>Authentication Successful</p>
              <p style={{ fontSize: 12, color: '#15803d', margin: 0 }}>Your JWT token is valid and your account is active.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
