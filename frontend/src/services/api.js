import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const register  = (data)     => API.post('/auth/register', data);
export const login     = (data)     => API.post('/auth/login', data);
export const getMe     = ()         => API.get('/auth/me');

export const getProperties   = (params)    => API.get('/properties', { params });
export const getPropertyById = (id)        => API.get(`/properties/${id}`);
export const createProperty  = (data)      => API.post('/properties', data);
export const updateProperty  = (id, data)  => API.put(`/properties/${id}`, data);
export const deleteProperty  = (id)        => API.delete(`/properties/${id}`);
export const getMyListings   = ()          => API.get('/properties/my-listings');

export const createBooking       = (data)      => API.post('/bookings', data);
export const getMyBookings       = ()          => API.get('/bookings');
export const updateBookingStatus = (id, data)  => API.put(`/bookings/${id}/status`, data);

export const updateProfile = (data) => API.put('/users/profile', data);
export const getAllUsers   = ()     => API.get('/users');
