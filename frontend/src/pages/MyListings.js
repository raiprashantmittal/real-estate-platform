import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyListings, deleteProperty } from '../services/api';
import toast from 'react-hot-toast';
import { PlusCircle, Edit2, Trash2, MapPin, Eye } from 'lucide-react';
import './MyListings.css';

const TYPE_ICON = { apartment:'🏢', house:'🏠', villa:'🏡', plot:'🌿', commercial:'🏗️' };

const formatPrice = (p) => {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(1)}Cr`;
  if (p >= 100000)   return `₹${(p/100000).toFixed(1)}L`;
  return `₹${p.toLocaleString('en-IN')}`;
};

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyListings()
      .then(r => setListings(r.data.data))
      .catch(() => toast.error('Failed to load listings'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Remove "${title}" from listings?`)) return;
    try {
      await deleteProperty(id);
      toast.success('Property removed');
      setListings(l => l.filter(p => p._id !== id));
    } catch { toast.error('Failed to remove property'); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div className="page">
      <div className="ml-header">
        <div>
          <h1 className="section-title">My Listings</h1>
          <p className="section-sub" style={{marginBottom:0}}>
            {listings.length} {listings.length === 1 ? 'property' : 'properties'} listed
          </p>
        </div>
        <Link to="/add-property" className="btn btn-gold">
          <PlusCircle size={16}/> Add New Property
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="empty-state">
          <span style={{fontSize:'56px'}}>🏠</span>
          <h3>No Listings Yet</h3>
          <p>Start by adding your first property. It only takes a few minutes.</p>
          <Link to="/add-property" className="btn btn-primary" style={{marginTop:'24px', display:'inline-flex'}}>
            <PlusCircle size={15}/> List Your First Property
          </Link>
        </div>
      ) : (
        <div className="ml-list">
          {listings.map(p => (
            <div key={p._id} className="ml-row card">
              <div className="ml-icon">{TYPE_ICON[p.type] || '🏠'}</div>

              <div className="ml-info">
                <div className="ml-info-top">
                  <h3 className="ml-title">{p.title}</h3>
                  <div className="ml-badges">
                    <span className={`badge badge-${p.status}`}>{p.status}</span>
                    <span className={`badge badge-${p.listingType}`}>{p.listingType === 'sale' ? 'Sale' : 'Rent'}</span>
                  </div>
                </div>
                <p className="ml-loc">
                  <MapPin size={12}/> {p.location.address}, {p.location.city}, {p.location.state}
                </p>
                <div className="ml-meta">
                  <span>{p.type.charAt(0).toUpperCase()+p.type.slice(1)}</span>
                  {p.bedrooms > 0 && <span>· {p.bedrooms} BHK</span>}
                  <span>· {p.area} {p.areaUnit}</span>
                </div>
              </div>

              <div className="ml-price">
                <strong>{formatPrice(p.price)}</strong>
                {p.listingType === 'rent' && <small>/mo</small>}
              </div>

              <div className="ml-actions">
                <button className="action-btn view-act" title="View" onClick={() => navigate(`/properties/${p._id}`)}>
                  <Eye size={15}/>
                </button>
                <button className="action-btn edit-act" title="Edit" onClick={() => navigate(`/edit-property/${p._id}`)}>
                  <Edit2 size={15}/>
                </button>
                <button className="action-btn del-act" title="Remove" onClick={() => handleDelete(p._id, p.title)}>
                  <Trash2 size={15}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
