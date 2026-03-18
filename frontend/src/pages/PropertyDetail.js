import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPropertyById, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Bed, Bath, Maximize2, Calendar, ArrowLeft, Phone, Mail } from 'lucide-react';
import './PropertyDetail.css';

const TYPE_ICON = { apartment:'🏢', house:'🏠', villa:'🏡', plot:'🌿', commercial:'🏗️' };
const formatPrice = (p) => {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Cr`;
  if (p >= 100000)   return `₹${(p/100000).toFixed(2)} L`;
  return `₹${p.toLocaleString('en-IN')}`;
};

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [booking, setBooking]   = useState({ visitDate:'', visitTime:'', message:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPropertyById(id)
      .then(r => setProperty(r.data.data))
      .catch(() => toast.error('Property not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user)             { toast.error('Please login to book a visit'); navigate('/login'); return; }
    if (user.role !== 'buyer') { toast.error('Only buyers can book visits'); return; }
    setSubmitting(true);
    try {
      await createBooking({ propertyId: id, ...booking });
      toast.success('Visit request submitted! The seller will confirm shortly.');
      setBooking({ visitDate:'', visitTime:'', message:'' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit booking');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;
  if (!property) return (
    <div className="page">
      <div className="empty-state">
        <span style={{fontSize:'52px'}}>🏚️</span>
        <h3>Property Not Found</h3>
        <Link to="/properties" className="btn btn-primary" style={{marginTop:'20px'}}>Back to Listings</Link>
      </div>
    </div>
  );

  const { title, type, listingType, price, area, areaUnit, bedrooms, bathrooms, description, location, amenities, owner, status } = property;

  return (
    <div className="page pd-page fade-in">
      {/* Back */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={15}/> Back to Listings
      </button>

      {/* Header */}
      <div className="pd-header">
        <div className="pd-header-left">
          <p className="pd-type-label">{type.charAt(0).toUpperCase()+type.slice(1)}</p>
          <h1 className="pd-title">{title}</h1>
          <p className="pd-loc"><MapPin size={14}/> {location.address}, {location.city}, {location.state} — {location.pincode}</p>
          <div className="pd-badges">
            <span className={`badge badge-${listingType}`}>{listingType==='sale'?'For Sale':'For Rent'}</span>
            <span className={`badge badge-${status}`}>{status}</span>
          </div>
        </div>
        <div className="pd-price-box">
          <p className="pd-price">{formatPrice(price)}{listingType==='rent'&&<small>/mo</small>}</p>
        </div>
      </div>

      {/* Image */}
      <div className="pd-image">
        <span>{TYPE_ICON[type]||'🏠'}</span>
      </div>

      <div className="pd-layout">
        <div className="pd-main">

          {/* Key stats */}
          <div className="pd-stats card">
            {bedrooms  > 0 && <div className="pds-item"><Bed size={22}/><strong>{bedrooms}</strong><span>Bedrooms</span></div>}
            {bathrooms > 0 && <div className="pds-item"><Bath size={22}/><strong>{bathrooms}</strong><span>Bathrooms</span></div>}
            <div className="pds-item"><Maximize2 size={22}/><strong>{area} {areaUnit}</strong><span>Total Area</span></div>
          </div>

          {/* Description */}
          <div className="pd-section card">
            <h3>About This Property</h3>
            <p>{description}</p>
          </div>

          {/* Amenities */}
          {amenities?.length > 0 && (
            <div className="pd-section card">
              <h3>Amenities</h3>
              <div className="amenities-wrap">
                {amenities.map((a,i) => <span key={i} className="am-tag">✓ {a}</span>)}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="pd-section card">
            <h3>Location Details</h3>
            <div className="loc-grid">
              <div className="loc-item"><span>Address</span><strong>{location.address}</strong></div>
              <div className="loc-item"><span>City</span><strong>{location.city}</strong></div>
              <div className="loc-item"><span>State</span><strong>{location.state}</strong></div>
              <div className="loc-item"><span>Pincode</span><strong>{location.pincode}</strong></div>
            </div>
          </div>

          {/* Owner */}
          <div className="pd-section card">
            <h3>Listed By</h3>
            <div className="owner-row">
              <div className="owner-av">{owner?.name?.[0]?.toUpperCase()}</div>
              <div className="owner-info">
                <strong>{owner?.name}</strong>
                <p><Mail size={13}/> {owner?.email}</p>
                {owner?.phone && <p><Phone size={13}/> {owner?.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <aside className="booking-card card">
          <h3><Calendar size={18}/> Book a Site Visit</h3>
          <p className="booking-sub">Schedule a visit and connect with the owner directly.</p>

          {status !== 'available' ? (
            <div className="not-avail">
              <span style={{fontSize:'32px'}}>🔒</span>
              <p>This property is currently <strong>{status}</strong> and not accepting bookings.</p>
            </div>
          ) : (
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Visit Date</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]}
                  value={booking.visitDate} onChange={e => setBooking({...booking, visitDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Preferred Time</label>
                <select required value={booking.visitTime} onChange={e => setBooking({...booking, visitTime: e.target.value})}>
                  <option value="">Select a time slot</option>
                  {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea rows={3} placeholder="Any specific questions or requirements..."
                  value={booking.message} onChange={e => setBooking({...booking, message: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-gold" style={{width:'100%',justifyContent:'center'}} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Request Visit'}
              </button>
              {!user && (
                <p className="login-hint">
                  <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to book a visit
                </p>
              )}
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
