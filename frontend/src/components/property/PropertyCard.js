import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import './PropertyCard.css';

const TYPE_ICON = { apartment:'🏢', house:'🏠', villa:'🏡', plot:'🌿', commercial:'🏗️' };

const formatPrice = (p) => {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Cr`;
  if (p >= 100000)   return `₹${(p/100000).toFixed(2)} L`;
  return `₹${p.toLocaleString('en-IN')}`;
};

export default function PropertyCard({ property }) {
  const { _id, title, type, listingType, price, area, areaUnit, bedrooms, bathrooms, location, status } = property;
  return (
    <Link to={`/properties/${_id}`} className="prop-card card fade-in">
      <div className="prop-img">
        <span className="prop-emoji">{TYPE_ICON[type] || '🏠'}</span>
        <div className="prop-badges">
          <span className={`badge badge-${listingType}`}>{listingType === 'sale' ? 'For Sale' : 'For Rent'}</span>
          <span className={`badge badge-${status}`}>{status}</span>
        </div>
      </div>
      <div className="prop-body">
        <p className="prop-type">{type.charAt(0).toUpperCase()+type.slice(1)}</p>
        <h3 className="prop-title">{title}</h3>
        <p className="prop-loc"><MapPin size={12} />{location.city}, {location.state}</p>
        <div className="prop-stats">
          {bedrooms  > 0 && <span><Bed size={13} />{bedrooms} BHK</span>}
          {bathrooms > 0 && <span><Bath size={13} />{bathrooms} Bath</span>}
          <span><Maximize2 size={13} />{area} {areaUnit}</span>
        </div>
        <div className="prop-footer">
          <span className="prop-price">{formatPrice(price)}{listingType==='rent'&&<small>/mo</small>}</span>
          <span className="prop-cta">View →</span>
        </div>
      </div>
    </Link>
  );
}
