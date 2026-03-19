# 🏠 Real Estate Management Platform

A full stack real estate web application where sellers can list properties and buyers can search, browse, and book site visits.

---

## 📁 Project Structure
```
real-estate-platform/
├── backend/     # Node.js + Express REST API
└── frontend/    # React.js frontend
```

---

## ✨ Features

- JWT Authentication with secure login and registration
- Role Based Access Control — Buyer, Seller, Admin
- Property listings with advanced filters (city, type, price, bedrooms)
- Image upload — up to 5 photos per property with drag and drop
- Image gallery with thumbnails on property detail page
- Visit booking system — buyers request visits, sellers confirm or cancel
- Seller dashboard to manage all listings
- Fully responsive design

---

## 🛠️ Tech Stack

**Backend**
- Node.js, Express.js
- MongoDB with Mongoose ODM
- JWT Authentication + bcryptjs
- Multer for image uploads
- REST API architecture

**Frontend**
- React.js 18
- React Router v6
- Axios for API calls
- React Hot Toast for notifications

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`  
Backend runs on `http://localhost:5000`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/auth/me` | Get logged in user |

### Properties
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/properties` | Get all properties with filters |
| GET | `/api/properties/:id` | Get single property |
| POST | `/api/properties` | Create new listing |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Remove property |
| GET | `/api/properties/my-listings` | Get seller's listings |
| POST | `/api/properties/:id/images` | Upload images |
| DELETE | `/api/properties/:id/images` | Delete an image |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Request a visit |
| GET | `/api/bookings` | Get my bookings |
| PUT | `/api/bookings/:id/status` | Update booking status |

---

## 🔐 Roles & Permissions

| Action | Buyer | Seller | Admin |
|---|---|---|---|
| Browse properties | ✅ | ✅ | ✅ |
| List a property | ❌ | ✅ | ✅ |
| Upload images | ❌ | ✅ | ✅ |
| Book a visit | ✅ | ❌ | ✅ |
| Confirm/cancel booking | ❌ | ✅ | ✅ |
| Manage all users | ❌ | ❌ | ✅ |

---

## 👨‍💻 Author

**Prashant Kumar Rai**  
B.Tech (CS) | M.Tech Computer Engineering — SGSITS Indore  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/prashantkumarrai8788)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/raiprashantmittal)
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat&logo=gmail&logoColor=white)](mailto:mailatprashant10@gmail.com)

To upload it to GitHub:
bashgit add README.md
git commit -m "Add README"
git push
