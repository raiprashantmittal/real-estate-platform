import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, updateProperty, getPropertyById } from '../services/api';
import toast from 'react-hot-toast';
import './AddProperty.css';

const EMPTY = {
  title:'', description:'', type:'apartment', listingType:'sale',
  price:'', area:'', areaUnit:'sqft', bedrooms:'', bathrooms:'',
  location:{ address:'', city:'', state:'', pincode:'' }, amenities:'',
};

export default function AddProperty() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const [form, setForm]     = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getPropertyById(id).then(r => {
        const p = r.data.data;
        setForm({ ...p, amenities: p.amenities?.join(', ') || '' });
      }).catch(() => toast.error('Failed to load property'));
    }
  }, [id]);

  const set  = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setL = (k, v) => setForm(f => ({ ...f, location: { ...f.location, [k]: v } }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price), area: Number(form.area),
        bedrooms: Number(form.bedrooms) || 0, bathrooms: Number(form.bathrooms) || 0,
        amenities: form.amenities ? form.amenities.split(',').map(a=>a.trim()).filter(Boolean) : [],
      };
      if (isEdit) { await updateProperty(id, data); toast.success('Property updated!'); }
      else        { await createProperty(data);     toast.success('Property listed!'); }
      navigate('/my-listings');
    } catch (err) { toast.error(err.response?.data?.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <h1 className="section-title">{isEdit ? 'Edit Property' : 'List a New Property'}</h1>
      <p className="section-sub">{isEdit ? 'Update your property details below' : 'Fill in all details to list your property'}</p>

      <form className="ap-form card" onSubmit={handleSubmit}>

        <div className="ap-section">
          <h3 className="ap-sec-title">📋 Basic Details</h3>
          <div className="form-group">
            <label>Property Title *</label>
            <input required placeholder="e.g. Spacious 3 BHK Apartment in Prime Location"
              value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea required rows={4} placeholder="Describe the property — features, condition, nearby facilities..."
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Property Type *</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}>
                {['apartment','house','villa','plot','commercial'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Listing Type *</label>
              <select value={form.listingType} onChange={e => set('listingType', e.target.value)}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="ap-section">
          <h3 className="ap-sec-title">💰 Price & Size</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input required type="number" min="0" placeholder="e.g. 5000000"
                value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Area *</label>
              <input required type="number" min="0" placeholder="e.g. 1200"
                value={form.area} onChange={e => set('area', e.target.value)} />
            </div>
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label>Area Unit</label>
              <select value={form.areaUnit} onChange={e => set('areaUnit', e.target.value)}>
                <option value="sqft">Sq. Feet</option>
                <option value="sqmt">Sq. Meters</option>
                <option value="acres">Acres</option>
              </select>
            </div>
            <div className="form-group">
              <label>Bedrooms</label>
              <input type="number" min="0" max="20" placeholder="e.g. 3"
                value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input type="number" min="0" max="20" placeholder="e.g. 2"
                value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="ap-section">
          <h3 className="ap-sec-title">📍 Location</h3>
          <div className="form-group">
            <label>Street Address *</label>
            <input required placeholder="House/Flat number, Street, Landmark"
              value={form.location.address} onChange={e => setL('address', e.target.value)} />
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label>City *</label>
              <input required placeholder="e.g. Indore"
                value={form.location.city} onChange={e => setL('city', e.target.value)} />
            </div>
            <div className="form-group">
              <label>State *</label>
              <input required placeholder="e.g. Madhya Pradesh"
                value={form.location.state} onChange={e => setL('state', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Pincode *</label>
              <input required placeholder="e.g. 452001"
                value={form.location.pincode} onChange={e => setL('pincode', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="ap-section">
          <h3 className="ap-sec-title">✨ Amenities</h3>
          <div className="form-group">
            <label>Amenities (comma separated)</label>
            <input placeholder="e.g. Parking, Gym, Swimming Pool, 24/7 Security, Lift"
              value={form.amenities} onChange={e => set('amenities', e.target.value)} />
          </div>
        </div>

        <div className="ap-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-gold" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? '✓ Update Property' : '✓ List Property'}
          </button>
        </div>
      </form>
    </div>
  );
}
