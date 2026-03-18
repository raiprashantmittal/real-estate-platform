import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, LogOut, PlusCircle, List, Calendar, Users } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = (path) => pathname === path ? 'active' : '';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⌂</span>
          <span>EstateHub</span>
        </Link>

        <div className="navbar-links">
          <Link to="/properties" className={`nav-link ${active('/properties')}`}>
            <Home size={15} /> Browse
          </Link>
          {user?.role === 'seller' && <>
            <Link to="/my-listings"  className={`nav-link ${active('/my-listings')}`}><List size={15} /> My Listings</Link>
            <Link to="/add-property" className={`nav-link nav-gold ${active('/add-property')}`}><PlusCircle size={15} /> Add Property</Link>
          </>}
          {user && <Link to="/bookings" className={`nav-link ${active('/bookings')}`}><Calendar size={15} /> Bookings</Link>}
          {user?.role === 'admin' && <Link to="/admin" className={`nav-link ${active('/admin')}`}><Users size={15} /> Admin</Link>}
        </div>

        <div className="navbar-right">
          {user ? (
            <div className="user-area">
              <Link to="/profile" className="user-chip">
                <span className="user-av">{user.name[0].toUpperCase()}</span>
                <span className="user-nm">{user.name.split(' ')[0]}</span>
                <span className={`role-pill role-${user.role}`}>{user.role}</span>
              </Link>
              <button className="btn btn-ghost icon-btn" onClick={handleLogout} title="Logout">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login"    className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
