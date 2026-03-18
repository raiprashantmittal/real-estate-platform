import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';

import Home           from './pages/Home';
import Properties     from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import { Login, Register } from './pages/Auth';
import AddProperty    from './pages/AddProperty';
import MyListings     from './pages/MyListings';
import Bookings       from './pages/Bookings';
import Profile        from './pages/Profile';

// Protected route wrapper
function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/properties"  element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />

        <Route path="/bookings" element={
          <Protected><Bookings /></Protected>
        }/>

        <Route path="/profile" element={
          <Protected><Profile /></Protected>
        }/>

        <Route path="/add-property" element={
          <Protected roles={['seller','admin']}><AddProperty /></Protected>
        }/>

        <Route path="/edit-property/:id" element={
          <Protected roles={['seller','admin']}><AddProperty /></Protected>
        }/>

        <Route path="/my-listings" element={
          <Protected roles={['seller','admin']}><MyListings /></Protected>
        }/>

        <Route path="*" element={
          <div className="page">
            <div className="empty-state" style={{minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:'64px'}}>🏚️</span>
              <h3 style={{marginTop:'16px'}}>Page Not Found</h3>
              <p>The page you are looking for does not exist.</p>
              <a href="/" className="btn btn-primary" style={{marginTop:'24px',display:'inline-flex'}}>Go Home</a>
            </div>
          </div>
        }/>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              borderRadius: '12px',
              background: '#2C1810',
              color: '#F7F4EF',
              padding: '12px 18px',
            },
            success: { iconTheme: { primary: '#C9933A', secondary: '#F7F4EF' } },
            error:   { iconTheme: { primary: '#DC2626', secondary: '#F7F4EF' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
