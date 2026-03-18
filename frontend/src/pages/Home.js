import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Shield, Star, TrendingUp, Phone } from 'lucide-react';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ city: '', listingType: '', type: '' });

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search.city)        p.set('city', search.city);
    if (search.listingType) p.set('listingType', search.listingType);
    if (search.type)        p.set('type', search.type);
    navigate(`/properties?${p.toString()}`);
  };

  const features = [
    { icon: <Search size={26} />, title: 'Smart Search', desc: 'Filter by city, price range, property type, and bedrooms to find exactly what you need.' },
    { icon: <Shield size={26} />, title: 'Verified Listings', desc: 'Every property is reviewed before publishing. Buy or rent with complete confidence.' },
    { icon: <TrendingUp size={26} />, title: 'Best Market Prices', desc: 'Compare prices across India\'s top cities and make informed real estate decisions.' },
    { icon: <Phone size={26} />, title: 'Direct Owner Contact', desc: 'Book a site visit and connect directly with property owners — no middlemen.' },
  ];

  const cities = ['Indore','Mumbai','Pune','Jaipur','Bengaluru','Hyderabad','Delhi','Chennai'];

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-content fade-in">
          <span className="hero-eyebrow">India's Premium Real Estate Platform</span>
          <h1 className="hero-title">
            Find Your<br /><em>Dream Home</em>
          </h1>
          <p className="hero-desc">
            Discover apartments, villas, houses and plots across India's top cities.
            Buy, sell or rent — all in one place.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hs-field">
              <MapPin size={16} className="hs-icon" />
              <input
                placeholder="Enter city (e.g. Indore, Mumbai...)"
                value={search.city}
                onChange={e => setSearch({...search, city: e.target.value})}
              />
            </div>
            <div className="hs-sep" />
            <select value={search.listingType} onChange={e => setSearch({...search, listingType: e.target.value})}>
              <option value="">Buy or Rent?</option>
              <option value="sale">Buy</option>
              <option value="rent">Rent</option>
            </select>
            <div className="hs-sep" />
            <select value={search.type} onChange={e => setSearch({...search, type: e.target.value})}>
              <option value="">Property Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
            <button type="submit" className="btn btn-gold hs-btn">
              <Search size={16} /> Search
            </button>
          </form>

          <div className="popular-cities">
            <span>Popular:</span>
            {cities.map(c => (
              <button key={c} className="city-chip"
                onClick={() => navigate(`/properties?city=${c}`)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-cards fade-in">
          {[
            { icon:'🏡', title:'3 BHK Villa', loc:'Indore, MP', price:'₹85L', type:'sale' },
            { icon:'🏢', title:'2 BHK Apartment', loc:'Mumbai, MH', price:'₹1.2Cr', type:'sale' },
            { icon:'🏠', title:'4 BHK House', loc:'Jaipur, RJ', price:'₹18K/mo', type:'rent' },
          ].map((c,i) => (
            <div key={i} className={`hero-card hc-${i+1}`}>
              <span className="hc-icon">{c.icon}</span>
              <div className="hc-info">
                <strong>{c.title}</strong>
                <small>{c.loc}</small>
              </div>
              <div className="hc-right">
                <span className="hc-price">{c.price}</span>
                <span className={`badge badge-${c.type}`} style={{fontSize:'10px'}}>{c.type==='sale'?'Sale':'Rent'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="stats-strip">
        {[['500+','Properties Listed'],['50+','Cities Covered'],['1,000+','Happy Clients'],['100%','Verified Sellers']].map(([n,l],i) => (
          <div key={i} className="stat-item">
            <strong>{n}</strong>
            <span>{l}</span>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className="features-sec page">
        <h2 className="section-title" style={{textAlign:'center'}}>Why Choose EstateHub?</h2>
        <p className="section-sub" style={{textAlign:'center', marginBottom:'40px'}}>Everything you need to buy, sell or rent property in India</p>
        <div className="features-grid">
          {features.map((f,i) => (
            <div key={i} className="feat-card card">
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROPERTY TYPES ── */}
      <section className="types-sec page" style={{paddingTop:0}}>
        <h2 className="section-title">Browse by Type</h2>
        <p className="section-sub">Find the property that fits your lifestyle</p>
        <div className="types-grid">
          {[
            {icon:'🏢',label:'Apartment',type:'apartment'},
            {icon:'🏠',label:'House',type:'house'},
            {icon:'🏡',label:'Villa',type:'villa'},
            {icon:'🌿',label:'Plot',type:'plot'},
            {icon:'🏗️',label:'Commercial',type:'commercial'},
          ].map((t) => (
            <button key={t.type} className="type-tile" onClick={() => navigate(`/properties?type=${t.type}`)}>
              <span className="type-icon">{t.icon}</span>
              <span className="type-label">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-sec">
        <div className="cta-inner">
          <h2>Ready to List Your Property?</h2>
          <p>Join thousands of sellers who found the right buyers on EstateHub.</p>
          <div className="cta-btns">
            <button className="btn btn-gold" onClick={() => navigate('/register')}>Get Started Free</button>
            <button className="btn btn-outline cta-outline" onClick={() => navigate('/properties')}>Browse Properties</button>
          </div>
        </div>
      </section>

    </div>
  );
}
