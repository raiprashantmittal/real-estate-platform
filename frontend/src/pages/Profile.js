import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
      // update localStorage
      const updated = { ...user, name: form.name, phone: form.phone };
      localStorage.setItem('user', JSON.stringify(updated));
      setEditing(false);
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); toast.success('Logged out'); };

  return (
    <div className="page profile-page">
      <h1 className="section-title">My Profile</h1>
      <p className="section-sub">Manage your account details</p>

      <div className="profile-layout">
        {/* Avatar card */}
        <div className="profile-sidebar">
          <div className="profile-av-card card">
            <div className="profile-av">{user?.name?.[0]?.toUpperCase()}</div>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <span className={`role-pill role-${user?.role}`} style={{marginTop:'8px',display:'inline-block'}}>
              {user?.role}
            </span>
          </div>

          <div className="profile-stats card">
            <div className="ps-item">
              <Shield size={18} style={{color:'var(--gold)'}}/>
              <div>
                <strong>Account Status</strong>
                <span style={{color:'var(--green)'}}>● Active</span>
              </div>
            </div>
            <div className="divider" style={{margin:'12px 0'}}/>
            <button className="btn btn-ghost logout-full" onClick={handleLogout}>
              <LogOut size={15}/> Sign Out
            </button>
          </div>
        </div>

        {/* Edit form */}
        <div className="profile-main">
          <div className="card profile-form-card">
            <div className="pf-header">
              <h3>Personal Information</h3>
              {!editing && (
                <button className="btn btn-ghost" style={{padding:'8px 16px',fontSize:'13px'}} onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input value={user?.email} disabled style={{background:'var(--cream)',cursor:'not-allowed'}} />
                  <small style={{fontSize:'12px',color:'var(--slate)'}}>Email cannot be changed</small>
                </div>
                <div style={{display:'flex',gap:'12px',marginTop:'8px'}}>
                  <button type="submit" className="btn btn-gold" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="profile-info-list">
                <div className="pi-item">
                  <User size={16} style={{color:'var(--gold)'}}/>
                  <div>
                    <span>Full Name</span>
                    <strong>{user?.name}</strong>
                  </div>
                </div>
                <div className="pi-item">
                  <Mail size={16} style={{color:'var(--gold)'}}/>
                  <div>
                    <span>Email Address</span>
                    <strong>{user?.email}</strong>
                  </div>
                </div>
                <div className="pi-item">
                  <Phone size={16} style={{color:'var(--gold)'}}/>
                  <div>
                    <span>Phone Number</span>
                    <strong>{user?.phone || 'Not provided'}</strong>
                  </div>
                </div>
                <div className="pi-item">
                  <Shield size={16} style={{color:'var(--gold)'}}/>
                  <div>
                    <span>Account Role</span>
                    <strong style={{textTransform:'capitalize'}}>{user?.role}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="card quick-links-card">
            <h3>Quick Links</h3>
            <div className="ql-grid">
              {user?.role === 'seller' && (
                <>
                  <button className="ql-btn" onClick={() => navigate('/my-listings')}>🏠 My Listings</button>
                  <button className="ql-btn" onClick={() => navigate('/add-property')}>➕ Add Property</button>
                </>
              )}
              {user?.role === 'buyer' && (
                <button className="ql-btn" onClick={() => navigate('/properties')}>🔍 Browse Properties</button>
              )}
              <button className="ql-btn" onClick={() => navigate('/bookings')}>📅 My Bookings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
