import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import './Properties.css';

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [pages, setPages]           = useState(1);
  const [filters, setFilters]       = useState({
    city:        searchParams.get('city')        || '',
    type:        searchParams.get('type')        || '',
    listingType: searchParams.get('listingType') || '',
    minPrice: '', maxPrice: '', bedrooms: '',
  });

  const fetchProperties = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 9 };
      Object.entries(filters).forEach(([k,v]) => { if (v) params[k] = v; });
      const res = await getProperties(params);
      setProperties(res.data.data);
      setTotal(res.data.total);
      setPages(res.data.pages);
      setPage(p);
    } catch { setProperties([]); }
    finally   { setLoading(false); }
  };

  useEffect(() => { fetchProperties(1); }, []);

  const handleFilter = (e) => { e.preventDefault(); fetchProperties(1); };
  const clearFilters = () => {
    setFilters({ city:'', type:'', listingType:'', minPrice:'', maxPrice:'', bedrooms:'' });
  };

  return (
    <div className="page">
      <div className="props-header">
        <div>
          <h1 className="section-title">Browse Properties</h1>
          <p className="section-sub" style={{marginBottom:0}}>{total} properties found</p>
        </div>
      </div>

      <div className="props-layout">
        {/* Sidebar */}
        <aside className="filters-panel card">
          <div className="fp-head">
            <span style={{display:'flex',alignItems:'center',gap:'8px',fontWeight:600,color:'var(--brown)'}}><SlidersHorizontal size={15}/> Filters</span>
            <button className="clear-btn" onClick={clearFilters}><X size={13}/> Clear</button>
          </div>
          <form onSubmit={handleFilter}>
            <div className="form-group">
              <label>City</label>
              <input placeholder="e.g. Indore" value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Listing Type</label>
              <select value={filters.listingType} onChange={e => setFilters({...filters, listingType: e.target.value})}>
                <option value="">All</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Property Type</label>
              <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="form-group">
              <label>Min Price (₹)</label>
              <input type="number" placeholder="0" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Max Price (₹)</label>
              <input type="number" placeholder="No limit" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Bedrooms</label>
              <select value={filters.bedrooms} onChange={e => setFilters({...filters, bedrooms: e.target.value})}>
                <option value="">Any</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} BHK</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>
              <Search size={14}/> Apply Filters
            </button>
          </form>
        </aside>

        {/* Results */}
        <div className="props-results">
          {loading ? (
            <div className="spinner-wrap"><div className="spinner"/></div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <span style={{fontSize:'52px'}}>🏘️</span>
              <h3>No Properties Found</h3>
              <p>Try adjusting your filters to find more results.</p>
            </div>
          ) : (
            <>
              <div className="grid-3">
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({length: pages},(_,i)=>i+1).map(p => (
                    <button key={p} className={`pg-btn ${p===page?'active':''}`} onClick={() => fetchProperties(p)}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
