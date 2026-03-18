import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, updateBookingStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, MapPin, User, Clock, CheckCircle, XCircle, Flag } from 'lucide-react';
import './Bookings.css';

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    getMyBookings()
      .then(r => setBookings(r.data.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    try {
      await updateBookingStatus(id, { status });
      toast.success(`Booking ${label.toLowerCase()}`);
      setBookings(b => b.map(bk => bk._id === id ? { ...bk, status } : bk));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
  };

  const isSeller = user?.role === 'seller' || user?.role === 'admin';

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1; return acc;
  }, {});

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div className="page">
      <h1 className="section-title">{isSeller ? 'Visit Requests' : 'My Bookings'}</h1>
      <p className="section-sub" style={{marginBottom:'24px'}}>
        {bookings.length} total {isSeller ? 'requests received' : 'bookings made'}
      </p>

      {/* Filter tabs */}
      <div className="booking-tabs">
        {['all','pending','confirmed','completed','cancelled'].map(s => (
          <button key={s} className={`tab-btn ${filter===s?'active':''}`} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase()+s.slice(1)}
            {s !== 'all' && counts[s] ? <span className="tab-count">{counts[s]}</span> : null}
            {s === 'all' && bookings.length ? <span className="tab-count">{bookings.length}</span> : null}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{fontSize:'52px'}}>📅</span>
          <h3>No Bookings Here</h3>
          <p>{isSeller ? 'No visit requests in this category yet.' : 'You have no bookings in this category.'}</p>
          {!isSeller && (
            <Link to="/properties" className="btn btn-primary" style={{marginTop:'24px',display:'inline-flex'}}>
              Browse Properties
            </Link>
          )}
        </div>
      ) : (
        <div className="bookings-list">
          {filtered.map(b => (
            <div key={b._id} className="booking-card card">
              <div className="bk-top">
                <div className="bk-property">
                  <span className="bk-property-icon">🏠</span>
                  <div>
                    <Link to={`/properties/${b.property?._id}`} className="bk-prop-title">
                      {b.property?.title || 'Property'}
                    </Link>
                    <p className="bk-prop-loc">
                      <MapPin size={12}/> {b.property?.location?.city}, {b.property?.location?.state}
                    </p>
                  </div>
                </div>
                <span className={`badge badge-${b.status}`}>{b.status}</span>
              </div>

              <div className="bk-details">
                <div className="bk-detail-item">
                  <Calendar size={14}/>
                  <span>{new Date(b.visitDate).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}</span>
                </div>
                <div className="bk-detail-item">
                  <Clock size={14}/>
                  <span>{b.visitTime}</span>
                </div>
                <div className="bk-detail-item">
                  <User size={14}/>
                  <span>{isSeller ? `Buyer: ${b.buyer?.name}` : `Seller: ${b.seller?.name}`}</span>
                </div>
              </div>

              {b.message && (
                <div className="bk-message">
                  <p>"{b.message}"</p>
                </div>
              )}

              {b.cancelReason && (
                <div className="bk-cancel-reason">
                  <span>Cancel reason: {b.cancelReason}</span>
                </div>
              )}

              {/* Actions */}
              {b.status === 'pending' && (
                <div className="bk-actions">
                  {isSeller && (
                    <button className="btn btn-gold bk-btn" onClick={() => handleStatus(b._id, 'confirmed')}>
                      <CheckCircle size={14}/> Confirm Visit
                    </button>
                  )}
                  <button className="btn btn-ghost bk-btn" onClick={() => {
                    const reason = window.prompt('Reason for cancellation (optional):');
                    handleStatus(b._id, 'cancelled');
                  }}>
                    <XCircle size={14}/> Cancel
                  </button>
                </div>
              )}

              {b.status === 'confirmed' && isSeller && (
                <div className="bk-actions">
                  <button className="btn btn-primary bk-btn" onClick={() => handleStatus(b._id, 'completed')}>
                    <Flag size={14}/> Mark as Completed
                  </button>
                  <button className="btn btn-ghost bk-btn" onClick={() => handleStatus(b._id, 'cancelled')}>
                    <XCircle size={14}/> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
